import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import i18n from '../app/i18n/i18n';
import { getUpcomingUserCalendarEvents } from './calendar';
import { getReviewedCourseCodes } from './courses';

/**
 * End-of-semester review nudges.
 *
 * The best moment to capture a course review is right after the course ends —
 * the experience is fresh and the student still has the course in mind. We use
 * the user's own exam events as that "course is wrapping up" signal: the day
 * after an exam, we fire a local notification asking them to rate the course.
 *
 * This is intentionally client-side and uses LOCAL scheduled notifications
 * (no server, no push token round-trip). The sync is idempotent: every run
 * cancels the reminders it previously scheduled and rebuilds them from current
 * data, so a course that has since been reviewed simply drops off. All failures
 * are non-fatal — at worst no reminder is scheduled.
 */

// Tags our scheduled notifications so we can find and cancel only our own.
const REMINDER_KIND = 'review_reminder';

// How far ahead to look for exam events (covers a full semester).
const LOOKAHEAD_DAYS = 150;

// Hour of day (local) to fire the reminder on the day after the exam.
const REMINDER_HOUR = 18;

// Don't flood the notification tray — cap the number of scheduled reminders.
const MAX_REMINDERS = 8;

const isExpoGo = Constants.executionEnvironment === 'storeClient';

const normalize = (value?: string) => (value || '').toUpperCase().replace(/\s+/g, '');

interface PlannedReminder {
    courseCode: string;
    displayCode: string;
    matchedCourseId?: string;
    triggerDate: Date;
}

/**
 * Builds a Date for the day after `eventDate` (YYYY-MM-DD) at REMINDER_HOUR,
 * interpreted in local time. Returns null if the date can't be parsed.
 */
const dayAfterAt = (eventDate: string, hour: number): Date | null => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(eventDate);
    if (!m) return null;
    const year = Number(m[1]);
    const month = Number(m[2]);
    const day = Number(m[3]);
    if (!year || !month || !day) return null;
    // month is 1-based here; Date wants 0-based. day + 1 = the day after.
    return new Date(year, month - 1, day + 1, hour, 0, 0, 0);
};

/** Removes all review reminders we previously scheduled. */
const cancelExistingReminders = async (): Promise<void> => {
    try {
        const scheduled = await Notifications.getAllScheduledNotificationsAsync();
        await Promise.all(
            scheduled
                .filter(n => (n.content?.data as any)?.kind === REMINDER_KIND)
                .map(n => Notifications.cancelScheduledNotificationAsync(n.identifier).catch(() => {}))
        );
    } catch (error) {
        console.log('[reviewReminders] cancel existing failed (non-fatal):', error);
    }
};

/**
 * Reconciles the user's scheduled end-of-semester review reminders with their
 * current exam schedule and review history. Safe to call repeatedly (e.g. on
 * every app launch); it fully rebuilds the reminder set each time.
 */
export const syncReviewReminders = async (userId?: string | null): Promise<number> => {
    if (!userId) return 0;
    // Local notifications aren't available in Expo Go (SDK 53+) or on simulators.
    if (isExpoGo || !Device.isDevice) return 0;

    try {
        // Only schedule if the OS already granted notification permission — we
        // never prompt from here (that happens at login).
        const { status } = await Notifications.getPermissionsAsync();
        if (status !== 'granted') return 0;

        const [exams, reviewedCodes] = await Promise.all([
            getUpcomingUserCalendarEvents(userId, { eventTypes: ['exam'], days: LOOKAHEAD_DAYS, limit: 100 }),
            getReviewedCourseCodes(userId),
        ]);

        const now = Date.now();

        // One reminder per course, anchored to its LATEST upcoming exam (biases
        // toward the final over a midterm, i.e. when the course truly wraps up).
        const byCode = new Map<string, PlannedReminder>();
        for (const exam of exams) {
            const code = normalize(exam.courseCode);
            if (!code || reviewedCodes.has(code)) continue;

            const triggerDate = dayAfterAt(exam.eventDate, REMINDER_HOUR);
            if (!triggerDate || triggerDate.getTime() <= now) continue;

            const existing = byCode.get(code);
            if (!existing || triggerDate.getTime() > existing.triggerDate.getTime()) {
                byCode.set(code, {
                    courseCode: code,
                    displayCode: exam.courseCode || code,
                    matchedCourseId: exam.matchedCourseId,
                    triggerDate,
                });
            }
        }

        await cancelExistingReminders();

        const planned = Array.from(byCode.values())
            .sort((a, b) => a.triggerDate.getTime() - b.triggerDate.getTime())
            .slice(0, MAX_REMINDERS);

        for (const reminder of planned) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: i18n.t('notifications.review_reminder_title', {
                        code: reminder.displayCode,
                        defaultValue: '给 {{code}} 打个分？',
                    }),
                    body: i18n.t('notifications.review_reminder_body', {
                        defaultValue: '这学期的课快结束啦，花 30 秒点评一下，帮学弟学妹避坑 🙌',
                    }),
                    data: {
                        kind: REMINDER_KIND,
                        type: REMINDER_KIND,
                        courseCode: reminder.displayCode,
                        matchedCourseId: reminder.matchedCourseId || '',
                        relatedId: `${REMINDER_KIND}:${reminder.courseCode}`,
                    },
                },
                trigger: {
                    type: Notifications.SchedulableTriggerInputTypes.DATE,
                    date: reminder.triggerDate,
                },
            }).catch(err => console.log('[reviewReminders] schedule failed (non-fatal):', err));
        }

        if (planned.length > 0) {
            console.log(`[reviewReminders] scheduled ${planned.length} end-of-semester review reminder(s)`);
        }
        return planned.length;
    } catch (error) {
        console.log('[reviewReminders] sync failed (non-fatal):', error);
        return 0;
    }
};

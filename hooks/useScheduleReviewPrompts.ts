import { useCallback, useEffect, useState } from 'react';
import { getReviewedCourseCodes } from '../services/courses';
import { getUserScheduleEntries } from '../services/schedule';

export interface ScheduleReviewTarget {
    /** Normalized course code (uppercase, no spaces) — used for matching. */
    code: string;
    /** Original course code as stored, for display. */
    displayCode: string;
    title: string;
    /** Canonical DB course id, when the schedule entry was matched to one. */
    matchedCourseId?: string;
}

const normalize = (value?: string) => (value || '').toUpperCase().replace(/\s+/g, '');

interface UseScheduleReviewPromptsResult {
    loading: boolean;
    /** Every course code in the user's timetable. */
    scheduleCodes: Set<string>;
    /** Timetable courses the user has NOT reviewed yet (deduped by code). */
    pendingReviewCourses: ScheduleReviewTarget[];
    /** Whether a given course code is part of the user's timetable. */
    isInSchedule: (code?: string) => boolean;
    refresh: () => void;
}

/**
 * Cross-references the user's timetable with the courses they've already
 * reviewed. This is the backbone of the review-guidance layer: it tells the
 * UI which courses the user actually took (highest-quality review source) and
 * which of those still need a review. All failures are non-fatal — nudges just
 * stay hidden rather than breaking the screen.
 */
export const useScheduleReviewPrompts = (userId?: string | null): UseScheduleReviewPromptsResult => {
    const [loading, setLoading] = useState(false);
    const [scheduleCodes, setScheduleCodes] = useState<Set<string>>(new Set());
    const [pendingReviewCourses, setPendingReviewCourses] = useState<ScheduleReviewTarget[]>([]);

    const load = useCallback(async () => {
        if (!userId) {
            setScheduleCodes(new Set());
            setPendingReviewCourses([]);
            return;
        }

        setLoading(true);
        try {
            const [entries, reviewedCodes] = await Promise.all([
                getUserScheduleEntries(userId, { allowStaleOnError: true }),
                getReviewedCourseCodes(userId),
            ]);

            const codes = new Set<string>();
            const byCode = new Map<string, ScheduleReviewTarget>();
            entries.forEach(entry => {
                const code = normalize(entry.courseCode);
                if (!code) return;
                codes.add(code);
                if (!byCode.has(code)) {
                    byCode.set(code, {
                        code,
                        displayCode: entry.courseCode || code,
                        title: entry.title,
                        matchedCourseId: entry.matchedCourseId,
                    });
                }
            });

            setScheduleCodes(codes);
            setPendingReviewCourses(
                Array.from(byCode.values()).filter(course => !reviewedCodes.has(course.code))
            );
        } catch (error) {
            console.log('useScheduleReviewPrompts failed (non-fatal):', error);
            setScheduleCodes(new Set());
            setPendingReviewCourses([]);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        void load();
    }, [load]);

    const isInSchedule = useCallback(
        (code?: string) => !!code && scheduleCodes.has(normalize(code)),
        [scheduleCodes]
    );

    return { loading, scheduleCodes, pendingReviewCourses, isInSchedule, refresh: load };
};

// lib/monitoring.ts - Centralized crash reporting & error tracking (Sentry).
//
// Design notes:
// - Sentry only initializes when EXPO_PUBLIC_SENTRY_DSN is set. Without a DSN
//   every helper here is a safe no-op, so local dev and contributors without
//   Sentry access are unaffected.
// - Reporting is disabled in __DEV__ by default (you usually have the stack in
//   the console / red box there). Set EXPO_PUBLIC_SENTRY_ENABLE_DEV=1 to force
//   it on while debugging the integration itself.
import Constants from 'expo-constants';
import * as Sentry from '@sentry/react-native';

const DSN = process.env.EXPO_PUBLIC_SENTRY_DSN?.trim() || '';

const isTruthy = (value: string | undefined): boolean =>
    ['1', 'true', 'yes', 'on'].includes((value || '').trim().toLowerCase());

const enableInDev = isTruthy(process.env.EXPO_PUBLIC_SENTRY_ENABLE_DEV);

// __DEV__ is injected by the RN/Metro runtime.
declare const __DEV__: boolean;

const reportingEnabled = !!DSN && (!__DEV__ || enableInDev);

let initialized = false;

/**
 * Initialize crash reporting. Safe to call once, as early as possible (before
 * the root component renders). No-ops when no DSN is configured.
 */
export function initMonitoring(): void {
    if (initialized || !reportingEnabled) return;
    initialized = true;

    Sentry.init({
        dsn: DSN,
        // Lower trace sampling in production to keep event volume / cost sane;
        // crash + error events are always captured regardless of this rate.
        tracesSampleRate: __DEV__ ? 1.0 : 0.1,
        environment: __DEV__ ? 'development' : 'production',
        release: Constants.expoConfig?.version,
        // Don't send default PII (IP address etc.) — this is a student app.
        sendDefaultPii: false,
    });
}

/** Whether Sentry is actively reporting (DSN set + not suppressed in dev). */
export function isMonitoringEnabled(): boolean {
    return reportingEnabled;
}

/**
 * Report a caught error. Falls back to console logging when reporting is off.
 * @param error   The thrown value (Error preferred).
 * @param context Optional structured context attached to the event.
 */
export function reportError(error: unknown, context?: Record<string, unknown>): void {
    if (!reportingEnabled) {
        console.error('[monitoring] error (reporting disabled):', error, context);
        return;
    }
    Sentry.captureException(error, context ? { extra: context } : undefined);
}

/** Attach the signed-in user to subsequent events (call after login). */
export function setMonitoringUser(userId: string | null): void {
    if (!reportingEnabled) return;
    Sentry.setUser(userId ? { id: userId } : null);
}

/**
 * Wrap the root component so Sentry can hook into navigation / native crashes.
 * When reporting is disabled this returns the component unchanged.
 */
export function wrapRootComponent<C>(RootComponent: C): C {
    if (!reportingEnabled) return RootComponent;
    return Sentry.wrap(RootComponent as any) as C;
}

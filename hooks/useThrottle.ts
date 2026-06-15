import { useCallback, useRef } from 'react';
import { useFocusEffect } from 'expo-router';

/**
 * Returns a guarded version of a navigation callback that only fires once
 * until the screen regains focus (i.e. user navigates back).
 * This reliably prevents double-push regardless of tap speed.
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
    callback: T,
    _delay?: number,
): T {
    const locked = useRef(false);
    const callbackRef = useRef<T>(callback);
    callbackRef.current = callback;

    useFocusEffect(
        useCallback(() => {
            locked.current = false;
        }, []),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    return useCallback(
        ((...args: any[]) => {
            if (locked.current) return;
            locked.current = true;
            return callbackRef.current(...args);
        }) as unknown as T,
        [],
    );
}

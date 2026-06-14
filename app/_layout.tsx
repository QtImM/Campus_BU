import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Stack, useNavigationContainerRef, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EULAModal } from '../components/common/EULAModal';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { StartupAnimation } from '../components/common/StartupAnimation';
import { CourseActivityProvider } from '../context/CourseActivityContext';
import { LoginPromptProvider } from '../context/LoginPromptContext';
import { NotificationProvider } from '../context/NotificationContext';
import '../global.css';
import { getUserProfile, onAuthChange, shouldSkipAuthRedirect } from '../services/auth';
import { prefetchBuildings } from '../services/buildings';
import { prefetchLocalCourses } from '../services/courses';
import { acceptCommunityEula, hasAcceptedCommunityEula } from '../services/moderation';
import { syncScheduleToWidgetForUser } from '../services/widgetBridge';
import { registerForPushNotificationsAsync, savePushToken } from '../services/push_notifications';
import { initMonitoring, setMonitoringUser, wrapRootComponent } from '../lib/monitoring';
import './i18n/i18n'; // Initialize i18n
import { i18nPromise } from './i18n/i18n';

// Initialize crash reporting as early as possible (no-op without a DSN).
initMonitoring();

// Keep native splash visible until RootLayout mounts, then hide it without transition.
void SplashScreen.preventAutoHideAsync().catch(() => {
  // ignore when splash screen is already controlled by the runtime
});

// Check if running in Expo Go (where some features are limited)
const isExpoGo = Constants.executionEnvironment === 'storeClient';

function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const navigationRef = useNavigationContainerRef();
  const segmentsRef = useRef(segments);
  const [loading, setLoading] = useState(true);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [eulaVisible, setEulaVisible] = useState(false);
  const [i18nReady, setI18nReady] = useState(false);

  // Keep segmentsRef in sync with latest segments
  useEffect(() => {
    segmentsRef.current = segments;
  }, [segments]);

  // Wait for i18n initialization before rendering
  useEffect(() => {
    i18nPromise.then(() => setI18nReady(true));
  }, []);

  useEffect(() => {
    // SplashScreen.setOptions is not available in Expo Go
    if (!isExpoGo) {
      SplashScreen.setOptions({
        fade: false,
        duration: 0,
      });
    }
    void SplashScreen.hideAsync().catch(() => {
      // ignore if already hidden
    });
  }, []);

  useEffect(() => {
    // Push notifications are not supported in Expo Go SDK 53+
    if (isExpoGo) return;

    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string; relatedId?: string } | undefined;
      const title = String(response.notification.request.content.title || '');
      const match = title.match(/(\d{4}-\d{2}-\d{2})/);
      const digestDate = match?.[1];
      const relatedId = data?.relatedId || '';
      const isDailyDigestNotification =
        relatedId.startsWith('daily_digest:')
        || /ai news digest/i.test(title)
        || title.includes('今日AI资讯摘要');

      if (data?.type === 'broadcast' && relatedId) {
        router.push({ pathname: '/campus/[id]' as any, params: { id: relatedId } });
      } else if (data?.type === 'system' && isDailyDigestNotification) {
        router.push({
          pathname: '/agent/chat',
          params: digestDate ? { digestDate } : undefined,
        });
      }
    });

    return () => {
      subscription.remove();
    };
  }, [router]);

  useEffect(() => {
    // Dismiss the splash exactly once, from whichever path resolves first.
    let settled = false;
    const finishLoading = () => {
      if (settled) return;
      settled = true;
      setLoading(false);
    };

    // Failsafe: the splash must NEVER hang. If the auth/profile/network chain
    // stalls on a slow or dead connection, enter the app anyway after a hard
    // cap (instead of leaving the user stuck at the progress bar, needing a
    // restart). Guest/public screens render fine; auth-gated bits re-check later.
    const failsafeTimer = setTimeout(finishLoading, 5000);

    const checkAuth = async () => {
      // Ensure i18n is initialized
      await i18nPromise;

      const waitForNavReady = () =>
        new Promise<void>((resolve) => {
          if (navigationRef.isReady()) { resolve(); return; }
          const unsub = navigationRef.addListener('state', () => {
            unsub();
            resolve();
          });
        });

      // Normal auth check
      const unsubscribe = onAuthChange(async (user) => {
        try {
          setCurrentUser(user);
          // Tag crash reports with the current user (cleared on sign-out).
          setMonitoringUser(user?.uid ?? null);

          // Skip all redirects if the flag is set (during password reset flow)
          if (shouldSkipAuthRedirect()) {
            finishLoading();
            return;
          }

          await waitForNavReady();

          // Use ref to get latest segments value
          const currentSegments = segmentsRef.current;
          const inAuthGroup = currentSegments[0] === '(auth)';
          const currentSegment = currentSegments.length > 1 ? (currentSegments as string[])[1] : currentSegments[0] || '';

          // Check if forgot-password exists anywhere in segments (more robust check)
          const isForgotPasswordPage = (currentSegments as string[]).includes('forgot-password');

          if (!user) {
            // Guest mode logic:
            // Allow access to (tabs), campus/*, forum/*, courses/* etc.
            // Only redirect to login if they are NOT in the auth group AND NOT on a public page
            const publicGroups = ['(tabs)', 'campus', 'forum', 'courses', 'map', 'classroom'];
            const isPublicPage = publicGroups.includes(currentSegments[0]);

            if (!inAuthGroup && !isPublicPage && !isForgotPasswordPage) {
              router.replace('/(auth)/login');
            }
          } else {
            // Initiate background data prefetching as soon as we know we have a user
            prefetchLocalCourses().catch(e => console.log('Prefetch courses failed:', e));
            prefetchBuildings().catch(e => console.log('Prefetch buildings failed:', e));

            // We already hold a valid session — reveal the app immediately so
            // cold start stays well under 2s, instead of blocking the splash on
            // a profile network round-trip. The profile check below only drives
            // the rare setup-redirect (brand-new accounts) and runs in the
            // background; for returning users (who have a profile) nothing moves.
            finishLoading();

            getUserProfile(user.uid)
              .then((profile) => {
                if (profile === null) {
                  // Confirmed no profile row → onboarding setup.
                  // Skip while in verify / forgot-password flow.
                  if (currentSegment !== 'setup' &&
                    currentSegment !== 'verify' &&
                    !isForgotPasswordPage) {
                    router.replace('/(auth)/setup');
                  }
                } else if (profile) {
                  if (inAuthGroup && currentSegment !== 'setup' && !isForgotPasswordPage) {
                    router.replace('/(tabs)/campus');
                  }
                  // Request push permission after login (non-blocking); token save skipped if undefined (e.g. Expo Go)
                  registerForPushNotificationsAsync()
                    .then(token => { if (token) savePushToken(user.uid, token).catch(() => {}); })
                    .catch(() => {});
                }
              })
              .catch(e => console.log('Profile check failed:', e));
          }
        } catch (err) {
          console.error('RootLayout Auth Check Error:', err);
          // If profile fetch fails due to network, don't yank the user to setup
          // Just let them stay where they are or handle at component level
        }
        finishLoading();
      });

      return unsubscribe;
    };

    checkAuth();
    return () => clearTimeout(failsafeTimer);
  }, []);

  useEffect(() => {
    const root = segments[0] || '';
    const tab = segments[1] || '';

    const requiresEula =
      (root === '(tabs)' && ['campus', 'course', 'messages', 'profile'].includes(tab))
      || ['campus', 'forum', 'courses', 'teachers', 'messages'].includes(root);

    if (!requiresEula) {
      setEulaVisible(false);
      return;
    }

    let cancelled = false;
    const checkEulaGate = async () => {
      const accepted = await hasAcceptedCommunityEula(currentUser?.uid || null);
      if (!cancelled) {
        setEulaVisible(!accepted);
      }
    };

    void checkEulaGate();
    return () => {
      cancelled = true;
    };
  }, [currentUser?.uid, segments]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    // Defer to avoid competing with startup-critical queries (auth, feed)
    const t = setTimeout(() => void syncScheduleToWidgetForUser(currentUser.uid), 3000);
    return () => clearTimeout(t);
  }, [currentUser?.uid]);

  const handleAcceptEula = async () => {
    const accepted = await acceptCommunityEula(currentUser?.uid || null);
    if (accepted) {
      setEulaVisible(false);
      if (!currentUser) {
        router.replace('/(auth)/login');
      }
    }
  };

  // Don't render anything until i18n is initialized to prevent useTranslation warnings
  if (!i18nReady) {
    return null;
  }

  return (
    <ErrorBoundary>
    <GestureHandlerRootView style={{ flex: 1 }}>
      {(!isAnimationFinished || loading) && (
        <StartupAnimation
          isAppReady={!loading}
          onFinish={() => setIsAnimationFinished(true)}
        />
      )}
      <LoginPromptProvider>
        <NotificationProvider>
          <CourseActivityProvider>
            <Stack
              screenOptions={{
                animation: 'slide_from_right',
                animationDuration: 400,
                headerShown: false,
              }}
            >
              <Stack.Screen name="legal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
            </Stack>
            <EULAModal visible={eulaVisible} onAccept={handleAcceptEula} />
            <StatusBar style="auto" />
          </CourseActivityProvider>
        </NotificationProvider>
      </LoginPromptProvider>
    </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

// Wrap with Sentry so it can capture native crashes & navigation context
// (no-op when no DSN is configured).
export default wrapRootComponent(RootLayout);

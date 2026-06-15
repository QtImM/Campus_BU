import type { ExpoConfig } from "expo/config";

const { version: appVersion } = require("./package.json");

const SCHEDULE_WIDGET_PLUGIN = "./plugins/withScheduleWidget";
const APP_GROUP = "group.com.budev.HKCampus";
const WIDGET_TARGET_NAME = "ScheduleWidget";
const WIDGET_BUNDLE_IDENTIFIER = "com.budev.HKCampus.ScheduleWidget";
const SUPABASE_PROJECT_HOST = "fcbsekidlijtidqzkddx.supabase.co";
const isTruthy = (value: string | undefined): boolean =>
    ["1", "true", "yes", "on"].includes((value || "").trim().toLowerCase());

const shouldEnableScheduleWidget = (): boolean => {
    if (process.env.EXPO_ENABLE_SCHEDULE_WIDGET !== undefined) {
        return isTruthy(process.env.EXPO_ENABLE_SCHEDULE_WIDGET);
    }

    return (process.env.EAS_BUILD_PROFILE || "").trim().toLowerCase() !== "production";
};

export default (): ExpoConfig => {
    const ocrApiUrl = (process.env.EXPO_PUBLIC_OCR_API_URL || "").trim();
    const deepseekBaseUrl = (process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || "").trim();
    const sentryEnabled = !!(process.env.EXPO_PUBLIC_SENTRY_DSN || "").trim();
    const widgetEnabled = shouldEnableScheduleWidget();
    const buildNumber = "3";
    const appExtensions = widgetEnabled
        ? [
              {
                  targetName: WIDGET_TARGET_NAME,
                  bundleIdentifier: WIDGET_BUNDLE_IDENTIFIER,
                  entitlements: {
                      "com.apple.security.application-groups": [APP_GROUP],
                  },
              },
          ]
        : [];

    return {
        name: "HKCampus",
        slug: "HKCampus",
        version: appVersion,
        orientation: "portrait",
        icon: "./assets/images/HKCampusicon.png",
        scheme: "hkcampus",
        userInterfaceStyle: "automatic",
        // Reanimated 4 on Expo SDK 54 requires the New Architecture for iOS builds.
        newArchEnabled: true,
        splash: {
            image: "./assets/images/HKCampusicon.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff",
        },
        ios: {
            supportsTablet: true,
            bundleIdentifier: "com.budev.HKCampus",
            buildNumber,
            appleTeamId: "7HQ8YJC7KQ",
            infoPlist: {
                ITSAppUsesNonExemptEncryption: false,
                NSAppTransportSecurity: {
                    NSAllowsArbitraryLoads: true,
                    NSExceptionDomains: {
                        [SUPABASE_PROJECT_HOST]: {
                            NSIncludesSubdomains: true,
                            NSExceptionAllowsInsecureHTTPLoads: true,
                            NSExceptionMinimumTLSVersion: "TLSv1.0",
                            NSExceptionRequiresForwardSecrecy: false,
                        },
                    },
                },
                NSPhotoLibraryUsageDescription:
                    "HKCampus accesses your photo library so you can choose images for your avatar, posts, messages, and schedule import.",
                NSCameraUsageDescription:
                    "HKCampus accesses the camera so you can take and send photos in messages.",
                NSLocationWhenInUseUsageDescription:
                    "HKCampus accesses your location only when you choose location-based campus features such as centering the map or attaching a location to a post.",
                NSFaceIDUsageDescription:
                    "HKCampus uses Face ID to help you sign in securely on this device.",
            },
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/images/HKCampusicon.png",
                backgroundColor: "#ffffff",
            },
            edgeToEdgeEnabled: true,
            predictiveBackGestureEnabled: false,
            package: "com.budev.hkcampus",
            versionCode: 8,
            permissions: [
                "android.permission.RECORD_AUDIO",
                "android.permission.USE_BIOMETRIC",
                "android.permission.USE_FINGERPRINT",
                "android.permission.ACCESS_COARSE_LOCATION",
                "android.permission.ACCESS_FINE_LOCATION",
            ],
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./assets/images/favicon.png",
        },
        plugins: [
            "expo-router",
            "expo-secure-store",
            [
                "expo-image-picker",
                {
                    photosPermission:
                        "HKCampus accesses your photo library so you can choose images for your avatar, posts, messages, and schedule import.",
                    cameraPermission:
                        "HKCampus accesses the camera so you can take and send photos in messages.",
                },
            ],
            [
                "expo-local-authentication",
                {
                    faceIDPermission:
                        "HKCampus uses Face ID to help you sign in securely on this device.",
                },
            ],
            [
                "expo-location",
                {
                    locationWhenInUsePermission:
                        "HKCampus accesses your location only when you choose location-based campus features such as centering the map or attaching a location to a post.",
                },
            ],
            "expo-notifications",
            // Sentry config plugin wires up native crash reporting + source map
            // upload. Only included when a DSN is configured.
            ...(sentryEnabled ? ["@sentry/react-native"] : []),
            ...(widgetEnabled ? [SCHEDULE_WIDGET_PLUGIN] : []),
        ],
        owner: "timchindev",
        experiments: {
            typedRoutes: true,
            inlineModules: {
                watchedDirectories: ["app"],
            },
        } as ExpoConfig["experiments"] & {
            inlineModules: {
                watchedDirectories: string[];
            };
        },
        extra: {
            router: {},
            ocrApiUrl,
            deepseekBaseUrl,
            eas: {
                projectId: "44c59701-d20a-45ae-bf97-d3f3d8cae72d",
                build: {
                    experimental: {
                        ios: {
                            appExtensions,
                        },
                    },
                },
            },
        },
        runtimeVersion: {
            policy: "appVersion",
        },
        updates: {
            url: "https://u.expo.dev/44c59701-d20a-45ae-bf97-d3f3d8cae72d",
        },
    };
};

import type { ExpoConfig } from "expo/config";

import appJson from "./app.json";

type AppJsonShape = {
    expo: ExpoConfig & {
        extra?: Record<string, unknown>;
    };
};

const config = appJson as AppJsonShape;

const SCHEDULE_WIDGET_PLUGIN = "./plugins/withScheduleWidget";
const APP_GROUP = "group.com.budev.HKCampus";
const WIDGET_TARGET_NAME = "ScheduleWidget";
const WIDGET_BUNDLE_IDENTIFIER = "com.budev.HKCampus.ScheduleWidget";

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
    const widgetEnabled = shouldEnableScheduleWidget();
    const existingExtra = (config.expo.extra || {}) as Record<string, unknown>;
    const existingEas = (existingExtra.eas || {}) as Record<string, unknown>;
    const existingBuild = (existingEas.build || {}) as Record<string, unknown>;
    const existingExperimental = (existingBuild.experimental || {}) as Record<string, unknown>;
    const existingIosExperimental = (existingExperimental.ios || {}) as Record<string, unknown>;
    const plugins = (config.expo.plugins || []).filter((plugin) => {
        const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;

        if (pluginName !== SCHEDULE_WIDGET_PLUGIN) {
            return true;
        }

        return widgetEnabled;
    });
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
        ...config.expo,
        plugins,
        extra: {
            ...existingExtra,
            eas: {
                ...existingEas,
                build: {
                    ...existingBuild,
                    experimental: {
                        ...existingExperimental,
                        ios: {
                            ...existingIosExperimental,
                            appExtensions,
                        },
                    },
                },
            },
            ocrApiUrl,
            deepseekBaseUrl,
        },
    };
};

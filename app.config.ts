import type { ExpoConfig } from "expo/config";

import appJson from "./app.json";

type AppJsonShape = {
    expo: ExpoConfig & {
        extra?: Record<string, unknown>;
    };
};

const config = appJson as AppJsonShape;

export default (): ExpoConfig => {
    const ocrApiUrl = (process.env.EXPO_PUBLIC_OCR_API_URL || "").trim();
    const deepseekBaseUrl = (process.env.EXPO_PUBLIC_DEEPSEEK_BASE_URL || "").trim();

    return {
        ...config.expo,
        extra: {
            ...(config.expo.extra || {}),
            ocrApiUrl,
            deepseekBaseUrl,
        },
    };
};

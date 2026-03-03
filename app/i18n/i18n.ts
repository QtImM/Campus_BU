import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import zhHas from './locales/zh-Hans.json';
import zhHant from './locales/zh-Hant.json';

const resources = {
    en: { translation: en },
    'zh-Hans': { translation: zhHas },
    'zh-Hant': { translation: zhHant },
};

// Only import AsyncStorage when needed and when window is available
const getAsyncStorage = () => {
    if (typeof window !== 'undefined') {
        return require('@react-native-async-storage/async-storage').default;
    }
    return {
        getItem: async () => null,
        setItem: async () => {},
    };
};

const initI18n = async () => {
    const AsyncStorage = getAsyncStorage();
    let savedLanguage = await AsyncStorage.getItem('language');

    if (!savedLanguage) {
        // Fallback to device locale
        const locales = Localization.getLocales();
        const deviceLocale = locales[0]?.languageCode;

        if (deviceLocale === 'zh') {
            // Basic detection. 
            // On iOS/Android, getLocales() usually returns explicit codes like 'zh-Hans-CN' or 'zh-Hant-TW'
            // If it is just 'zh', we might check regionCode or languageTag if available
            const languageTag = locales[0]?.languageTag || '';
            if (languageTag.includes('Hant') || languageTag.includes('TW') || languageTag.includes('HK')) {
                savedLanguage = 'zh-Hant';
            } else {
                savedLanguage = 'zh-Hans';
            }
        } else {
            savedLanguage = 'en';
        }
    }

    await i18n.use(initReactI18next).init({
        resources,
        lng: savedLanguage,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        },
        compatibilityJSON: 'v3' as any // Required for Android, cast to silence TS error
    });
};

// Only initialize when window is available (client-side)
if (typeof window !== 'undefined') {
    initI18n();
}

/**
 * Switch language and persist the choice
 */
export const changeLanguage = async (lang: string) => {
    await i18n.changeLanguage(lang);
    const AsyncStorage = getAsyncStorage();
    await AsyncStorage.setItem('language', lang);
};

export default i18n;

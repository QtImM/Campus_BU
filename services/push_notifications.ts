import * as Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from './supabase';

export interface PushTokenData {
    id: string;
    userId: string;
    token: string;
    platform?: string;
}

// Global configuration for how notifications are handled when the app is in foreground
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

/**
 * Requests permission and gets the Expo Push Token for the current device.
 * @param projectId Optional EAS project ID if not defined in app.json
 * @returns The Expo push token string or undefined if failed/denied
 */
export async function registerForPushNotificationsAsync(): Promise<string | undefined> {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }

        if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification! (Permission denied)');
            return undefined;
        }

        try {
            const projectId = Constants.default.expoConfig?.extra?.eas?.projectId || Constants.default.easConfig?.projectId;

            if (!projectId) {
                console.warn('Project ID not found in app.json. Add it in extra.eas.projectId.');
            }

            const tokenData = await Notifications.getExpoPushTokenAsync({
                projectId,
            });
            token = tokenData.data;
            console.log('Expo Push Token generated:', token);
        } catch (e) {
            console.error('Error generating Expo Push Token:', e);
            // Optionally fallback to device token if Expo token fails (less common)
            // token = (await Notifications.getDevicePushTokenAsync()).data;
        }
    } else {
        console.log('Must use physical device for Push Notifications');
    }

    return token;
}

/**
 * Saves a push token to the user_push_tokens table in Supabase.
 * @param userId The UID of the authenticated user
 * @param token The Expo Push Token string
 */
export async function savePushToken(userId: string, token: string): Promise<boolean> {
    if (!userId || !token) return false;

    try {
        const platform = Platform.OS;

        // Use upsert semantics to avoid duplicate constraint errors
        // Note: we might not need to update anything if it exists, so ignoreDuplicates is okay if that's preferred, 
        // but often we want to update the 'updated_at' timestamp.
        const { error } = await supabase
            .from('user_push_tokens')
            .upsert(
                {
                    user_id: userId,
                    token: token,
                    platform: platform
                },
                { onConflict: 'user_id, token' }
            );

        if (error) {
            console.error('Error saving push token to Supabase:', error);
            return false;
        }

        console.log('Successfully saved push token for user:', userId);
        return true;
    } catch (error) {
        console.error('Exception in savePushToken:', error);
        return false;
    }
}

/**
 * Removes a specific push token from the database (e.g., on logout)
 */
export async function removePushToken(userId: string, token: string): Promise<boolean> {
    if (!userId || !token) return false;

    try {
        const { error } = await supabase
            .from('user_push_tokens')
            .delete()
            .match({ user_id: userId, token: token });

        if (error) throw error;
        return true;
    } catch (error) {
        console.error('Error removing push token:', error);
        return false;
    }
}

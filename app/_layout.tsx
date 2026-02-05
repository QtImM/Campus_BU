import AsyncStorage from '@react-native-async-storage/async-storage';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import '../global.css';
import { getUserProfile, onAuthChange } from '../services/auth';

const DEMO_MODE_KEY = 'hkcampus_demo_mode';

// Helper to check/set demo mode
export const setDemoMode = async (enabled: boolean) => {
  if (enabled) {
    await AsyncStorage.setItem(DEMO_MODE_KEY, 'true');
  } else {
    await AsyncStorage.removeItem(DEMO_MODE_KEY);
  }
};

export const isDemoMode = async () => {
  const value = await AsyncStorage.getItem(DEMO_MODE_KEY);
  return value === 'true';
};

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const inAuthGroup = segments[0] === '(auth)';

      // Check for demo mode first
      const demoMode = await isDemoMode();
      if (demoMode) {
        if (inAuthGroup) {
          router.replace('/(tabs)/campus');
        }
        setLoading(false);
        return;
      }

      // Normal auth check
      const unsubscribe = onAuthChange(async (user) => {
        if (!user) {
          if (!inAuthGroup) {
            router.replace('/(auth)/login');
          }
        } else {
          const profile = await getUserProfile(user.uid);
          if (!profile) {
            if (segments.length > 1 && (segments as string[])[1] !== 'setup') {
              router.replace('/(auth)/setup');
            }
          } else if (inAuthGroup) {
            router.replace('/(tabs)/campus');
          }
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    checkAuth();
  }, [segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#1E3A8A" />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <>
      <Slot />
      <StatusBar style="auto" />
    </>
  );
}

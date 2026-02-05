// CRITICAL: These polyfills MUST load before anything else
import 'react-native-url-polyfill/auto';

// Cross-fetch removed to avoid conflict with React Native's fetch

// Now load expo-router
import 'expo-router/entry';


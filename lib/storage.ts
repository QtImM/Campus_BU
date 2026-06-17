// lib/storage.ts - Universal storage implementation for both web and native
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface StorageInterface {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

// AsyncStorage is imported statically (once) instead of being dynamically
// imported on every call. Supabase's auth client reads/writes this storage
// very frequently (session reads, token refresh, sign in/out); a per-call
// `await import(...)` added latency and could interleave with Supabase's
// internal token-refresh lock, occasionally corrupting the persisted session
// (symptoms: "can't log in" / stuck on a blank screen after re-login).
const isWeb = Platform.OS === "web";
const hasLocalStorage = () =>
  typeof window !== "undefined" && !!window.localStorage;

class UniversalStorage implements StorageInterface {
  async getItem(key: string): Promise<string | null> {
    if (isWeb) {
      return hasLocalStorage() ? window.localStorage.getItem(key) : null;
    }
    return AsyncStorage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    if (isWeb) {
      if (hasLocalStorage()) window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    if (isWeb) {
      if (hasLocalStorage()) window.localStorage.removeItem(key);
      return;
    }
    await AsyncStorage.removeItem(key);
  }
}

export default new UniversalStorage();

import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Supabase configuration
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env file."
  );
}

// Platform-aware storage adapter
const createStorageAdapter = () => {
  if (Platform.OS === "web") {
    // Use AsyncStorage for web (which uses localStorage under the hood)
    return {
      getItem: (key) => {
        return AsyncStorage.getItem(key);
      },
      setItem: (key, value) => {
        return AsyncStorage.setItem(key, value);
      },
      removeItem: (key) => {
        return AsyncStorage.removeItem(key);
      },
    };
  } else {
    // Use hybrid storage for mobile platforms
    // SecureStore for small values, AsyncStorage for large values
    return {
      getItem: async (key) => {
        try {
          // First try to get from SecureStore
          const secureValue = await SecureStore.getItemAsync(key);
          if (secureValue !== null) {
            return secureValue;
          }

          // If not found in SecureStore, try AsyncStorage
          return await AsyncStorage.getItem(key);
        } catch (error) {
          console.warn(
            `Error getting ${key} from SecureStore, trying AsyncStorage:`,
            error
          );
          return await AsyncStorage.getItem(key);
        }
      },
      setItem: async (key, value) => {
        try {
          // Check if value is too large for SecureStore (2048 byte limit with some buffer)
          if (value && value.length > 1900) {
            console.log(
              `Value for ${key} is large (${value.length} bytes), using AsyncStorage`
            );
            // Remove from SecureStore if it exists there
            try {
              await SecureStore.deleteItemAsync(key);
            } catch (e) {
              // Ignore errors when trying to delete
            }
            return await AsyncStorage.setItem(key, value);
          } else {
            // Value is small enough for SecureStore
            // Remove from AsyncStorage if it exists there
            try {
              await AsyncStorage.removeItem(key);
            } catch (e) {
              // Ignore errors when trying to remove
            }
            return await SecureStore.setItemAsync(key, value);
          }
        } catch (error) {
          console.warn(
            `Error setting ${key} in SecureStore, falling back to AsyncStorage:`,
            error
          );
          return await AsyncStorage.setItem(key, value);
        }
      },
      removeItem: async (key) => {
        try {
          // Remove from both stores to be safe
          await Promise.allSettled([
            SecureStore.deleteItemAsync(key),
            AsyncStorage.removeItem(key),
          ]);
        } catch (error) {
          console.warn(`Error removing ${key}:`, error);
        }
      },
    };
  }
};

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: createStorageAdapter(),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // Optional: Configure realtime
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

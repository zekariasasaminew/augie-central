import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabase/client";
import { authApi, profileApi } from "../supabase/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    let mounted = true;

    async function getInitialSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile();
        }

        setLoading(false);
      }
    }

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await loadProfile();
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async () => {
    try {
      const { data: profile, error } = await profileApi.getCurrentProfile();
      if (profile && !error) {
        setProfile(profile);
      } else {
        console.error("Error loading profile:", error);
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { error } = await authApi.signIn(email, password);
      return { error };
    } catch (error) {
      return { error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, name) => {
    try {
      setLoading(true);
      const { error } = await authApi.signUp(email, password, name);
      return { error };
    } catch (error) {
      return { error: "An unexpected error occurred" };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await authApi.signOut();
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) {
      await loadProfile();
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Example usage:
//
// 1. Wrap your app with AuthProvider:
// ```jsx
// export default function App() {
//   return (
//     <AuthProvider>
//       <YourAppContent />
//     </AuthProvider>
//   )
// }
// ```
//
// 2. Use in components:
// ```jsx
// function LoginScreen() {
//   const { signIn, loading } = useAuth()
//
//   const handleLogin = async () => {
//     const { error } = await signIn(email, password)
//     if (error) {
//       Alert.alert('Error', error)
//     }
//   }
//
//   return (
//     <View>
//       {/* Your login form */}
//     </View>
//   )
// }
// ```

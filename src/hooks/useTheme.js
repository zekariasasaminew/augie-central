import { useMemo } from "react";
import { useApp } from "../contexts/AppContext";

// Minimal fallback theme that always works
const FALLBACK_THEME = {
  colors: {
    primary: "#0F172A",
    secondary: "#38BDF8",
    accent: "#84CC16",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#64748B",
    border: "#E2E8F0",
    notification: "#EF4444",
    shadow: "rgba(15, 23, 42, 0.08)",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#38BDF8",
  },
  shadows: {
    xs: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

const LIGHT_THEME = {
  colors: {
    primary: "#0F172A",
    secondary: "#38BDF8",
    accent: "#84CC16",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#38BDF8",
    background: "#FFFFFF",
    surface: "#F8FAFC",
    card: "#FFFFFF",
    text: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#64748B",
    border: "#E2E8F0",
    borderLight: "#F1F5F9",
    notification: "#EF4444",
    shadow: "rgba(15, 23, 42, 0.08)",
  },
  shadows: {
    xs: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

const DARK_THEME = {
  colors: {
    primary: "#38BDF8",
    secondary: "#84CC16",
    accent: "#84CC16",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#38BDF8",
    background: "#020617",
    surface: "#1E293B",
    card: "#1E293B",
    text: "#E2E8F0",
    textSecondary: "#94A3B8",
    textTertiary: "#64748B",
    border: "#334155",
    borderLight: "#475569",
    notification: "#EF4444",
    shadow: "rgba(0, 0, 0, 0.3)",
  },
  shadows: {
    xs: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.08,
      shadowRadius: 3,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
    xl: {
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 24,
      elevation: 12,
    },
  },
};

export const useTheme = () => {
  const appContext = useApp();

  return useMemo(() => {
    try {
      const themeMode = appContext?.theme || "light";

      if (themeMode === "dark") {
        return DARK_THEME;
      }

      return LIGHT_THEME;
    } catch (error) {
      console.warn("Theme hook error, using fallback:", error);
      return FALLBACK_THEME;
    }
  }, [appContext?.theme]);
};

export default useTheme;

// Simple constant theme - no dynamic switching for now to avoid runtime errors
export const theme = {
  colors: {
    // Primary colors
    primary: "#0F172A", // Midnight Navy
    primaryLight: "#0369A1",
    secondary: "#0EA5E9", // Sky Blue
    secondaryLight: "#7DD3FC",
    accent: "#A3E635", // Lime Green
    accentLight: "#A3E635",

    // Status colors
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",

    // Backgrounds
    background: "#FFFFFF",
    surface: "#F8FAFC",
    surfaceElevated: "#FFFFFF",
    card: "#FFFFFF",

    // Text colors
    text: "#0F172A",
    textSecondary: "#475569",
    textTertiary: "#64748B",
    textInverse: "#F8FAFC",

    // Borders
    border: "#E2E8F0",
    borderLight: "#E2E8F0",
    borderStrong: "#CBD5E1",

    // Interactive states
    hover: "#E2E8F0",
    pressed: "#E2E8F0",
    disabled: "#CBD5E1",
    focus: "#0EA5E9",

    // Shadows
    shadow: "rgba(15, 23, 42, 0.08)",
    shadowMedium: "rgba(15, 23, 42, 0.12)",
    shadowStrong: "rgba(15, 23, 42, 0.16)",
    overlay: "rgba(0, 0, 0, 0.4)",

    // Special
    notification: "#EF4444",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    xxxxl: 48,
  },
  borderRadius: {
    xs: 4,
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    full: 9999,
  },
  fontSize: {
    xs: 11,
    sm: 12,
    base: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
    xxxxl: 32,
    xxxxxl: 36,
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
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

// Common styles with improved design system
export const commonStyles = {
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  safeArea: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  // Enhanced card styles
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  cardElevated: {
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
  },
  cardCompact: {
    borderRadius: 8,
    padding: 12,
    marginVertical: 6,
  },
  // Enhanced button styles
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonLarge: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonCompact: {
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  // Enhanced input styles
  input: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  inputLarge: {
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 20,
    fontSize: 16,
    borderWidth: 1,
  },
  // Typography improvements
  headerText: {
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  titleText: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  subtitleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "400",
  },
  captionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  // Layout helpers
  flex1: { flex: 1 },
  flexRow: { flexDirection: "row" },
  flexColumn: { flexDirection: "column" },
  itemsCenter: { alignItems: "center" },
  justifyCenter: { justifyContent: "center" },
  justifyBetween: { justifyContent: "space-between" },
  textCenter: { textAlign: "center" },
};

// Animation timings
export const animations = {
  fast: 150,
  normal: 250,
  slow: 400,
  verySlow: 600,
};

// Screen dimensions helpers
export const screenSizes = {
  small: 375, // iPhone SE
  medium: 414, // iPhone 11 Pro Max
  large: 768, // iPad Mini
};

// Export everything from the original file that other components might need
export const lightTheme = theme; // For backwards compatibility
export const darkTheme = theme; // For now, same theme for both modes
export const getTheme = () => theme; // Simple function that always returns the same theme

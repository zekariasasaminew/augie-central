// Modern Tech-Inspired Color Palette
const modernColors = {
  // Primary tech colors
  deepIndigo: "#1E1B4B", // Deep indigo primary
  electricBlue: "#3B82F6", // Electric blue
  indigoLight: "#6366F1", // Lighter indigo

  // Accent colors
  neonGreen: "#10B981", // Emerald green
  coralRed: "#EF4444", // Coral red
  amber: "#F59E0B", // Warm amber

  // Neutrals
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B",
  slate900: "#0F172A",

  // Pure colors
  white: "#FFFFFF",
  black: "#000000",
};

// Light Theme
export const lightTheme = {
  colors: {
    primary: modernColors.deepIndigo,
    primaryLight: modernColors.indigoLight,
    secondary: modernColors.electricBlue,
    accent: modernColors.neonGreen,
    warning: modernColors.amber,
    error: modernColors.coralRed,

    background: modernColors.white,
    surface: modernColors.slate50,
    surfaceElevated: modernColors.white,
    card: modernColors.white,

    text: modernColors.slate900,
    textSecondary: modernColors.slate600,
    textTertiary: modernColors.slate500,

    border: modernColors.slate200,
    borderLight: modernColors.slate100,

    success: modernColors.neonGreen,
    notification: modernColors.coralRed,
    info: modernColors.electricBlue,

    shadow: "rgba(15, 23, 42, 0.08)", // Slate 900 with opacity
    shadowMedium: "rgba(15, 23, 42, 0.12)",
    shadowStrong: "rgba(15, 23, 42, 0.16)",
    overlay: "rgba(0, 0, 0, 0.4)",

    // Interactive states
    hover: modernColors.slate100,
    pressed: modernColors.slate200,
    disabled: modernColors.slate300,
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

// Dark Theme
export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: modernColors.electricBlue,
    primaryLight: modernColors.indigoLight,
    secondary: modernColors.neonGreen,
    accent: modernColors.amber,
    warning: modernColors.amber,
    error: modernColors.coralRed,

    background: modernColors.slate900,
    surface: modernColors.slate800,
    surfaceElevated: modernColors.slate700,
    card: modernColors.slate800,

    text: modernColors.slate50,
    textSecondary: modernColors.slate300,
    textTertiary: modernColors.slate400,

    border: modernColors.slate700,
    borderLight: modernColors.slate600,

    success: modernColors.neonGreen,
    notification: modernColors.coralRed,
    info: modernColors.electricBlue,

    shadow: "rgba(0, 0, 0, 0.3)",
    shadowMedium: "rgba(0, 0, 0, 0.4)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    overlay: "rgba(0, 0, 0, 0.6)",

    // Interactive states
    hover: modernColors.slate700,
    pressed: modernColors.slate600,
    disabled: modernColors.slate600,
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

export default { lightTheme, darkTheme, commonStyles, animations, screenSizes };

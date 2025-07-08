// Modern Balanced Tech Color Palette
const modernColors = {
  // Primary colors (Midnight Navy theme)
  midnightNavy: "#0F172A", // Primary - Midnight Navy
  skyBlue: "#38BDF8", // Secondary - Sky Blue
  limeGreen: "#84CC16", // Accent - Lime Green

  // Extended color palette for variations
  navy50: "#F0F9FF",
  navy100: "#E0F2FE",
  navy200: "#BAE6FD",
  navy300: "#7DD3FC",
  navy400: "#38BDF8",
  navy500: "#0EA5E9",
  navy600: "#0284C7",
  navy700: "#0369A1",
  navy800: "#075985",
  navy900: "#0C4A6E",
  navy950: "#0F172A",

  // Lime variations
  lime50: "#F7FEE7",
  lime100: "#ECFCCB",
  lime200: "#D9F99D",
  lime300: "#BEF264",
  lime400: "#A3E635",
  lime500: "#84CC16",
  lime600: "#65A30D",
  lime700: "#4D7C0F",
  lime800: "#365314",
  lime900: "#1A2E05",

  // Neutrals (Slate scale)
  slate50: "#F8FAFC",
  slate100: "#F1F5F9",
  slate200: "#E2E8F0",
  slate300: "#CBD5E1",
  slate400: "#94A3B8",
  slate500: "#64748B",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1E293B", // Charcoal for dark mode surface
  slate900: "#0F172A", // Deep navy
  slate950: "#020617",

  // Status colors
  red500: "#EF4444",
  orange500: "#F97316",
  amber500: "#F59E0B",
  emerald500: "#10B981",

  // Pure colors
  white: "#FFFFFF",
  black: "#000000",
};

// Light Theme
export const lightTheme = {
  colors: {
    primary: modernColors.midnightNavy, // #0F172A
    primaryLight: modernColors.navy700, // #0369A1
    secondary: modernColors.skyBlue, // #38BDF8
    secondaryLight: modernColors.navy300, // #7DD3FC
    accent: modernColors.limeGreen, // #84CC16
    accentLight: modernColors.lime400, // #A3E635

    success: modernColors.emerald500,
    warning: modernColors.amber500,
    error: modernColors.red500,
    info: modernColors.skyBlue,

    // Backgrounds
    background: modernColors.white,
    surface: modernColors.slate50, // #F8FAFC - Light surface
    surfaceElevated: modernColors.white,
    card: modernColors.white,

    // Text colors
    text: modernColors.slate900, // #0F172A - Deep navy text
    textSecondary: modernColors.slate600, // #475569
    textTertiary: modernColors.slate500, // #64748B
    textInverse: modernColors.slate50, // For dark backgrounds

    // Borders
    border: modernColors.slate200, // #E2E8F0
    borderLight: modernColors.slate100, // #F1F5F9
    borderStrong: modernColors.slate300, // #CBD5E1

    // Interactive states
    hover: modernColors.slate100,
    pressed: modernColors.slate200,
    disabled: modernColors.slate300,
    focus: modernColors.skyBlue,

    // Shadows
    shadow: "rgba(15, 23, 42, 0.08)", // Midnight navy with opacity
    shadowMedium: "rgba(15, 23, 42, 0.12)",
    shadowStrong: "rgba(15, 23, 42, 0.16)",
    overlay: "rgba(0, 0, 0, 0.4)",
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
    primary: modernColors.skyBlue, // #38BDF8 - Sky blue for dark mode
    primaryLight: modernColors.navy300, // #7DD3FC
    secondary: modernColors.limeGreen, // #84CC16 - Lime green
    secondaryLight: modernColors.lime400, // #A3E635
    accent: modernColors.lime500, // #84CC16
    accentLight: modernColors.lime400, // #A3E635

    success: modernColors.emerald500,
    warning: modernColors.amber500,
    error: modernColors.red500,
    info: modernColors.skyBlue,

    // Dark backgrounds
    background: modernColors.slate950, // #020617 - Darkest
    surface: modernColors.slate800, // #1E293B - Charcoal surface
    surfaceElevated: modernColors.slate700, // #334155
    card: modernColors.slate800, // #1E293B

    // Dark text colors
    text: modernColors.slate200, // #E2E8F0 - Light gray text
    textSecondary: modernColors.slate400, // #94A3B8
    textTertiary: modernColors.slate500, // #64748B
    textInverse: modernColors.slate900, // For light backgrounds

    // Dark borders
    border: modernColors.slate700, // #334155
    borderLight: modernColors.slate600, // #475569
    borderStrong: modernColors.slate500, // #64748B

    // Dark interactive states
    hover: modernColors.slate700,
    pressed: modernColors.slate600,
    disabled: modernColors.slate600,
    focus: modernColors.skyBlue,

    // Dark shadows
    shadow: "rgba(0, 0, 0, 0.3)",
    shadowMedium: "rgba(0, 0, 0, 0.4)",
    shadowStrong: "rgba(0, 0, 0, 0.5)",
    overlay: "rgba(0, 0, 0, 0.6)",
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

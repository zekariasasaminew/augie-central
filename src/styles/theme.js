// Augustana College Brand Colors
const brandColors = {
  navy: "#1B365D", // Augustana Navy Blue
  gold: "#F4B942", // Augustana Gold
  white: "#FFFFFF",
  lightGray: "#F5F5F5",
  mediumGray: "#8E8E93",
  darkGray: "#48484A",
};

// Light Theme
export const lightTheme = {
  colors: {
    primary: brandColors.navy,
    secondary: brandColors.gold,
    background: brandColors.white,
    surface: brandColors.lightGray,
    card: brandColors.white,
    text: "#1C1C1E",
    textSecondary: brandColors.mediumGray,
    border: "#E5E5EA",
    notification: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    info: "#007AFF",
    accent: brandColors.gold,
    shadow: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(0, 0, 0, 0.4)",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    title: 28,
    header: 32,
  },
  fontWeight: {
    light: "300",
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
  },
  shadows: {
    sm: {
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

// Dark Theme
export const darkTheme = {
  ...lightTheme,
  colors: {
    primary: brandColors.gold,
    secondary: brandColors.navy,
    background: "#000000",
    surface: "#1C1C1E",
    card: "#2C2C2E",
    text: "#FFFFFF",
    textSecondary: "#8E8E93",
    border: "#38383A",
    notification: "#FF453A",
    success: "#30D158",
    warning: "#FF9F0A",
    info: "#64D2FF",
    accent: brandColors.gold,
    shadow: "rgba(0, 0, 0, 0.3)",
    overlay: "rgba(0, 0, 0, 0.6)",
  },
};

// Common styles
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
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  titleText: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
  },
  captionText: {
    fontSize: 12,
    fontWeight: "400",
  },
};

// Animation timings
export const animations = {
  fast: 200,
  normal: 300,
  slow: 500,
};

// Screen dimensions helpers
export const screenSizes = {
  small: 375, // iPhone SE
  medium: 414, // iPhone 11 Pro Max
  large: 768, // iPad Mini
};

export default { lightTheme, darkTheme, commonStyles, animations, screenSizes };

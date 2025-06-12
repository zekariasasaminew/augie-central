import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme, commonStyles } from "../../styles/theme";
import { validateUserCredentials, isValidEmail } from "../../data/mockData";

const SignInScreen = ({ navigation }) => {
  const { theme, login } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user = validateUserCredentials(email.trim(), password);

      if (user) {
        login(user);
      } else {
        Alert.alert(
          "Sign In Failed",
          "Invalid email or password. Please try again.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Error",
        "An error occurred during sign in. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const styles = createStyles(currentTheme);

  return (
    <SafeAreaView
      style={[
        commonStyles.safeArea,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialIcons
                name="school"
                size={60}
                color={currentTheme.colors.primary}
              />
            </View>
            <Text style={[styles.title, { color: currentTheme.colors.text }]}>
              Welcome to Augie Central
            </Text>
            <Text
              style={[
                styles.subtitle,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Sign in to access student life resources
            </Text>
          </View>

          {/* Demo Credentials Info */}
          <View style={styles.demoInfo}>
            <Text
              style={[
                styles.demoTitle,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Demo Credentials:
            </Text>
            <Text
              style={[
                styles.demoText,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Student: john.doe@augustana.edu / password123
            </Text>
            <Text
              style={[
                styles.demoText,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Admin: admin@augustana.edu / admin123
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Email Address
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.email
                      ? currentTheme.colors.notification
                      : currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.surface,
                  },
                ]}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={currentTheme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: currentTheme.colors.text }]}
                  placeholder="Enter your email"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text
                  style={[
                    styles.errorText,
                    { color: currentTheme.colors.notification },
                  ]}
                >
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.password
                      ? currentTheme.colors.notification
                      : currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.surface,
                  },
                ]}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={currentTheme.colors.textSecondary}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: currentTheme.colors.text }]}
                  placeholder="Enter your password"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialIcons
                    name={showPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={currentTheme.colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text
                  style={[
                    styles.errorText,
                    { color: currentTheme.colors.notification },
                  ]}
                >
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { backgroundColor: currentTheme.colors.primary },
                loading && styles.disabledButton,
              ]}
              onPress={handleSignIn}
              disabled={loading}
            >
              <Text
                style={[
                  styles.signInButtonText,
                  { color: currentTheme.colors.background },
                ]}
              >
                {loading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text
                style={[
                  styles.signUpText,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text
                  style={[
                    styles.signUpLink,
                    { color: currentTheme.colors.primary },
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
      justifyContent: "center",
    },
    header: {
      alignItems: "center",
      marginBottom: 32,
    },
    logoContainer: {
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: "700",
      textAlign: "center",
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    demoInfo: {
      backgroundColor: theme.colors.surface,
      padding: 16,
      borderRadius: 12,
      marginBottom: 32,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    demoTitle: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 8,
    },
    demoText: {
      fontSize: 12,
      marginBottom: 4,
    },
    form: {
      gap: 20,
    },
    inputContainer: {
      gap: 8,
    },
    label: {
      fontSize: 16,
      fontWeight: "500",
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      paddingVertical: 0,
    },
    eyeIcon: {
      padding: 4,
    },
    errorText: {
      fontSize: 14,
      marginTop: 4,
    },
    signInButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 12,
    },
    disabledButton: {
      opacity: 0.6,
    },
    signInButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    signUpContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    signUpText: {
      fontSize: 16,
    },
    signUpLink: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SignInScreen;

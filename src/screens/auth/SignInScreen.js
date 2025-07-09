import React, { useState, useMemo } from "react";
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
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";

import { commonStyles, theme } from "../../styles/theme";
import { isValidEmail } from "../../data/mockData";
import { authApi } from "../../supabase/api";

const SignInScreen = ({ navigation }) => {
  const { signIn, loading: authLoading } = useAuth();
  // const { theme: themeApp } = useApp();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Forgot password modal state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

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
      const { error } = await signIn(email.trim(), password);

      if (error) {
        Alert.alert("Sign In Failed", error, [{ text: "OK" }]);
      }
      // Success is handled automatically by AuthContext
    } catch (error) {
      Alert.alert(
        "Error",
        "An unexpected error occurred during sign in. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!resetEmail.trim()) {
      Alert.alert("Email Required", "Please enter your email address");
      return;
    }

    if (!isValidEmail(resetEmail)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    setResetLoading(true);

    try {
      const { error } = await authApi.resetPassword(resetEmail.trim());

      if (error) {
        Alert.alert("Reset Failed", error);
      } else {
        Alert.alert(
          "Reset Email Sent",
          "Check your email for password reset instructions.",
          [
            {
              text: "OK",
              onPress: () => {
                setShowForgotPassword(false);
                setResetEmail("");
              },
            },
          ]
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setResetLoading(false);
    }
  };

  const styles = useMemo(
    () =>
      createStyles({
        colors: {
          primary: "#0F172A",
          secondary: theme.colors.secondary,
          accent: theme.colors.accent,
          background: "#FFFFFF",
          surface: "#F8FAFC",
          card: "#FFFFFF",
          text: "#0F172A",
          textSecondary: "#475569",
          border: theme.colors.border,
          notification: theme.colors.error,
        },
      }),
    []
  );

  return (
    <SafeAreaView
      style={[commonStyles.safeArea, { backgroundColor: "#FFFFFF" }]}
    >
      {/* <StatusBar style={themeApp === "dark" ? "light" : "dark"} /> */}
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
              <MaterialIcons name="school" size={60} color="#0F172A" />
            </View>
            <Text style={[styles.title, { color: "#0F172A" }]}>
              Welcome to Augie Central
            </Text>
            <Text style={[styles.subtitle, { color: "#475569" }]}>
              Sign in to access student life resources
            </Text>
          </View>

          {/* Info */}
          <View style={styles.demoInfo}>
            <Text style={[styles.demoTitle, { color: "#475569" }]}>
              Sign in with your Augustana email address and password.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Email Address
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.email
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={"#475569"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Enter your email"
                  placeholderTextColor={"#475569"}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.password
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <MaterialIcons
                  name="lock"
                  size={20}
                  color={"#475569"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Enter your password"
                  placeholderTextColor={"#475569"}
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
                    color={"#475569"}
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Forgot Password Link */}
            <TouchableOpacity
              onPress={() => setShowForgotPassword(true)}
              style={styles.forgotPasswordContainer}
            >
              <Text style={[styles.forgotPasswordText, { color: "#0F172A" }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            {/* Sign In Button */}
            <TouchableOpacity
              style={[
                styles.signInButton,
                { backgroundColor: "#0F172A" },
                (loading || authLoading) && styles.disabledButton,
              ]}
              onPress={handleSignIn}
              disabled={loading || authLoading}
            >
              <Text style={[styles.signInButtonText, { color: "#FFFFFF" }]}>
                {loading || authLoading ? "Signing In..." : "Sign In"}
              </Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: "#475569" }]}>
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <Text style={[styles.signUpLink, { color: "#0F172A" }]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotPassword}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowForgotPassword(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: "#FFFFFF" }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: "#0F172A" }]}>
                Reset Password
              </Text>
              <TouchableOpacity
                onPress={() => setShowForgotPassword(false)}
                style={styles.modalCloseButton}
              >
                <MaterialIcons name="close" size={24} color={"#475569"} />
              </TouchableOpacity>
            </View>

            <Text style={[styles.modalDescription, { color: "#475569" }]}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>

            <View style={styles.modalInputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Email Address
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <MaterialIcons
                  name="email"
                  size={20}
                  color={"#475569"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Enter your email"
                  placeholderTextColor={"#475569"}
                  value={resetEmail}
                  onChangeText={setResetEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalCancelButton,
                  { borderColor: theme.colors.border },
                ]}
                onPress={() => setShowForgotPassword(false)}
              >
                <Text style={[styles.modalButtonText, { color: "#0F172A" }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.modalConfirmButton,
                  { backgroundColor: "#0F172A" },
                  resetLoading && styles.disabledButton,
                ]}
                onPress={handleForgotPassword}
                disabled={resetLoading}
              >
                <Text style={[styles.modalButtonText, { color: "#FFFFFF" }]}>
                  {resetLoading ? "Sending..." : "Send Reset Link"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    forgotPasswordContainer: {
      alignItems: "flex-end",
      marginTop: -8,
    },
    forgotPasswordText: {
      fontSize: 14,
      fontWeight: "600",
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
    // Modal styles
    modalOverlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    modalContent: {
      width: "100%",
      borderRadius: 16,
      padding: 24,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.16,
      shadowRadius: 16,
      elevation: 8,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    modalCloseButton: {
      padding: 4,
    },
    modalDescription: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 24,
    },
    modalInputContainer: {
      gap: 8,
      marginBottom: 24,
    },
    modalActions: {
      flexDirection: "row",
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 12,
      alignItems: "center",
    },
    modalCancelButton: {
      borderWidth: 1,
    },
    modalConfirmButton: {
      // backgroundColor applied in component
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SignInScreen;

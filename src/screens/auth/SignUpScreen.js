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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { commonStyles } from "../../styles/theme";
import { isValidEmail, isAugustanaEmail } from "../../data/mockData";

const SignUpScreen = ({ navigation }) => {
  const { signUp, loading: authLoading } = useAuth();
  const { theme } = useApp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    year: "",
    major: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    } else if (!isAugustanaEmail(formData.email)) {
      newErrors.email = "Please use your Augustana College email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    // Year validation
    if (!formData.year.trim()) {
      newErrors.year = "Academic year is required";
    }

    // Major validation
    if (!formData.major.trim()) {
      newErrors.major = "Major is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error } = await signUp(
        formData.email.trim(),
        formData.password,
        formData.name.trim()
      );

      if (error) {
        Alert.alert("Sign Up Failed", error, [{ text: "OK" }]);
      } else {
        Alert.alert(
          "Success",
          "Account created successfully! Please check your email to verify your account.",
          [{ text: "OK", onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.", [
        { text: "OK" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const styles = useMemo(() => createStyles(), []);

  return (
    <SafeAreaView
      style={[commonStyles.safeArea, { backgroundColor: "#FFFFFF" }]}
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
              <MaterialIcons name="person-add" size={60} color={"#0F172A"} />
            </View>
            <Text style={[styles.title, { color: "#0F172A" }]}>
              Join Augie Central
            </Text>
            <Text style={[styles.subtitle, { color: "#475569" }]}>
              Create your account to get started
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Full Name
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.name
                      ? "#EF4444"
                      : "#E2E8F0",
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <MaterialIcons
                  name="person"
                  size={20}
                  color={"#475569"}
                  style={styles.inputIcon}
                />
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Enter your full name"
                  placeholderTextColor={"#475569"}
                  value={formData.name}
                  onChangeText={(value) => updateField("name", value)}
                  autoCapitalize="words"
                  autoComplete="name"
                />
              </View>
              {errors.name && (
                <Text
                  style={[
                    styles.errorText,
                    { color: "#EF4444" },
                  ]}
                >
                  {errors.name}
                </Text>
              )}
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Augustana Email
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.email
                      ? "#EF4444"
                      : "#E2E8F0",
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
                  placeholder="your.name@augustana.edu"
                  placeholderTextColor={"#475569"}
                  value={formData.email}
                  onChangeText={(value) => updateField("email", value)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              {errors.email && (
                <Text
                  style={[
                    styles.errorText,
                    { color: "#EF4444" },
                  ]}
                >
                  {errors.email}
                </Text>
              )}
            </View>

            {/* Year and Major Row */}
            <View style={styles.row}>
              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: "#0F172A" }]}>Year</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: errors.year
                        ? "#EF4444"
                        : "#E2E8F0",
                      backgroundColor: "#F8FAFC",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="school"
                    size={20}
                    color={"#475569"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: "#0F172A" }]}
                    placeholder="Freshman"
                    placeholderTextColor={"#475569"}
                    value={formData.year}
                    onChangeText={(value) => updateField("year", value)}
                    autoCapitalize="words"
                  />
                </View>
                {errors.year && (
                  <Text
                    style={[
                      styles.errorText,
                      { color: "#EF4444" },
                    ]}
                  >
                    {errors.year}
                  </Text>
                )}
              </View>

              <View style={[styles.inputContainer, styles.halfWidth]}>
                <Text style={[styles.label, { color: "#0F172A" }]}>Major</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: errors.major
                        ? "#EF4444"
                        : "#E2E8F0",
                      backgroundColor: "#F8FAFC",
                    },
                  ]}
                >
                  <MaterialIcons
                    name="book"
                    size={20}
                    color={"#475569"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: "#0F172A" }]}
                    placeholder="Computer Science"
                    placeholderTextColor={"#475569"}
                    value={formData.major}
                    onChangeText={(value) => updateField("major", value)}
                    autoCapitalize="words"
                  />
                </View>
                {errors.major && (
                  <Text
                    style={[
                      styles.errorText,
                      { color: "#EF4444" },
                    ]}
                  >
                    {errors.major}
                  </Text>
                )}
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>Password</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.password
                      ? "#EF4444"
                      : "#E2E8F0",
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
                  placeholder="Create a password"
                  placeholderTextColor={"#475569"}
                  value={formData.password}
                  onChangeText={(value) => updateField("password", value)}
                  secureTextEntry={!showPassword}
                  autoComplete="password-new"
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
                <Text
                  style={[
                    styles.errorText,
                    { color: "#EF4444" },
                  ]}
                >
                  {errors.password}
                </Text>
              )}
            </View>

            {/* Confirm Password Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Confirm Password
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.confirmPassword
                      ? "#EF4444"
                      : "#E2E8F0",
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
                  placeholder="Confirm your password"
                  placeholderTextColor={"#475569"}
                  value={formData.confirmPassword}
                  onChangeText={(value) =>
                    updateField("confirmPassword", value)
                  }
                  secureTextEntry={!showConfirmPassword}
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <MaterialIcons
                    name={showConfirmPassword ? "visibility" : "visibility-off"}
                    size={20}
                    color={"#475569"}
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text
                  style={[
                    styles.errorText,
                    { color: "#EF4444" },
                  ]}
                >
                  {errors.confirmPassword}
                </Text>
              )}
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              style={[
                styles.signUpButton,
                { backgroundColor: "#0F172A" },
                (loading || authLoading) && styles.disabledButton,
              ]}
              onPress={handleSignUp}
              disabled={loading || authLoading}
            >
              <Text style={[styles.signUpButtonText, { color: "#FFFFFF" }]}>
                {loading || authLoading
                  ? "Creating Account..."
                  : "Create Account"}
              </Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: "#475569" }]}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text style={[styles.signInLink, { color: "#0F172A" }]}>
                  Sign In
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
      paddingTop: 40,
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
    form: {
      gap: 20,
    },
    row: {
      flexDirection: "row",
      gap: 16,
    },
    halfWidth: {
      flex: 1,
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
    signUpButton: {
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: "center",
      marginTop: 12,
    },
    disabledButton: {
      opacity: 0.6,
    },
    signUpButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
    signInContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 24,
    },
    signInText: {
      fontSize: 16,
    },
    signInLink: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default SignUpScreen;

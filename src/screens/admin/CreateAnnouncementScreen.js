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

import { useAuth } from "../../contexts/AuthContext";
import { lightTheme, darkTheme, commonStyles } from "../../styles/theme";
import { announcementApi } from "../../supabase/api";

const CreateAnnouncementScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  const theme = "light"; // You can implement theme switching later
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });
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

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.trim().length < 10) {
      newErrors.content = "Content must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const { data, error } = await announcementApi.createAnnouncement({
        title: formData.title.trim(),
        content: formData.content.trim(),
      });

      if (error) {
        Alert.alert("Error", error, [{ text: "OK" }]);
      } else {
        Alert.alert("Success", "Announcement created successfully!", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred. Please try again.", [
        { text: "OK" },
      ]);
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

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={currentTheme.colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Create Announcement
        </Text>
        <View style={styles.headerRight} />
      </View>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Form */}
          <View style={styles.form}>
            {/* Title Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Title *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.title
                      ? currentTheme.colors.notification
                      : currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.surface,
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: currentTheme.colors.text }]}
                  placeholder="Enter announcement title"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.title}
                  onChangeText={(value) => updateField("title", value)}
                  autoCapitalize="sentences"
                />
              </View>
              {errors.title && (
                <Text
                  style={[
                    styles.errorText,
                    { color: currentTheme.colors.notification },
                  ]}
                >
                  {errors.title}
                </Text>
              )}
            </View>

            {/* Content Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: currentTheme.colors.text }]}>
                Content *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  {
                    borderColor: errors.content
                      ? currentTheme.colors.notification
                      : currentTheme.colors.border,
                    backgroundColor: currentTheme.colors.surface,
                  },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    styles.textArea,
                    { color: currentTheme.colors.text },
                  ]}
                  placeholder="Enter announcement content"
                  placeholderTextColor={currentTheme.colors.textSecondary}
                  value={formData.content}
                  onChangeText={(value) => updateField("content", value)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />
              </View>
              {errors.content && (
                <Text
                  style={[
                    styles.errorText,
                    { color: currentTheme.colors.notification },
                  ]}
                >
                  {errors.content}
                </Text>
              )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
              <MaterialIcons
                name="info"
                size={16}
                color={currentTheme.colors.textSecondary}
              />
              <Text
                style={[
                  styles.infoText,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                This announcement will be visible to all students and staff.
              </Text>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: currentTheme.colors.primary },
                loading && styles.disabledButton,
              ]}
              onPress={handleCreate}
              disabled={loading}
            >
              <MaterialIcons name="campaign" size={20} color="white" />
              <Text
                style={[
                  styles.createButtonText,
                  { color: currentTheme.colors.background },
                ]}
              >
                {loading ? "Creating..." : "Create Announcement"}
              </Text>
            </TouchableOpacity>
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
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "600",
    },
    headerRight: {
      width: 40,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 24,
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
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    textAreaWrapper: {
      minHeight: 120,
    },
    input: {
      fontSize: 16,
      paddingVertical: 0,
    },
    textArea: {
      minHeight: 96,
    },
    errorText: {
      fontSize: 14,
      marginTop: 4,
    },
    infoContainer: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 8,
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      marginTop: 8,
    },
    infoText: {
      fontSize: 14,
      lineHeight: 20,
      flex: 1,
    },
    createButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 16,
      borderRadius: 12,
      marginTop: 24,
      gap: 8,
    },
    disabledButton: {
      opacity: 0.6,
    },
    createButtonText: {
      fontSize: 16,
      fontWeight: "600",
    },
  });

export default CreateAnnouncementScreen;

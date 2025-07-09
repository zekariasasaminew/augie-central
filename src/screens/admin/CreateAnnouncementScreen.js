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
  Switch,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

import { announcementApi } from "../../supabase/api";

const { width } = Dimensions.get("window");

const CreateAnnouncementScreen = ({ navigation, route }) => {
  console.log(theme);
  const { user, profile } = useAuth();
  // const { theme: themeApp } = useApp();

  const [formData, setFormData] = useState({
    title: "",
    short_description: "",
    content: "",
    category: "general",
    tags: [],
    links: [],
    is_event: false,
    event_date: null,
    event_location: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [newTag, setNewTag] = useState("");
  const [newLink, setNewLink] = useState({ title: "", url: "" });

  const categories = [
    { id: "general", name: "General", icon: "campaign" },
    { id: "academic", name: "Academic", icon: "school" },
    { id: "events", name: "Events", icon: "event" },
    { id: "sports", name: "Sports", icon: "sports" },
    { id: "clubs", name: "Clubs & Organizations", icon: "groups" },
    { id: "campus", name: "Campus Life", icon: "location-city" },
    { id: "dining", name: "Dining", icon: "restaurant" },
    { id: "housing", name: "Housing", icon: "home" },
    { id: "health", name: "Health & Wellness", icon: "local-hospital" },
    { id: "career", name: "Career Services", icon: "work" },
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      updateField("tags", [...formData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    updateField(
      "tags",
      formData.tags.filter((tag) => tag !== tagToRemove)
    );
  };

  const addLink = () => {
    if (newLink.title.trim() && newLink.url.trim()) {
      updateField("links", [...formData.links, { ...newLink }]);
      setNewLink({ title: "", url: "" });
    }
  };

  const removeLink = (index) => {
    updateField(
      "links",
      formData.links.filter((_, i) => i !== index)
    );
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters";
    }

    if (!formData.short_description.trim()) {
      newErrors.short_description = "Short description is required";
    } else if (formData.short_description.trim().length < 10) {
      newErrors.short_description =
        "Short description must be at least 10 characters";
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
    } else if (formData.content.trim().length < 20) {
      newErrors.content = "Content must be at least 20 characters";
    }

    if (formData.is_event && !formData.event_date) {
      newErrors.event_date = "Event date is required for events";
    }

    if (formData.is_event && !formData.event_location.trim()) {
      newErrors.event_location = "Event location is required for events";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateForm()) return;

    setLoading(true);

    try {
      const announcementData = {
        title: formData.title.trim(),
        short_description: formData.short_description.trim(),
        content: formData.content.trim(),
        category: formData.category,
        tags: formData.tags,
        links: formData.links,
        is_event: formData.is_event,
        event_date: formData.event_date,
        event_location: formData.is_event
          ? formData.event_location.trim()
          : null,
      };

      const { data, error } = await announcementApi.createAnnouncement(
        announcementData
      );

      if (error) {
        Alert.alert("Error", error, [{ text: "OK" }]);
      } else {
        Alert.alert("Success", "Announcement created successfully!", [
          {
            text: "OK",
            onPress: () => {
              // Navigate back and trigger refresh
              if (route.params?.onRefresh) {
                route.params.onRefresh();
              }
              navigation.goBack();
            },
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

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      updateField("event_date", selectedDate);
    }
  };

  const styles = useMemo(() => createStyles(), []);

  return (
    <SafeAreaView
      style={[commonStyles.safeArea, { backgroundColor: "#FFFFFF" }]}
    >
      {/* <StatusBar style={themeApp === "dark" ? "light" : "dark"} /> */}

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color={"#0F172A"} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: "#0F172A" }]}>
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
              <Text style={[styles.label, { color: "#0F172A" }]}>Title *</Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.title
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Enter announcement title"
                  placeholderTextColor={"#475569"}
                  value={formData.title}
                  onChangeText={(value) => updateField("title", value)}
                  autoCapitalize="sentences"
                />
              </View>
              {errors.title && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.title}
                </Text>
              )}
            </View>

            {/* Short Description Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Short Description *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  {
                    borderColor: errors.short_description
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, { color: "#0F172A" }]}
                  placeholder="Brief summary for preview"
                  placeholderTextColor={"#475569"}
                  value={formData.short_description}
                  onChangeText={(value) =>
                    updateField("short_description", value)
                  }
                  autoCapitalize="sentences"
                  multiline
                  numberOfLines={2}
                />
              </View>
              {errors.short_description && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.short_description}
                </Text>
              )}
            </View>

            {/* Category Selection */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
              >
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryChip,
                      formData.category === category.id && {
                        backgroundColor: "#0F172A",
                      },
                      { borderColor: theme.colors.border },
                    ]}
                    onPress={() => updateField("category", category.id)}
                  >
                    <MaterialIcons
                      name={category.icon}
                      size={16}
                      color={
                        formData.category === category.id ? "white" : "#475569"
                      }
                    />
                    <Text
                      style={[
                        styles.categoryText,
                        {
                          color:
                            formData.category === category.id
                              ? "white"
                              : "#475569",
                        },
                      ]}
                    >
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Content Input */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>
                Full Content *
              </Text>
              <View
                style={[
                  styles.inputWrapper,
                  styles.textAreaWrapper,
                  {
                    borderColor: errors.content
                      ? theme.colors.error
                      : theme.colors.border,
                    backgroundColor: "#F8FAFC",
                  },
                ]}
              >
                <TextInput
                  style={[styles.input, styles.textArea, { color: "#0F172A" }]}
                  placeholder="Enter detailed announcement content"
                  placeholderTextColor={"#475569"}
                  value={formData.content}
                  onChangeText={(value) => updateField("content", value)}
                  multiline
                  numberOfLines={8}
                  textAlignVertical="top"
                  autoCapitalize="sentences"
                />
              </View>
              {errors.content && (
                <Text style={[styles.errorText, { color: theme.colors.error }]}>
                  {errors.content}
                </Text>
              )}
            </View>

            {/* Tags Section */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>Tags</Text>
              <View style={styles.tagsInputContainer}>
                <View
                  style={[
                    styles.inputWrapper,
                    {
                      borderColor: theme.colors.border,
                      backgroundColor: "#F8FAFC",
                      flex: 1,
                    },
                  ]}
                >
                  <TextInput
                    style={[styles.input, { color: "#0F172A" }]}
                    placeholder="Add a tag"
                    placeholderTextColor={"#475569"}
                    value={newTag}
                    onChangeText={setNewTag}
                    onSubmitEditing={addTag}
                  />
                </View>
                <TouchableOpacity
                  style={[styles.addButton, { backgroundColor: "#0F172A" }]}
                  onPress={addTag}
                >
                  <MaterialIcons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {formData.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {formData.tags.map((tag, index) => (
                    <View
                      key={index}
                      style={[
                        styles.tag,
                        {
                          backgroundColor: "#0F172A" + "15",
                          borderColor: "#0F172A" + "30",
                        },
                      ]}
                    >
                      <Text style={[styles.tagText, { color: "#0F172A" }]}>
                        {tag}
                      </Text>
                      <TouchableOpacity onPress={() => removeTag(tag)}>
                        <MaterialIcons
                          name="close"
                          size={16}
                          color={"#0F172A"}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Event Toggle */}
            <View style={styles.eventToggleContainer}>
              <View style={styles.eventToggleContent}>
                <MaterialIcons
                  name="event"
                  size={24}
                  color={theme.colors.accent}
                />
                <View style={styles.eventToggleText}>
                  <Text style={[styles.eventToggleTitle, { color: "#0F172A" }]}>
                    This is an event
                  </Text>
                  <Text
                    style={[styles.eventToggleSubtitle, { color: "#475569" }]}
                  >
                    Add event-specific details
                  </Text>
                </View>
              </View>
              <Switch
                value={formData.is_event}
                onValueChange={(value) => updateField("is_event", value)}
                trackColor={{
                  false: theme.colors.border,
                  true: theme.colors.accent,
                }}
                thumbColor={"#FFFFFF"}
              />
            </View>

            {/* Event Details (conditional) */}
            {formData.is_event && (
              <>
                {/* Event Date */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: "#0F172A" }]}>
                    Event Date & Time *
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.inputWrapper,
                      {
                        borderColor: errors.event_date
                          ? theme.colors.error
                          : theme.colors.border,
                        backgroundColor: "#F8FAFC",
                      },
                    ]}
                    onPress={() => setShowDatePicker(true)}
                  >
                    <MaterialIcons
                      name="schedule"
                      size={20}
                      color={"#475569"}
                      style={styles.inputIcon}
                    />
                    <Text
                      style={[
                        styles.input,
                        {
                          color: formData.event_date ? "#0F172A" : "#475569",
                        },
                      ]}
                    >
                      {formData.event_date
                        ? formData.event_date.toLocaleString()
                        : "Select date and time"}
                    </Text>
                  </TouchableOpacity>
                  {errors.event_date && (
                    <Text
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {errors.event_date}
                    </Text>
                  )}
                </View>

                {/* Event Location */}
                <View style={styles.inputContainer}>
                  <Text style={[styles.label, { color: "#0F172A" }]}>
                    Event Location *
                  </Text>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        borderColor: errors.event_location
                          ? theme.colors.error
                          : theme.colors.border,
                        backgroundColor: "#F8FAFC",
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="location-on"
                      size={20}
                      color={"#475569"}
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={[styles.input, { color: "#0F172A" }]}
                      placeholder="Event location or venue"
                      placeholderTextColor={"#475569"}
                      value={formData.event_location}
                      onChangeText={(value) =>
                        updateField("event_location", value)
                      }
                    />
                  </View>
                  {errors.event_location && (
                    <Text
                      style={[styles.errorText, { color: theme.colors.error }]}
                    >
                      {errors.event_location}
                    </Text>
                  )}
                </View>
              </>
            )}

            {/* Links Section */}
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: "#0F172A" }]}>Links</Text>
              <View style={styles.linkInputContainer}>
                <View style={styles.linkInputRow}>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: "#F8FAFC",
                        flex: 1,
                        marginRight: 8,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: "#0F172A" }]}
                      placeholder="Link title"
                      placeholderTextColor={"#475569"}
                      value={newLink.title}
                      onChangeText={(value) =>
                        setNewLink((prev) => ({ ...prev, title: value }))
                      }
                    />
                  </View>
                  <View
                    style={[
                      styles.inputWrapper,
                      {
                        borderColor: theme.colors.border,
                        backgroundColor: "#F8FAFC",
                        flex: 1,
                      },
                    ]}
                  >
                    <TextInput
                      style={[styles.input, { color: "#0F172A" }]}
                      placeholder="https://..."
                      placeholderTextColor={"#475569"}
                      value={newLink.url}
                      onChangeText={(value) =>
                        setNewLink((prev) => ({ ...prev, url: value }))
                      }
                      autoCapitalize="none"
                    />
                  </View>
                </View>
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                  onPress={addLink}
                >
                  <MaterialIcons name="add" size={20} color="white" />
                </TouchableOpacity>
              </View>
              {formData.links.length > 0 && (
                <View style={styles.linksContainer}>
                  {formData.links.map((link, index) => (
                    <View
                      key={index}
                      style={[
                        styles.linkItem,
                        {
                          backgroundColor: "#F8FAFC",
                          borderColor: theme.colors.border,
                        },
                      ]}
                    >
                      <View style={styles.linkItemContent}>
                        <MaterialIcons
                          name="link"
                          size={16}
                          color={theme.colors.secondary}
                        />
                        <View style={styles.linkItemText}>
                          <Text
                            style={[styles.linkItemTitle, { color: "#0F172A" }]}
                          >
                            {link.title}
                          </Text>
                          <Text
                            style={[styles.linkItemUrl, { color: "#475569" }]}
                          >
                            {link.url}
                          </Text>
                        </View>
                      </View>
                      <TouchableOpacity onPress={() => removeLink(index)}>
                        <MaterialIcons
                          name="close"
                          size={20}
                          color={"#475569"}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            {/* Info */}
            <View style={styles.infoContainer}>
              <MaterialIcons name="info" size={16} color={"#475569"} />
              <Text style={[styles.infoText, { color: "#475569" }]}>
                This announcement will be visible to all students and staff.
              </Text>
            </View>

            {/* Create Button */}
            <TouchableOpacity
              style={[
                styles.createButton,
                { backgroundColor: "#0F172A" },
                loading && styles.disabledButton,
              ]}
              onPress={handleCreate}
              disabled={loading}
            >
              <MaterialIcons name="campaign" size={20} color="white" />
              <Text style={[styles.createButtonText, { color: "#FFFFFF" }]}>
                {loading ? "Creating..." : "Create Announcement"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Date Picker Modal */}
      {showDatePicker && (
        <DateTimePicker
          value={formData.event_date || new Date()}
          mode="datetime"
          display="default"
          onChange={onDateChange}
          minimumDate={new Date()}
        />
      )}
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
      flexDirection: "row",
      alignItems: "center",
    },
    inputIcon: {
      marginRight: 12,
    },
    textAreaWrapper: {
      minHeight: 120,
    },
    input: {
      fontSize: 16,
      paddingVertical: 0,
      flex: 1,
    },
    textArea: {
      minHeight: 96,
    },
    errorText: {
      fontSize: 14,
      marginTop: 4,
    },
    categoriesContainer: {
      paddingRight: 16,
    },
    categoryChip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 12,
      borderWidth: 1,
      gap: 6,
    },
    categoryText: {
      fontSize: 14,
      fontWeight: "500",
    },
    tagsInputContainer: {
      flexDirection: "row",
      gap: 8,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginTop: 12,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      borderWidth: 1,
      gap: 6,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
    },
    addButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      justifyContent: "center",
      alignItems: "center",
    },
    eventToggleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    eventToggleContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    eventToggleText: {
      flex: 1,
    },
    eventToggleTitle: {
      fontSize: 16,
      fontWeight: "600",
    },
    eventToggleSubtitle: {
      fontSize: 14,
      marginTop: 2,
    },
    linkInputContainer: {
      gap: 8,
    },
    linkInputRow: {
      flexDirection: "row",
    },
    linksContainer: {
      gap: 8,
      marginTop: 12,
    },
    linkItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
    },
    linkItemContent: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      flex: 1,
    },
    linkItemText: {
      flex: 1,
    },
    linkItemTitle: {
      fontSize: 14,
      fontWeight: "600",
    },
    linkItemUrl: {
      fontSize: 12,
      marginTop: 2,
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

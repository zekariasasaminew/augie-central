import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { getTheme, commonStyles } from "../../styles/theme";
import { eventApi, organizationApi } from "../../supabase/api";

const CreateEventScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { theme } = useApp();

  // Temporarily removed currentTheme to debug error

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(
    new Date(Date.now() + 2 * 60 * 60 * 1000)
  ); // 2 hours later
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(
    route?.params?.organizationId || ""
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    try {
      // Load all organizations for dropdown selection
      const { data } = await organizationApi.getOrganizations();
      if (data) {
        setOrganizations(data);
        // Only auto-select if coming from a specific organization
        if (route?.params?.organizationId) {
          setSelectedOrgId(route.params.organizationId);
        }
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    }
  };

  const handleCreate = async () => {
    const isFromOrgTab = !!route?.params?.organizationId;

    if (!title.trim() || !location.trim()) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    // Validate dates
    if (endTime <= startTime) {
      Alert.alert("Error", "End time must be after start time");
      return;
    }

    // Organization is required only when coming from organization tab
    if (isFromOrgTab && !selectedOrgId) {
      Alert.alert("Error", "Organization is required");
      return;
    }

    setLoading(true);
    try {
      const { error } = await eventApi.createEvent({
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim(),
        start_time: startTime.toISOString(),
        end_time: endTime.toISOString(),
        organization_id: selectedOrgId || null,
        requires_rsvp: true,
      });

      if (error) {
        Alert.alert("Error", error);
      } else {
        Alert.alert("Success", "Event created successfully!", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const onStartTimeChange = (event, selectedDate) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartTime(selectedDate);
      // Auto-adjust end time to be 2 hours later if it's before the new start time
      if (endTime <= selectedDate) {
        setEndTime(new Date(selectedDate.getTime() + 2 * 60 * 60 * 1000));
      }
    }
  };

  const onEndTimeChange = (event, selectedDate) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndTime(selectedDate);
    }
  };

  return (
    <SafeAreaView
      style={[
        commonStyles.safeArea,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={currentTheme.colors.text}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>
          Create Event
        </Text>
        <View />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Title *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor={currentTheme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Description
          </Text>
          <TextInput
            style={[
              styles.input,
              styles.textArea,
              {
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              },
            ]}
            value={description}
            onChangeText={setDescription}
            placeholder="Event description"
            placeholderTextColor={currentTheme.colors.textSecondary}
            multiline
            numberOfLines={4}
          />

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Location *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              },
            ]}
            value={location}
            onChangeText={setLocation}
            placeholder="Event location"
            placeholderTextColor={currentTheme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Start Time *
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateButton,
              {
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
              },
            ]}
            onPress={() => setShowStartPicker(true)}
          >
            <MaterialIcons
              name="schedule"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.dateButtonText,
                { color: currentTheme.colors.text },
              ]}
            >
              {formatDateTime(startTime)}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            End Time *
          </Text>
          <TouchableOpacity
            style={[
              styles.input,
              styles.dateButton,
              {
                borderColor: currentTheme.colors.border,
                backgroundColor: currentTheme.colors.surface,
              },
            ]}
            onPress={() => setShowEndPicker(true)}
          >
            <MaterialIcons
              name="schedule"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
            <Text
              style={[
                styles.dateButtonText,
                { color: currentTheme.colors.text },
              ]}
            >
              {formatDateTime(endTime)}
            </Text>
          </TouchableOpacity>

          {showStartPicker && (
            <DateTimePicker
              value={startTime}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onStartTimeChange}
              minimumDate={new Date()}
            />
          )}

          {showEndPicker && (
            <DateTimePicker
              value={endTime}
              mode="datetime"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={onEndTimeChange}
              minimumDate={startTime}
            />
          )}

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Organization {route?.params?.organizationId ? "*" : "(Optional)"}
          </Text>
          {organizations.length > 0 ? (
            <View>
              {!route?.params?.organizationId && (
                <TouchableOpacity
                  style={[
                    styles.orgOption,
                    {
                      backgroundColor:
                        selectedOrgId === ""
                          ? currentTheme.colors.primary
                          : currentTheme.colors.surface,
                      borderColor: currentTheme.colors.border,
                    },
                  ]}
                  onPress={() => setSelectedOrgId("")}
                >
                  <Text
                    style={{
                      color:
                        selectedOrgId === ""
                          ? "white"
                          : currentTheme.colors.text,
                    }}
                  >
                    No Organization (Independent Event)
                  </Text>
                </TouchableOpacity>
              )}
              {organizations.map((org) => (
                <TouchableOpacity
                  key={org.id}
                  style={[
                    styles.orgOption,
                    {
                      backgroundColor:
                        selectedOrgId === org.id
                          ? currentTheme.colors.primary
                          : currentTheme.colors.surface,
                      borderColor: currentTheme.colors.border,
                    },
                  ]}
                  onPress={() => setSelectedOrgId(org.id)}
                >
                  <Text
                    style={{
                      color:
                        selectedOrgId === org.id
                          ? "white"
                          : currentTheme.colors.text,
                    }}
                  >
                    {org.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <Text style={{ color: currentTheme.colors.textSecondary }}>
              No organizations available
            </Text>
          )}

          <TouchableOpacity
            style={[
              styles.createButton,
              { backgroundColor: currentTheme.colors.primary },
            ]}
            onPress={handleCreate}
            disabled={loading}
          >
            <Text style={styles.createButtonText}>
              {loading ? "Creating..." : "Create Event"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateButtonText: {
    fontSize: 16,
    flex: 1,
  },
  orgOption: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 8,
  },
  createButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  createButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CreateEventScreen;

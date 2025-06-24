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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import { useAuth } from "../../contexts/AuthContext";
import { lightTheme, darkTheme, commonStyles } from "../../styles/theme";
import { eventApi, organizationApi } from "../../supabase/api";

const CreateEventScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const theme = "light";
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
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
      const { data } = await organizationApi.getUserOrganizations();
      if (data) {
        setOrganizations(data);
        // Only set the first org if no pre-selected org
        if (!route?.params?.organizationId && data.length > 0) {
          setSelectedOrgId(data[0].id);
        }
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    }
  };

  const handleCreate = async () => {
    if (
      !title.trim() ||
      !location.trim() ||
      !startTime ||
      !endTime ||
      !selectedOrgId
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setLoading(true);
    try {
      const { error } = await eventApi.createEvent({
        title: title.trim(),
        description: description.trim() || null,
        location: location.trim(),
        start_time: startTime,
        end_time: endTime,
        organization_id: selectedOrgId,
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
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              },
            ]}
            value={startTime}
            onChangeText={setStartTime}
            placeholder="2024-12-25T14:00:00"
            placeholderTextColor={currentTheme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            End Time *
          </Text>
          <TextInput
            style={[
              styles.input,
              {
                color: currentTheme.colors.text,
                borderColor: currentTheme.colors.border,
              },
            ]}
            value={endTime}
            onChangeText={setEndTime}
            placeholder="2024-12-25T16:00:00"
            placeholderTextColor={currentTheme.colors.textSecondary}
          />

          <Text style={[styles.label, { color: currentTheme.colors.text }]}>
            Organization *
          </Text>
          {organizations.length > 0 ? (
            <View>
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
              You need to join an organization first
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

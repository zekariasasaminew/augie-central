import React from "react";
import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";

const EventDetailScreen = ({ route }) => {
  const { theme } = useApp();
  const { event } = route.params || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFFFF" }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: "#0F172A" }]}>
          {event?.title || "Event"}
        </Text>
        <Text style={[styles.description, { color: "#475569" }]}>
          {event?.description || "Event details"}
        </Text>
        {event?.location && (
          <Text style={[styles.detail, { color: "#475569" }]}>
            📍 {event.location}
          </Text>
        )}
        {event?.time && (
          <Text style={[styles.detail, { color: "#475569" }]}>
            ⏰ {event.time}
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 16 },
  detail: { fontSize: 14, marginBottom: 8 },
});

export default EventDetailScreen;

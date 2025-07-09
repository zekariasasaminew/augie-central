import React from "react";
import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

const EventDetailScreen = ({ route }) => {
  // const { theme: themeApp } = useApp();
  const { event } = route.params || {};

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {event?.title || "Event"}
        </Text>
        <Text
          style={[styles.description, { color: theme.colors.textSecondary }]}
        >
          {event?.description || "Event details"}
        </Text>
        {event?.location && (
          <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
            📍 {event.location}
          </Text>
        )}
        {event?.time && (
          <Text style={[styles.detail, { color: theme.colors.textSecondary }]}>
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

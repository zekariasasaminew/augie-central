import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme } from "../../styles/theme";

const EventDetailScreen = ({ route }) => {
  const { theme } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { event } = route.params || {};

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          {event?.title || "Event"}
        </Text>
        <Text
          style={[
            styles.description,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          {event?.description || "Event details"}
        </Text>
        {event?.location && (
          <Text
            style={[
              styles.detail,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            📍 {event.location}
          </Text>
        )}
        {event?.time && (
          <Text
            style={[
              styles.detail,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
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

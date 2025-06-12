import React from "react";
import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme } from "../../styles/theme";

const AnnouncementDetailScreen = ({ route }) => {
  const { theme } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { announcement } = route.params;

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          {announcement.title}
        </Text>
        <Text
          style={[styles.content, { color: currentTheme.colors.textSecondary }]}
        >
          {announcement.description}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
});

export default AnnouncementDetailScreen;

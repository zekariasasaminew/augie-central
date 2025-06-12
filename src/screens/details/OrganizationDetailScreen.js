import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme } from "../../styles/theme";

const OrganizationDetailScreen = ({ route }) => {
  const { theme } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;
  const { organization } = route.params || {};

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          {organization?.name || "Organization"}
        </Text>
        <Text
          style={[
            styles.description,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          {organization?.description || "Organization details"}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 16 },
  description: { fontSize: 16, lineHeight: 22 },
});

export default OrganizationDetailScreen;

import React from "react";
import { Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import { useApp } from "../../contexts/AppContext";

const OrganizationDetailScreen = ({ route }) => {
  const { theme } = useApp();
  const { organization } = route.params || {};

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFFFF" }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: "#0F172A" }]}>
          {organization?.name || "Organization"}
        </Text>
        <Text style={[styles.description, { color: "#475569" }]}>
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

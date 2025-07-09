import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { theme } from "../../styles/theme";

const ProfileScreen = ({ navigation }) => {
  const { user, profile, signOut } = useAuth();
  const {
    theme: themeApp,
    toggleTheme,
    notifications,
    updateNotifications,
  } = useApp();

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: "#FFFFFF" }]}>
      {/* <StatusBar style={themeApp === "dark" ? "light" : "dark"} /> */}

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: "#0F172A" }]}>
            <Text style={styles.avatarText}>
              {(profile?.name || user?.user_metadata?.name)?.charAt(0) || "U"}
            </Text>
          </View>
          <Text style={[styles.name, { color: "#0F172A" }]}>
            {profile?.name || user?.user_metadata?.name || "Student Name"}
          </Text>
          <Text style={[styles.email, { color: "#475569" }]}>
            {profile?.email || user?.email || "student@augustana.edu"}
          </Text>
        </View>

        {/* Settings */}
        <View style={[styles.settingsCard, { backgroundColor: "#FFFFFF" }]}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons
                name={themeApp === "dark" ? "dark-mode" : "light-mode"}
                size={24}
                color={"#0F172A"}
              />
              <Text style={[styles.settingText, { color: "#0F172A" }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={themeApp === "dark"}
              onValueChange={toggleTheme}
              trackColor={{
                false: theme.colors.border,
                true: "#0F172A",
              }}
              thumbColor={"#FFFFFF"}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert("Notifications", "Notification settings coming soon!")
            }
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color={"#0F172A"} />
              <Text style={[styles.settingText, { color: "#0F172A" }]}>
                Notifications
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={"#475569"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert("Help", "Contact support at help@augustana.edu")
            }
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="help" size={24} color={"#0F172A"} />
              <Text style={[styles.settingText, { color: "#0F172A" }]}>
                Help & Support
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color={"#475569"} />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: theme.colors.error },
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: "#475569" }]}>
            Augie Central v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  avatarText: {
    color: "white",
    fontSize: 32,
    fontWeight: "700",
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
  },
  settingsCard: {
    borderRadius: 16,
    marginVertical: 24,
    overflow: "hidden",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  settingText: {
    fontSize: 16,
    fontWeight: "500",
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    gap: 8,
    marginTop: 16,
  },
  signOutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 32,
  },
  footerText: {
    fontSize: 12,
  },
});

export default ProfileScreen;

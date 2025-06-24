import { useState, useEffect } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuth } from "../../contexts/AuthContext";
import { lightTheme, darkTheme } from "../../styles/theme";

const ProfileScreen = () => {
  const { user, profile, signOut } = useAuth();
  const [theme, setTheme] = useState("light");
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  // Load theme from storage on mount
  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View
            style={[
              styles.avatar,
              { backgroundColor: currentTheme.colors.primary },
            ]}
          >
            <Text style={styles.avatarText}>
              {(profile?.name || user?.user_metadata?.name)?.charAt(0) || "U"}
            </Text>
          </View>
          <Text style={[styles.name, { color: currentTheme.colors.text }]}>
            {profile?.name || user?.user_metadata?.name || "Student Name"}
          </Text>
          <Text
            style={[styles.email, { color: currentTheme.colors.textSecondary }]}
          >
            {profile?.email || user?.email || "student@augustana.edu"}
          </Text>
        </View>

        {/* Settings */}
        <View
          style={[
            styles.settingsCard,
            { backgroundColor: currentTheme.colors.card },
          ]}
        >
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons
                name={theme === "dark" ? "dark-mode" : "light-mode"}
                size={24}
                color={currentTheme.colors.primary}
              />
              <Text
                style={[
                  styles.settingText,
                  { color: currentTheme.colors.text },
                ]}
              >
                Dark Mode
              </Text>
            </View>
            <Switch
              value={theme === "dark"}
              onValueChange={toggleTheme}
              trackColor={{
                false: currentTheme.colors.border,
                true: currentTheme.colors.primary,
              }}
              thumbColor={currentTheme.colors.card}
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert("Notifications", "Notification settings coming soon!")
            }
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="notifications"
                size={24}
                color={currentTheme.colors.primary}
              />
              <Text
                style={[
                  styles.settingText,
                  { color: currentTheme.colors.text },
                ]}
              >
                Notifications
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() =>
              Alert.alert("Help", "Contact support at help@augustana.edu")
            }
          >
            <View style={styles.settingLeft}>
              <MaterialIcons
                name="help"
                size={24}
                color={currentTheme.colors.primary}
              />
              <Text
                style={[
                  styles.settingText,
                  { color: currentTheme.colors.text },
                ]}
              >
                Help & Support
              </Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={[
            styles.signOutButton,
            { backgroundColor: currentTheme.colors.notification },
          ]}
          onPress={handleLogout}
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footer}>
          <Text
            style={[
              styles.footerText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
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

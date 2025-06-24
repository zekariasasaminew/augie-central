import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  RefreshControl,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { lightTheme, darkTheme } from "../../styles/theme";
import { organizationApi } from "../../supabase/api";
import { organizationCategories } from "../../data/mockData";

const OrganizationsScreen = () => {
  const { user } = useAuth();
  const theme = "light"; // You can implement theme switching later
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [organizations, setOrganizations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadOrganizations = useCallback(async () => {
    try {
      const { data, error } = await organizationApi.getOrganizations();
      if (data && !error) {
        setOrganizations(data);
      } else {
        console.error("Error loading organizations:", error);
      }
    } catch (error) {
      console.error("Error loading organizations:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadOrganizations();
    setRefreshing(false);
  }, [loadOrganizations]);

  useEffect(() => {
    loadOrganizations();
  }, [loadOrganizations]);

  const filteredOrganizations = organizations.filter(
    (org) => selectedCategory === "all" || org.category === selectedCategory
  );

  const handleJoinOrganization = async (org) => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to join organizations."
      );
      return;
    }

    const action = org.user_is_member ? "leave" : "join";
    const actionText = org.user_is_member ? "Leave" : "Join";

    Alert.alert(
      `${actionText} Organization`,
      `Would you like to ${action} ${org.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: actionText,
          onPress: async () => {
            try {
              let result;
              if (org.user_is_member) {
                result = await organizationApi.leaveOrganization(org.id);
              } else {
                result = await organizationApi.joinOrganization(org.id);
              }

              if (result.error) {
                Alert.alert("Error", result.error);
              } else {
                // Update local state
                setOrganizations((prev) =>
                  prev.map((o) =>
                    o.id === org.id
                      ? {
                          ...o,
                          user_is_member: !o.user_is_member,
                          member_count: o.user_is_member
                            ? o.member_count - 1
                            : o.member_count + 1,
                        }
                      : o
                  )
                );
                Alert.alert("Success", `You have ${action}ed ${org.name}!`);
              }
            } catch (error) {
              Alert.alert(
                "Error",
                "An unexpected error occurred. Please try again."
              );
            }
          },
        },
      ]
    );
  };

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && {
          backgroundColor: currentTheme.colors.primary,
        },
        { borderColor: currentTheme.colors.border },
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <MaterialIcons
        name={item.icon}
        size={16}
        color={
          selectedCategory === item.id
            ? "white"
            : currentTheme.colors.textSecondary
        }
      />
      <Text
        style={[
          styles.categoryText,
          {
            color:
              selectedCategory === item.id
                ? "white"
                : currentTheme.colors.textSecondary,
          },
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderOrganization = ({ item }) => (
    <View
      style={[styles.orgCard, { backgroundColor: currentTheme.colors.card }]}
    >
      <View style={styles.orgHeader}>
        <View
          style={[
            styles.orgLogo,
            { backgroundColor: currentTheme.colors.primary },
          ]}
        >
          <Text style={styles.orgLogoText}>{item.name.charAt(0)}</Text>
        </View>

        <View style={styles.orgInfo}>
          <Text style={[styles.orgName, { color: currentTheme.colors.text }]}>
            {item.name}
          </Text>
          <Text
            style={[
              styles.orgDescription,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {item.description}
          </Text>
          <Text
            style={[
              styles.orgMeetings,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            📅 {item.meetingSchedule}
          </Text>
        </View>
      </View>

      <View style={styles.orgFooter}>
        <View style={styles.orgStats}>
          <MaterialIcons
            name="people"
            size={16}
            color={currentTheme.colors.textSecondary}
          />
          <Text
            style={[
              styles.orgStatsText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {item.member_count} members
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.joinButton,
            item.user_is_member
              ? {
                  backgroundColor: currentTheme.colors.surface,
                  borderColor: currentTheme.colors.border,
                  borderWidth: 1,
                }
              : { backgroundColor: currentTheme.colors.primary },
          ]}
          onPress={() => handleJoinOrganization(item)}
        >
          <Text
            style={[
              styles.joinButtonText,
              {
                color: item.user_is_member ? currentTheme.colors.text : "white",
              },
            ]}
          >
            {item.user_is_member ? "Joined" : "Join"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>
            Student Organizations
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Find and join organizations that match your interests
          </Text>
        </View>

        {/* Categories */}
        <FlatList
          data={organizationCategories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        />

        {/* Organizations */}
        <FlatList
          data={filteredOrganizations}
          renderItem={renderOrganization}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.organizationsContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={currentTheme.colors.primary}
              colors={[currentTheme.colors.primary]}
            />
          }
        />
      </View>
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
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  categoriesContainer: {
    paddingRight: 16,
    marginBottom: 24,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    gap: 6,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: "500",
  },
  organizationsContainer: {
    paddingBottom: 100,
  },
  orgCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  orgHeader: {
    flexDirection: "row",
    marginBottom: 16,
  },
  orgLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  orgLogoText: {
    color: "white",
    fontSize: 24,
    fontWeight: "700",
  },
  orgInfo: {
    flex: 1,
  },
  orgName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
  },
  orgDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  orgMeetings: {
    fontSize: 12,
    fontStyle: "italic",
  },
  orgFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orgStats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  orgStatsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  joinButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});

export default OrganizationsScreen;

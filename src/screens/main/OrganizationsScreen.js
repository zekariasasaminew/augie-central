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
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { getTheme } from "../../styles/theme";
import { organizationApi } from "../../supabase/api";
import { organizationCategories } from "../../data/mockData";

const OrganizationsScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  const { theme } = useApp();

  // Temporarily removed currentTheme to debug error

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [organizations, setOrganizations] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);

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

  const getSelectedCategoryName = () => {
    const category = organizationCategories.find(
      (cat) => cat.id === selectedCategory
    );
    return category ? category.name : "All";
  };

  const getActiveFilterCount = () => {
    return selectedCategory === "all" ? 0 : 1;
  };

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

  const selectFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setShowFilterModal(false);
  };

  const renderFilterModal = () => (
    <Modal
      visible={showFilterModal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setShowFilterModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.filterModal,
            {
              backgroundColor: currentTheme.colors.card,
              borderColor: currentTheme.colors.border,
              shadowColor: currentTheme.colors.shadow,
            },
            currentTheme.shadows.lg,
          ]}
        >
          <View style={styles.filterModalHeader}>
            <Text
              style={[
                styles.filterModalTitle,
                { color: currentTheme.colors.text },
              ]}
            >
              Filter Organizations
            </Text>
            <TouchableOpacity
              onPress={() => setShowFilterModal(false)}
              style={styles.filterModalClose}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={currentTheme.colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.filterOptions}>
            {organizationCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.filterOption,
                  selectedCategory === category.id && {
                    backgroundColor: currentTheme.colors.primary + "15",
                    borderColor: currentTheme.colors.primary,
                  },
                  {
                    borderColor: currentTheme.colors.border,
                    backgroundColor:
                      selectedCategory === category.id
                        ? currentTheme.colors.primary + "15"
                        : currentTheme.colors.surface,
                  },
                ]}
                onPress={() => selectFilter(category.id)}
              >
                <View style={styles.filterOptionContent}>
                  <MaterialIcons
                    name={category.icon}
                    size={20}
                    color={
                      selectedCategory === category.id
                        ? currentTheme.colors.primary
                        : currentTheme.colors.textSecondary
                    }
                  />
                  <Text
                    style={[
                      styles.filterOptionText,
                      {
                        color:
                          selectedCategory === category.id
                            ? currentTheme.colors.primary
                            : currentTheme.colors.text,
                      },
                    ]}
                  >
                    {category.name}
                  </Text>
                </View>
                {selectedCategory === category.id && (
                  <MaterialIcons
                    name="check"
                    size={20}
                    color={currentTheme.colors.primary}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.filterModalActions}>
            <TouchableOpacity
              style={[
                styles.filterModalButton,
                styles.clearButton,
                {
                  borderColor: currentTheme.colors.border,
                  backgroundColor: currentTheme.colors.surface,
                },
              ]}
              onPress={clearFilters}
            >
              <Text
                style={[
                  styles.filterModalButtonText,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                Clear All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterModalButton,
                styles.applyButton,
                { backgroundColor: currentTheme.colors.primary },
              ]}
              onPress={() => setShowFilterModal(false)}
            >
              <Text
                style={[
                  styles.filterModalButtonText,
                  { color: currentTheme.colors.background },
                ]}
              >
                Apply Filters
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderOrganization = ({ item }) => (
    <View
      style={[
        styles.orgCard,
        {
          backgroundColor: currentTheme.colors.card,
          borderColor: currentTheme.colors.borderLight,
          shadowColor: currentTheme.colors.shadow,
        },
        currentTheme.shadows.md,
      ]}
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
          <View style={styles.orgMeetingInfo}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={currentTheme.colors.textTertiary}
            />
            <Text
              style={[
                styles.orgMeetings,
                { color: currentTheme.colors.textTertiary },
              ]}
            >
              {item.meetingSchedule}
            </Text>
          </View>
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

        <View style={styles.buttonContainer}>
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
                  color: item.user_is_member
                    ? currentTheme.colors.text
                    : "white",
                },
              ]}
            >
              {item.user_is_member ? "Joined" : "Join"}
            </Text>
          </TouchableOpacity>

          {item.user_is_member && profile?.is_admin && (
            <TouchableOpacity
              style={[
                styles.createEventButton,
                { backgroundColor: currentTheme.colors.secondary },
              ]}
              onPress={() =>
                navigation.navigate("CreateEvent", { organizationId: item.id })
              }
            >
              <MaterialIcons name="add-circle" size={16} color="white" />
              <Text style={styles.createEventButtonText}>Create Event</Text>
            </TouchableOpacity>
          )}
        </View>
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

        {/* Filter Controls */}
        <View style={styles.filterControls}>
          {selectedCategory !== "all" && (
            <View style={styles.activeFilters}>
              <View
                style={[
                  styles.activeFilterChip,
                  {
                    backgroundColor: currentTheme.colors.primary + "15",
                    borderColor: currentTheme.colors.primary + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: currentTheme.colors.primary },
                  ]}
                >
                  {getSelectedCategoryName()}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedCategory("all")}
                  style={styles.removeFilterButton}
                >
                  <MaterialIcons
                    name="close"
                    size={16}
                    color={currentTheme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Results Header */}
        <View style={styles.resultsHeader}>
          <Text
            style={[
              styles.resultsText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {filteredOrganizations.length} organization
            {filteredOrganizations.length !== 1 ? "s" : ""} found
          </Text>
        </View>

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

      {/* Floating Filter Button */}
      <TouchableOpacity
        style={[
          styles.floatingFilterButton,
          {
            backgroundColor: currentTheme.colors.primary,
            shadowColor: currentTheme.colors.shadow,
          },
          currentTheme.shadows.lg,
        ]}
        onPress={() => setShowFilterModal(true)}
      >
        <MaterialIcons name="tune" size={24} color="white" />
        {getActiveFilterCount() > 0 && (
          <View
            style={[
              styles.filterBadge,
              { backgroundColor: currentTheme.colors.accent },
            ]}
          >
            <Text style={styles.filterBadgeText}>{getActiveFilterCount()}</Text>
          </View>
        )}
      </TouchableOpacity>

      {renderFilterModal()}
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
  filterControls: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  activeFilters: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  removeFilterButton: {
    padding: 4,
  },
  resultsHeader: {
    marginBottom: 24,
  },
  resultsText: {
    fontSize: 16,
    fontWeight: "500",
  },
  organizationsContainer: {
    paddingBottom: 100,
  },
  orgCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
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
  orgMeetingInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
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
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
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
  createEventButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  createEventButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  filterModal: {
    width: "80%",
    height: "80%",
    borderRadius: 16,
    padding: 24,
  },
  filterModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  filterModalTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  filterModalClose: {
    padding: 8,
  },
  filterOptions: {
    flex: 1,
    marginBottom: 24,
  },
  filterOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
    borderWidth: 1,
    gap: 6,
  },
  filterOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  filterModalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterModalButton: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  clearButton: {
    backgroundColor: "transparent",
  },
  applyButton: {
    backgroundColor: "transparent",
  },
  filterModalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  floatingFilterButton: {
    position: "absolute",
    top: 16,
    right: 16,
    padding: 16,
    borderRadius: 20,
  },
  filterBadge: {
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 8,
  },
  filterBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
});

export default OrganizationsScreen;

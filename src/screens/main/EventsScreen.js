import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
  RefreshControl,
  Modal,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme } from "../../styles/theme";
import { eventApi } from "../../supabase/api";

const EventsScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  const { theme } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const eventCategories = [
    { id: "all", name: "All Events", icon: "event" },
    { id: "academic", name: "Academic", icon: "school" },
    { id: "social", name: "Social", icon: "people" },
    { id: "sports", name: "Sports", icon: "sports" },
    { id: "cultural", name: "Cultural", icon: "theater-comedy" },
    { id: "workshop", name: "Workshops", icon: "build" },
    { id: "career", name: "Career", icon: "work" },
  ];

  const loadEvents = useCallback(async () => {
    try {
      const result = await eventApi.getEvents(1, 20);
      if (result.data) {
        setEvents(result.data);
      }
    } catch (error) {
      console.error("Error loading events:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadEvents();
    setRefreshing(false);
  }, [loadEvents]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Get today's date
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Filter events based on selected criteria
  const filteredEvents = events.filter((event) => {
    // Filter by category
    if (selectedCategory !== "all" && event.category !== selectedCategory) {
      return false;
    }

    // Filter by selected date
    if (selectedDate) {
      const eventDate = new Date(event.start_time);
      const selectedDateString = selectedDate.toISOString().split("T")[0];
      const eventDateString = eventDate.toISOString().split("T")[0];
      if (eventDateString !== selectedDateString) {
        return false;
      }
    }

    return true;
  });

  // Get upcoming events (default view)
  const upcomingEvents = selectedDate
    ? filteredEvents
    : filteredEvents.filter((event) => {
        const eventDate = new Date(event.start_time);
        return eventDate >= today;
      });

  const handleRSVP = async (event) => {
    if (!user) {
      Alert.alert(
        "Authentication Required",
        "Please sign in to RSVP to events."
      );
      return;
    }

    const action = event.user_has_rsvped ? "cancel your RSVP for" : "RSVP to";
    const actionText = event.user_has_rsvped ? "Cancel RSVP" : "RSVP";

    Alert.alert("RSVP", `Would you like to ${action} ${event.title}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: actionText,
        onPress: async () => {
          try {
            let result;
            if (event.user_has_rsvped) {
              result = await eventApi.cancelRSVP(event.id);
            } else {
              result = await eventApi.rsvpToEvent(event.id);
            }

            if (result.error) {
              Alert.alert("Error", result.error);
            } else {
              // Update local state
              setEvents((prev) =>
                prev.map((e) =>
                  e.id === event.id
                    ? {
                        ...e,
                        user_has_rsvped: !e.user_has_rsvped,
                        rsvp_count: e.user_has_rsvped
                          ? e.rsvp_count - 1
                          : e.rsvp_count + 1,
                      }
                    : e
                )
              );
              Alert.alert(
                "Success",
                `You have ${
                  event.user_has_rsvped ? "cancelled your RSVP" : "RSVP'd"
                } for ${event.title}!`
              );
            }
          } catch (error) {
            Alert.alert(
              "Error",
              "An unexpected error occurred. Please try again."
            );
          }
        },
      },
    ]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusColor = (event) => {
    if (event.user_has_rsvped) return currentTheme.colors.success;
    const eventDate = new Date(event.start_time);
    const today = new Date();
    if (eventDate < today) return currentTheme.colors.textSecondary;
    return currentTheme.colors.primary;
  };

  const renderEvent = ({ item }) => (
    <View
      style={[styles.eventCard, { backgroundColor: currentTheme.colors.card }]}
    >
      <View style={styles.eventHeader}>
        <View style={styles.eventDate}>
          <Text
            style={[
              styles.eventDateText,
              { color: currentTheme.colors.primary },
            ]}
          >
            {formatDate(item.start_time)}
          </Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(item) },
            ]}
          />
        </View>

        <View style={styles.eventCategory}>
          <MaterialIcons
            name={getCategoryIcon(item.category)}
            size={16}
            color={currentTheme.colors.textSecondary}
          />
          <Text
            style={[
              styles.categoryText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {item.student_organizations?.name || "Event"}
          </Text>
        </View>
      </View>

      <Text style={[styles.eventTitle, { color: currentTheme.colors.text }]}>
        {item.title}
      </Text>

      <Text
        style={[
          styles.eventDescription,
          { color: currentTheme.colors.textSecondary },
        ]}
      >
        {item.description || "No description available"}
      </Text>

      <View style={styles.eventDetails}>
        <View style={styles.eventDetail}>
          <MaterialIcons
            name="schedule"
            size={16}
            color={currentTheme.colors.textSecondary}
          />
          <Text
            style={[
              styles.eventDetailText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {formatTime(item.start_time)} - {formatTime(item.end_time)}
          </Text>
        </View>

        <View style={styles.eventDetail}>
          <MaterialIcons
            name="location-on"
            size={16}
            color={currentTheme.colors.textSecondary}
          />
          <Text
            style={[
              styles.eventDetailText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {item.location}
          </Text>
        </View>
      </View>

      <View style={styles.eventFooter}>
        <View style={styles.attendeeInfo}>
          <MaterialIcons
            name="people"
            size={16}
            color={currentTheme.colors.textSecondary}
          />
          <Text
            style={[
              styles.attendeeText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {item.rsvp_count || 0} attending
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.rsvpButton,
            item.user_has_rsvped
              ? { backgroundColor: currentTheme.colors.success }
              : { backgroundColor: currentTheme.colors.primary },
          ]}
          onPress={() => handleRSVP(item)}
        >
          <MaterialIcons
            name={item.user_has_rsvped ? "check" : "add"}
            size={16}
            color="white"
          />
          <Text style={styles.rsvpButtonText}>
            {item.user_has_rsvped ? "RSVP'd" : "RSVP"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const getCategoryIcon = (category) => {
    switch (category) {
      case "academic":
        return "school";
      case "career":
        return "work";
      case "social":
        return "people";
      case "service":
        return "volunteer-activism";
      case "wellness":
        return "favorite";
      default:
        return "event";
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>
          Campus Events
        </Text>
        <TouchableOpacity
          style={[
            styles.calendarToggle,
            { backgroundColor: currentTheme.colors.surface },
          ]}
          onPress={() => setShowCalendar(!showCalendar)}
        >
          <MaterialIcons
            name={showCalendar ? "calendar-view-month" : "list"}
            size={20}
            color={currentTheme.colors.primary}
          />
        </TouchableOpacity>
      </View>

      <Text
        style={[styles.subtitle, { color: currentTheme.colors.textSecondary }]}
      >
        {selectedDate
          ? `Events for ${formatDate(selectedDate)}`
          : "Upcoming events and activities"}
      </Text>
    </View>
  );

  const renderQuickDates = () => {
    const quickDates = [
      { label: "Today", date: today },
      {
        label: "Tomorrow",
        date: new Date(today.getTime() + 24 * 60 * 60 * 1000),
      },
      { label: "This Week", date: null }, // Special case for this week
    ];

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickDatesContainer}
        contentContainerStyle={styles.quickDatesContent}
      >
        <TouchableOpacity
          style={[
            styles.quickDateChip,
            !selectedDate && {
              backgroundColor: currentTheme.colors.primary,
            },
            { borderColor: currentTheme.colors.border },
          ]}
          onPress={() => setSelectedDate(null)}
        >
          <Text
            style={[
              styles.quickDateText,
              {
                color: !selectedDate
                  ? "white"
                  : currentTheme.colors.textSecondary,
              },
            ]}
          >
            All Events
          </Text>
        </TouchableOpacity>

        {quickDates.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.quickDateChip,
              selectedDate &&
                item.date &&
                selectedDate.toDateString() === item.date.toDateString() && {
                  backgroundColor: currentTheme.colors.primary,
                },
              { borderColor: currentTheme.colors.border },
            ]}
            onPress={() => setSelectedDate(item.date)}
          >
            <Text
              style={[
                styles.quickDateText,
                {
                  color:
                    selectedDate &&
                    item.date &&
                    selectedDate.toDateString() === item.date.toDateString()
                      ? "white"
                      : currentTheme.colors.textSecondary,
                },
              ]}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedDate) count++;
    return count;
  };

  const getSelectedCategoryName = () => {
    const category = eventCategories.find((cat) => cat.id === selectedCategory);
    return category ? category.name : "All Events";
  };

  const selectFilter = (categoryId) => {
    setSelectedCategory(categoryId);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedDate(null);
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
              Filter Events
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
            {eventCategories.map((category) => (
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

  const renderCalendar = () => (
    <View style={styles.calendarContainer}>
      {/* Calendar component implementation */}
    </View>
  );

  const renderEventsList = () => (
    <View style={styles.eventsContainer}>
      <FlatList
        data={upcomingEvents}
        renderItem={renderEvent}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.eventsList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.colors.primary}
            colors={[currentTheme.colors.primary]}
          />
        }
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="event"
              size={64}
              color={currentTheme.colors.textSecondary}
            />
            <Text
              style={[styles.emptyTitle, { color: currentTheme.colors.text }]}
            >
              No Events Found
            </Text>
            <Text
              style={[
                styles.emptyDescription,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              {selectedDate
                ? "No events scheduled for this date"
                : "Check back later for upcoming events"}
            </Text>
          </View>
        )}
      />
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
        {renderHeader()}

        {/* Active Filters */}
        {(selectedCategory !== "all" || selectedDate) && (
          <View style={styles.activeFiltersContainer}>
            {selectedCategory !== "all" && (
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
            )}
            {selectedDate && (
              <View
                style={[
                  styles.activeFilterChip,
                  {
                    backgroundColor: currentTheme.colors.secondary + "15",
                    borderColor: currentTheme.colors.secondary + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.activeFilterText,
                    { color: currentTheme.colors.secondary },
                  ]}
                >
                  {selectedDate.toLocaleDateString()}
                </Text>
                <TouchableOpacity
                  onPress={() => setSelectedDate(null)}
                  style={styles.removeFilterButton}
                >
                  <MaterialIcons
                    name="close"
                    size={16}
                    color={currentTheme.colors.secondary}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {showCalendar ? (
          renderCalendar()
        ) : (
          <>
            {renderQuickDates()}
            {renderEventsList()}
          </>
        )}
      </View>

      {/* Floating Action Button for Create Event */}
      {profile?.is_admin && (
        <TouchableOpacity
          style={[styles.fab, { backgroundColor: currentTheme.colors.primary }]}
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <MaterialIcons name="add" size={24} color="white" />
        </TouchableOpacity>
      )}

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
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
  },
  calendarToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  quickDatesContainer: {
    marginBottom: 20,
  },
  quickDatesContent: {
    paddingHorizontal: 16,
  },
  quickDateChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  quickDateText: {
    fontSize: 14,
    fontWeight: "500",
  },
  eventsContainer: {
    flex: 1,
  },
  eventsList: {
    paddingBottom: 100,
  },
  eventCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  eventDate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDateText: {
    fontSize: 14,
    fontWeight: "600",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  eventCategory: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    lineHeight: 24,
  },
  eventDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  eventDetails: {
    gap: 8,
    marginBottom: 16,
  },
  eventDetail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  eventDetailText: {
    fontSize: 14,
  },
  eventFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  attendeeInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  attendeeText: {
    fontSize: 12,
    fontWeight: "500",
  },
  rsvpButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  rsvpButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    padding: 48,
    marginTop: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  fab: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  filterModal: {
    width: "80%",
    maxHeight: "80%",
    backgroundColor: currentTheme.colors.card,
    borderWidth: 1,
    borderColor: currentTheme.colors.border,
    borderRadius: 16,
    padding: 16,
  },
  filterModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  filterModalClose: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  filterOptions: {
    marginBottom: 16,
  },
  filterOption: {
    padding: 12,
    borderWidth: 2,
    borderColor: currentTheme.colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
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
    padding: 12,
    borderWidth: 2,
    borderColor: currentTheme.colors.border,
    borderRadius: 8,
  },
  clearButton: {
    backgroundColor: currentTheme.colors.surface,
  },
  applyButton: {
    backgroundColor: currentTheme.colors.primary,
  },
  filterModalButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  activeFiltersContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 20,
  },
  activeFilterChip: {
    padding: 8,
    borderWidth: 2,
    borderColor: currentTheme.colors.border,
    borderRadius: 20,
  },
  activeFilterText: {
    fontSize: 14,
    fontWeight: "500",
  },
  removeFilterButton: {
    padding: 4,
  },
  floatingFilterButton: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  filterBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    padding: 4,
    borderRadius: 12,
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  calendarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
});

export default EventsScreen;

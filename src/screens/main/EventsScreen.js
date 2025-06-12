import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useApp } from "../../contexts/AppContext";
import { lightTheme, darkTheme } from "../../styles/theme";
import { mockEvents } from "../../data/mockData";

const EventsScreen = () => {
  const { theme } = useApp();
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

  const [events, setEvents] = useState(mockEvents);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Get today's date
  const today = new Date();
  const todayString = today.toISOString().split("T")[0];

  // Filter events based on selected date or show today's events
  const filteredEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : events.filter((event) => event.date >= todayString);

  const handleRSVP = (event) => {
    Alert.alert(
      "RSVP",
      `Would you like to ${
        event.isRSVPed ? "cancel your RSVP for" : "RSVP to"
      } ${event.title}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: event.isRSVPed ? "Cancel RSVP" : "RSVP",
          onPress: () => {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === event.id
                  ? {
                      ...e,
                      isRSVPed: !e.isRSVPed,
                      attendeeCount: e.isRSVPed
                        ? e.attendeeCount - 1
                        : e.attendeeCount + 1,
                    }
                  : e
              )
            );
            Alert.alert(
              "Success",
              `You have ${
                event.isRSVPed ? "cancelled your RSVP" : "RSVP'd"
              } for ${event.title}!`
            );
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (event) => {
    if (event.isRSVPed) return currentTheme.colors.success;
    const eventDate = new Date(event.date);
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
            {formatDate(item.date)}
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
            {item.category}
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
        {item.description}
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
            {item.time}
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
            {item.attendeeCount}/{item.maxAttendees} attending
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.rsvpButton,
            item.isRSVPed
              ? { backgroundColor: currentTheme.colors.success }
              : { backgroundColor: currentTheme.colors.primary },
          ]}
          onPress={() => handleRSVP(item)}
        >
          <MaterialIcons
            name={item.isRSVPed ? "check" : "add"}
            size={16}
            color="white"
          />
          <Text style={styles.rsvpButtonText}>
            {item.isRSVPed ? "RSVP'd" : "RSVP"}
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

  const renderQuickDates = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.quickDatesContainer}
    >
      <TouchableOpacity
        style={[
          styles.quickDate,
          !selectedDate && { backgroundColor: currentTheme.colors.primary },
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

      {["2024-02-14", "2024-02-15", "2024-02-28", "2024-02-29"].map((date) => (
        <TouchableOpacity
          key={date}
          style={[
            styles.quickDate,
            selectedDate === date && {
              backgroundColor: currentTheme.colors.primary,
            },
            { borderColor: currentTheme.colors.border },
          ]}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={[
              styles.quickDateText,
              {
                color:
                  selectedDate === date
                    ? "white"
                    : currentTheme.colors.textSecondary,
              },
            ]}
          >
            {formatDate(date)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
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
        {renderQuickDates()}

        <FlatList
          data={filteredEvents}
          renderItem={renderEvent}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.eventsContainer}
          showsVerticalScrollIndicator={false}
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
    paddingRight: 16,
    marginBottom: 20,
  },
  quickDate: {
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
});

export default EventsScreen;

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
  Image,
  Alert,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

import { useAuth } from "../../contexts/AuthContext";
import { useApp } from "../../contexts/AppContext";
import { getTheme, commonStyles } from "../../styles/theme";
import { announcementApi } from "../../supabase/api";

const HomeScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  const { theme } = useApp();

  // Temporarily removed currentTheme to debug error

  const [announcements, setAnnouncements] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadAnnouncements = useCallback(async () => {
    try {
      const result = await announcementApi.getAnnouncements(1, 10);
      if (result.data) {
        setAnnouncements(result.data);
      }
    } catch (error) {
      console.error("Error loading announcements:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadAnnouncements();
    setRefreshing(false);
  }, [loadAnnouncements]);

  useEffect(() => {
    loadAnnouncements();
  }, [loadAnnouncements]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreateAnnouncement = () => {
    if (!profile?.is_admin) {
      Alert.alert(
        "Access Restricted",
        "Only verified Office of Student Life accounts can post announcements.",
        [{ text: "OK" }]
      );
      return;
    }
    navigation.navigate("CreateAnnouncement", {
      onRefresh: loadAnnouncements,
    });
  };

  const renderAnnouncementCard = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: currentTheme.colors.card,
          borderColor: currentTheme.colors.borderLight,
          shadowColor: currentTheme.colors.shadow,
        },
        currentTheme.shadows.md,
      ]}
      onPress={() =>
        navigation.navigate("AnnouncementDetail", { announcement: item })
      }
      activeOpacity={0.95}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.authorContainer}>
            <View
              style={[
                styles.verifiedBadge,
                { backgroundColor: currentTheme.colors.primary },
              ]}
            >
              <MaterialIcons name="verified" size={14} color="white" />
            </View>
            <Text
              style={[
                styles.authorText,
                { color: currentTheme.colors.primary },
              ]}
            >
              {item.profiles?.name || "Office of Student Life"}
            </Text>
          </View>
          <View style={styles.dateContainer}>
            <MaterialIcons
              name="schedule"
              size={14}
              color={currentTheme.colors.textTertiary}
            />
            <Text
              style={[
                styles.dateText,
                { color: currentTheme.colors.textTertiary },
              ]}
            >
              {formatDate(item.created_at)}
            </Text>
          </View>
        </View>

        <Text style={[styles.titleText, { color: currentTheme.colors.text }]}>
          {item.title}
        </Text>

        <Text
          style={[
            styles.descriptionText,
            { color: currentTheme.colors.textSecondary },
          ]}
          numberOfLines={3}
        >
          {item.content}
        </Text>

        {/* Tags (if available) */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                style={[
                  styles.tag,
                  {
                    backgroundColor: currentTheme.colors.primary + "15",
                    borderColor: currentTheme.colors.primary + "30",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    { color: currentTheme.colors.primary },
                  ]}
                >
                  {tag}
                </Text>
              </View>
            ))}
            {item.tags.length > 3 && (
              <Text
                style={[
                  styles.moreTagsText,
                  { color: currentTheme.colors.textTertiary },
                ]}
              >
                +{item.tags.length - 3} more
              </Text>
            )}
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.cardFooterLeft}>
            <MaterialIcons
              name="visibility"
              size={16}
              color={currentTheme.colors.textTertiary}
            />
            <Text
              style={[
                styles.viewsText,
                { color: currentTheme.colors.textTertiary },
              ]}
            >
              {item.views || 0} views
            </Text>
          </View>
          <View style={styles.readMoreContainer}>
            <Text
              style={[
                styles.readMoreText,
                { color: currentTheme.colors.primary },
              ]}
            >
              Read More
            </Text>
            <MaterialIcons
              name="arrow-forward"
              size={16}
              color={currentTheme.colors.primary}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Main Welcome Header */}
      <View style={styles.mainHeader}>
        <View style={styles.welcomeContainer}>
          <Text
            style={[styles.welcomeText, { color: currentTheme.colors.text }]}
          >
            Welcome,{" "}
            {profile?.name?.split(" ")[0] ||
              user?.user_metadata?.name?.split(" ")[0] ||
              "Student"}{" "}
            👋
          </Text>
          <Text
            style={[
              styles.subtitleText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.searchButton,
            {
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border,
            },
          ]}
        >
          <MaterialIcons
            name="search"
            size={24}
            color={currentTheme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Quote of the Day */}
      <View
        style={[
          styles.quoteCard,
          {
            backgroundColor: currentTheme.colors.primary + "10",
            borderColor: currentTheme.colors.primary + "20",
          },
        ]}
      >
        <MaterialIcons
          name="format-quote"
          size={20}
          color={currentTheme.colors.primary}
        />
        <Text style={[styles.quoteText, { color: currentTheme.colors.text }]}>
          "Success is not final, failure is not fatal: it is the courage to
          continue that counts."
        </Text>
        <Text
          style={[
            styles.quoteAuthor,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          — Winston Churchill
        </Text>
      </View>

      {/* Today's Schedule */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="schedule"
            size={20}
            color={currentTheme.colors.secondary}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Today's Schedule
          </Text>
        </View>

        <View style={styles.scheduleContainer}>
          <View
            style={[
              styles.scheduleItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderLeftColor: currentTheme.colors.secondary,
              },
            ]}
          >
            <Text
              style={[
                styles.scheduleTime,
                { color: currentTheme.colors.secondary },
              ]}
            >
              9:00 AM
            </Text>
            <Text
              style={[
                styles.scheduleClass,
                { color: currentTheme.colors.text },
              ]}
            >
              CS301 - Data Structures
            </Text>
            <Text
              style={[
                styles.scheduleLocation,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Olin Hall 205
            </Text>
          </View>

          <View
            style={[
              styles.scheduleItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderLeftColor: currentTheme.colors.accent,
              },
            ]}
          >
            <Text
              style={[
                styles.scheduleTime,
                { color: currentTheme.colors.accent },
              ]}
            >
              2:00 PM
            </Text>
            <Text
              style={[
                styles.scheduleClass,
                { color: currentTheme.colors.text },
              ]}
            >
              Biochem Lab
            </Text>
            <Text
              style={[
                styles.scheduleLocation,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Science Building B12
            </Text>
          </View>

          <View
            style={[
              styles.scheduleItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderLeftColor: currentTheme.colors.warning,
              },
            ]}
          >
            <Text
              style={[
                styles.scheduleTime,
                { color: currentTheme.colors.warning },
              ]}
            >
              4:30 PM
            </Text>
            <Text
              style={[
                styles.scheduleClass,
                { color: currentTheme.colors.text },
              ]}
            >
              Study Group - Statistics
            </Text>
            <Text
              style={[
                styles.scheduleLocation,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Library Study Room 3
            </Text>
          </View>
        </View>
      </View>

      {/* Campus Services Quick Access */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="local-hospital"
            size={20}
            color={currentTheme.colors.info}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Campus Services
          </Text>
        </View>

        <View style={styles.servicesGrid}>
          <TouchableOpacity
            style={[
              styles.serviceCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <MaterialIcons
              name="local-hospital"
              size={28}
              color={currentTheme.colors.error}
            />
            <Text
              style={[styles.serviceText, { color: currentTheme.colors.text }]}
            >
              Health Center
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <MaterialIcons
              name="psychology"
              size={28}
              color={currentTheme.colors.secondary}
            />
            <Text
              style={[styles.serviceText, { color: currentTheme.colors.text }]}
            >
              Counseling
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <MaterialIcons
              name="computer"
              size={28}
              color={currentTheme.colors.primary}
            />
            <Text
              style={[styles.serviceText, { color: currentTheme.colors.text }]}
            >
              IT Help
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.serviceCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <MaterialIcons
              name="restaurant"
              size={28}
              color={currentTheme.colors.accent}
            />
            <Text
              style={[styles.serviceText, { color: currentTheme.colors.text }]}
            >
              Dining Menu
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Deadlines */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="assignment-late"
            size={20}
            color={currentTheme.colors.warning}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Upcoming Deadlines
          </Text>
        </View>

        <View style={styles.deadlinesContainer}>
          <View
            style={[
              styles.deadlineItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <View style={styles.deadlineInfo}>
              <Text
                style={[
                  styles.deadlineTitle,
                  { color: currentTheme.colors.text },
                ]}
              >
                CS301 Assignment 3
              </Text>
              <Text
                style={[
                  styles.deadlineDate,
                  { color: currentTheme.colors.warning },
                ]}
              >
                Due Tomorrow
              </Text>
            </View>
            <MaterialIcons
              name="priority-high"
              size={20}
              color={currentTheme.colors.warning}
            />
          </View>

          <View
            style={[
              styles.deadlineItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <View style={styles.deadlineInfo}>
              <Text
                style={[
                  styles.deadlineTitle,
                  { color: currentTheme.colors.text },
                ]}
              >
                Club Registration Form
              </Text>
              <Text
                style={[
                  styles.deadlineDate,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                Due Friday
              </Text>
            </View>
            <MaterialIcons
              name="assignment"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </View>

          <View
            style={[
              styles.deadlineItem,
              {
                backgroundColor: currentTheme.colors.surface,
                borderColor: currentTheme.colors.border,
              },
            ]}
          >
            <View style={styles.deadlineInfo}>
              <Text
                style={[
                  styles.deadlineTitle,
                  { color: currentTheme.colors.text },
                ]}
              >
                Intramural Soccer Signup
              </Text>
              <Text
                style={[
                  styles.deadlineDate,
                  { color: currentTheme.colors.textSecondary },
                ]}
              >
                Due Monday
              </Text>
            </View>
            <MaterialIcons
              name="sports-soccer"
              size={20}
              color={currentTheme.colors.textSecondary}
            />
          </View>
        </View>
      </View>

      {/* QR Code Section */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="qr-code"
            size={20}
            color={currentTheme.colors.primary}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Class Check-In
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.qrCard,
            {
              backgroundColor: currentTheme.colors.card,
              borderColor: currentTheme.colors.border,
              shadowColor: currentTheme.colors.shadow,
            },
            currentTheme.shadows.md,
          ]}
        >
          <View
            style={[
              styles.qrPlaceholder,
              { backgroundColor: currentTheme.colors.surface },
            ]}
          >
            <MaterialIcons
              name="qr-code-scanner"
              size={48}
              color={currentTheme.colors.primary}
            />
          </View>
          <Text style={[styles.qrText, { color: currentTheme.colors.text }]}>
            Tap to scan for attendance
          </Text>
          <Text
            style={[
              styles.qrSubtext,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Quick check-in for your next class
          </Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.borderLight,
              shadowColor: currentTheme.colors.shadow,
            },
            currentTheme.shadows.sm,
          ]}
        >
          <MaterialIcons
            name="campaign"
            size={24}
            color={currentTheme.colors.primary}
          />
          <Text
            style={[styles.statNumber, { color: currentTheme.colors.text }]}
          >
            {announcements.length}
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Announcements
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.borderLight,
              shadowColor: currentTheme.colors.shadow,
            },
            currentTheme.shadows.sm,
          ]}
        >
          <MaterialIcons
            name="event"
            size={24}
            color={currentTheme.colors.secondary}
          />
          <Text
            style={[styles.statNumber, { color: currentTheme.colors.text }]}
          >
            8
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            This Week
          </Text>
        </View>

        <View
          style={[
            styles.statCard,
            {
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.borderLight,
              shadowColor: currentTheme.colors.shadow,
            },
            currentTheme.shadows.sm,
          ]}
        >
          <MaterialIcons
            name="groups"
            size={24}
            color={currentTheme.colors.accent}
          />
          <Text
            style={[styles.statNumber, { color: currentTheme.colors.text }]}
          >
            4
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            My Clubs
          </Text>
        </View>
      </View>

      {/* Suggested Events */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="lightbulb"
            size={20}
            color={currentTheme.colors.accent}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Suggested for You
          </Text>
        </View>

        <View style={styles.suggestedEventsContainer}>
          <TouchableOpacity
            style={[
              styles.suggestedEventCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <View style={styles.suggestedEventHeader}>
              <Text
                style={[
                  styles.suggestedEventTitle,
                  { color: currentTheme.colors.text },
                ]}
              >
                Career Fair 2024
              </Text>
              <TouchableOpacity
                style={[
                  styles.interestedButton,
                  { backgroundColor: currentTheme.colors.accent + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.interestedText,
                    { color: currentTheme.colors.accent },
                  ]}
                >
                  Interested
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.suggestedEventDetails,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Tomorrow, 10:00 AM • Student Center
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.suggestedEventCard,
              {
                backgroundColor: currentTheme.colors.card,
                borderColor: currentTheme.colors.border,
                shadowColor: currentTheme.colors.shadow,
              },
              currentTheme.shadows.sm,
            ]}
          >
            <View style={styles.suggestedEventHeader}>
              <Text
                style={[
                  styles.suggestedEventTitle,
                  { color: currentTheme.colors.text },
                ]}
              >
                Coding Workshop
              </Text>
              <TouchableOpacity
                style={[
                  styles.interestedButton,
                  { backgroundColor: currentTheme.colors.secondary + "15" },
                ]}
              >
                <Text
                  style={[
                    styles.interestedText,
                    { color: currentTheme.colors.secondary },
                  ]}
                >
                  Interested
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.suggestedEventDetails,
                { color: currentTheme.colors.textSecondary },
              ]}
            >
              Friday, 3:00 PM • Computer Lab
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Latest Announcements Section Header */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeaderContainer}>
          <MaterialIcons
            name="campaign"
            size={20}
            color={currentTheme.colors.primary}
          />
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Latest Announcements
          </Text>
          {profile?.is_admin && (
            <TouchableOpacity
              style={[
                styles.addButton,
                {
                  backgroundColor: currentTheme.colors.primary,
                  shadowColor: currentTheme.colors.shadow,
                },
                currentTheme.shadows.sm,
              ]}
              onPress={handleCreateAnnouncement}
            >
              <MaterialIcons name="add" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialIcons
        name="campaign"
        size={64}
        color={currentTheme.colors.textSecondary}
      />
      <Text style={[styles.emptyTitle, { color: currentTheme.colors.text }]}>
        No Announcements Yet
      </Text>
      <Text
        style={[
          styles.emptyDescription,
          { color: currentTheme.colors.textSecondary },
        ]}
      >
        Check back later for updates from the Office of Student Life
      </Text>
    </View>
  );

  const styles = useMemo(() => createStyles(currentTheme), [currentTheme]);

  return (
    <SafeAreaView
      style={[
        commonStyles.safeArea,
        { backgroundColor: currentTheme.colors.background },
      ]}
    >
      <StatusBar style={theme === "dark" ? "light" : "dark"} />

      <FlatList
        data={announcements}
        renderItem={renderAnnouncementCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={currentTheme.colors.primary}
            colors={[currentTheme.colors.primary]}
          />
        }
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      padding: 16,
      paddingBottom: 100,
    },
    header: {
      marginBottom: 24,
    },
    mainHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 24,
    },
    welcomeContainer: {
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 16,
      fontWeight: "400",
    },
    subtitleText: {
      fontSize: 14,
      fontWeight: "400",
    },
    searchButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    quoteCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    quoteText: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },
    quoteAuthor: {
      fontSize: 14,
      fontWeight: "500",
    },
    sectionContainer: {
      marginBottom: 24,
    },
    sectionHeaderContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
    },
    scheduleContainer: {
      marginBottom: 16,
    },
    scheduleItem: {
      padding: 16,
      borderLeftWidth: 4,
      borderRadius: 12,
    },
    scheduleTime: {
      fontSize: 14,
      fontWeight: "500",
      marginBottom: 4,
    },
    scheduleClass: {
      fontSize: 16,
      fontWeight: "700",
    },
    scheduleLocation: {
      fontSize: 12,
      fontWeight: "400",
    },
    servicesGrid: {
      flexDirection: "row",
      gap: 16,
    },
    serviceCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      alignItems: "center",
      gap: 8,
    },
    serviceText: {
      fontSize: 14,
      fontWeight: "500",
    },
    deadlinesContainer: {
      marginBottom: 16,
    },
    deadlineItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
    },
    deadlineInfo: {
      flexDirection: "column",
    },
    deadlineTitle: {
      fontSize: 16,
      fontWeight: "700",
      marginBottom: 4,
    },
    deadlineDate: {
      fontSize: 12,
      fontWeight: "400",
    },
    qrCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      marginBottom: 24,
    },
    qrPlaceholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 16,
    },
    qrText: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 8,
    },
    qrSubtext: {
      fontSize: 14,
      fontWeight: "400",
    },
    statsContainer: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      padding: 18,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      gap: 10,
    },
    statNumber: {
      fontSize: 24,
      fontWeight: "700",
    },
    statLabel: {
      fontSize: 12,
      fontWeight: "500",
      textAlign: "center",
    },
    suggestedEventsContainer: {
      marginBottom: 16,
    },
    suggestedEventCard: {
      padding: 16,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 16,
    },
    suggestedEventHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    suggestedEventTitle: {
      fontSize: 16,
      fontWeight: "700",
    },
    interestedButton: {
      padding: 8,
      borderRadius: 8,
    },
    interestedText: {
      fontSize: 14,
      fontWeight: "600",
    },
    suggestedEventDetails: {
      fontSize: 12,
      fontWeight: "400",
    },
    addButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      borderWidth: 1,
    },
    cardContent: {
      padding: 20,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    verifiedBadge: {
      width: 22,
      height: 22,
      borderRadius: 11,
      justifyContent: "center",
      alignItems: "center",
    },
    authorText: {
      fontSize: 14,
      fontWeight: "600",
    },
    dateContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    dateText: {
      fontSize: 12,
      fontWeight: "400",
    },
    titleText: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 12,
      lineHeight: 24,
    },
    descriptionText: {
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
      marginBottom: 16,
      alignItems: "center",
    },
    tag: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      borderWidth: 1,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "600",
    },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    cardFooterLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    readMoreContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    readMoreText: {
      fontSize: 14,
      fontWeight: "600",
    },
    viewsText: {
      fontSize: 12,
      fontWeight: "500",
    },
    moreTagsText: {
      fontSize: 12,
      fontWeight: "500",
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

export default HomeScreen;

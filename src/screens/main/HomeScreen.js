import { useState, useCallback, useEffect } from "react";
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
import { lightTheme, darkTheme, commonStyles } from "../../styles/theme";
import { announcementApi } from "../../supabase/api";

const HomeScreen = ({ navigation }) => {
  const { user, profile } = useAuth();
  const theme = "light"; // You can implement theme switching later
  const currentTheme = theme === "light" ? lightTheme : darkTheme;

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
      <View style={styles.welcomeContainer}>
        <Text
          style={[
            styles.welcomeText,
            { color: currentTheme.colors.textSecondary },
          ]}
        >
          Welcome back,
        </Text>
        <Text style={[styles.nameText, { color: currentTheme.colors.text }]}>
          {profile?.name || user?.user_metadata?.name || "Student"}!
        </Text>
        <Text
          style={[
            styles.subtitleText,
            { color: currentTheme.colors.textTertiary },
          ]}
        >
          Here's what's happening at Augie Central
        </Text>
      </View>

      {/* Quick Access Cards */}
      <View style={styles.quickAccessContainer}>
        <TouchableOpacity
          style={[
            styles.quickAccessCard,
            {
              backgroundColor: currentTheme.colors.primary + "10",
              borderColor: currentTheme.colors.primary + "20",
            },
          ]}
          onPress={() => navigation.navigate("Events")}
        >
          <MaterialIcons
            name="event"
            size={24}
            color={currentTheme.colors.primary}
          />
          <Text
            style={[
              styles.quickAccessText,
              { color: currentTheme.colors.primary },
            ]}
          >
            Events
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickAccessCard,
            {
              backgroundColor: currentTheme.colors.secondary + "10",
              borderColor: currentTheme.colors.secondary + "20",
            },
          ]}
          onPress={() => navigation.navigate("Organizations")}
        >
          <MaterialIcons
            name="groups"
            size={24}
            color={currentTheme.colors.secondary}
          />
          <Text
            style={[
              styles.quickAccessText,
              { color: currentTheme.colors.secondary },
            ]}
          >
            Organizations
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.quickAccessCard,
            {
              backgroundColor: currentTheme.colors.accent + "10",
              borderColor: currentTheme.colors.accent + "20",
            },
          ]}
          onPress={() => navigation.navigate("Profile")}
        >
          <MaterialIcons
            name="person"
            size={24}
            color={currentTheme.colors.accent}
          />
          <Text
            style={[
              styles.quickAccessText,
              { color: currentTheme.colors.accent },
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>

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
            5
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Upcoming Events
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
            12
          </Text>
          <Text
            style={[
              styles.statLabel,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Organizations
          </Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <View>
          <Text
            style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
          >
            Latest Announcements
          </Text>
          <Text
            style={[
              styles.sectionSubtitle,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            Stay updated with campus news
          </Text>
        </View>
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

  const styles = createStyles(currentTheme);

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
    welcomeContainer: {
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 16,
      fontWeight: "400",
    },
    nameText: {
      fontSize: 24,
      fontWeight: "700",
      marginTop: 4,
    },
    subtitleText: {
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
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 16,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "600",
    },
    sectionSubtitle: {
      fontSize: 14,
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
    cardImage: {
      width: "100%",
      height: 160,
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
    quickAccessContainer: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    quickAccessCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "transparent",
      alignItems: "center",
      gap: 8,
    },
    quickAccessText: {
      fontSize: 14,
      fontWeight: "500",
    },
  });

export default HomeScreen;

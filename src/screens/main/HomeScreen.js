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
    navigation.navigate("CreateAnnouncement");
  };

  const renderAnnouncementCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: currentTheme.colors.card }]}
      onPress={() =>
        navigation.navigate("AnnouncementDetail", { announcement: item })
      }
      activeOpacity={0.7}
    >
      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.authorContainer}>
            <MaterialIcons
              name="verified"
              size={16}
              color={currentTheme.colors.primary}
            />
            <Text
              style={[
                styles.authorText,
                { color: currentTheme.colors.primary },
              ]}
            >
              {item.profiles?.name || "Office of Student Life"}
            </Text>
          </View>
          <Text
            style={[
              styles.dateText,
              { color: currentTheme.colors.textSecondary },
            ]}
          >
            {formatDate(item.created_at)}
          </Text>
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

        <View style={styles.cardFooter}>
          <MaterialIcons
            name="arrow-forward"
            size={16}
            color={currentTheme.colors.primary}
          />
          <Text
            style={[
              styles.readMoreText,
              { color: currentTheme.colors.primary },
            ]}
          >
            Read More
          </Text>
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
      </View>

      <View style={styles.statsContainer}>
        <View
          style={[
            styles.statCard,
            { backgroundColor: currentTheme.colors.surface },
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
            { backgroundColor: currentTheme.colors.surface },
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
      </View>

      <View style={styles.sectionHeader}>
        <Text
          style={[styles.sectionTitle, { color: currentTheme.colors.text }]}
        >
          Latest Announcements
        </Text>
        {profile?.is_admin && (
          <TouchableOpacity
            style={[
              styles.addButton,
              { backgroundColor: currentTheme.colors.primary },
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
    statsContainer: {
      flexDirection: "row",
      gap: 16,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      padding: 16,
      borderRadius: 12,
      alignItems: "center",
      gap: 8,
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
      ...theme.shadows.md,
    },
    cardImage: {
      width: "100%",
      height: 160,
    },
    cardContent: {
      padding: 16,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    authorContainer: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
    authorText: {
      fontSize: 14,
      fontWeight: "600",
    },
    dateText: {
      fontSize: 12,
      fontWeight: "400",
    },
    titleText: {
      fontSize: 18,
      fontWeight: "600",
      marginBottom: 8,
      lineHeight: 24,
    },
    descriptionText: {
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: "row",
      gap: 8,
      marginBottom: 12,
    },
    tag: {
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
    },
    tagText: {
      fontSize: 12,
      fontWeight: "500",
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    readMoreText: {
      fontSize: 14,
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

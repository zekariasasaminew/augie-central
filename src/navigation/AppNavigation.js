import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { View, ActivityIndicator } from "react-native";

import { useAuth } from "../contexts/AuthContext";

// Auth Screens
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUpScreen";

// Main App Screens
import HomeScreen from "../screens/main/HomeScreen";
import OrganizationsScreen from "../screens/main/OrganizationsScreen";
import EventsScreen from "../screens/main/EventsScreen";
import ProfileScreen from "../screens/main/ProfileScreen";

// Detail Screens
import AnnouncementDetailScreen from "../screens/details/AnnouncementDetailScreen";
import OrganizationDetailScreen from "../screens/details/OrganizationDetailScreen";
import EventDetailScreen from "../screens/details/EventDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Auth Stack Navigator - Minimal styling
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

// Main Tab Navigator - Minimal styling
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Organizations":
              iconName = "groups";
              break;
            case "Events":
              iconName = "event";
              break;
            case "Profile":
              iconName = "person";
              break;
            default:
              iconName = "circle";
          }

          return <MaterialIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#1B365D",
        tabBarInactiveTintColor: "#8E8E93",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "Home",
          headerTitle: "Augie Central",
        }}
      />
      <Tab.Screen
        name="Organizations"
        component={OrganizationsScreen}
        options={{
          title: "Organizations",
        }}
      />
      <Tab.Screen
        name="Events"
        component={EventsScreen}
        options={{
          title: "Events",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
};

// Main App Stack Navigator - Minimal styling
const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{
          title: "Announcement",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="OrganizationDetail"
        component={OrganizationDetailScreen}
        options={{
          title: "Organization",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="EventDetail"
        component={EventDetailScreen}
        options={{
          title: "Event Details",
          presentation: "modal",
        }}
      />
    </Stack.Navigator>
  );
};

// Navigation wrapper with context check
const NavigationWrapper = () => {
  const { user, loading } = useAuth();

  // If context is not available yet, show loading
  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#1B365D",
        }}
      >
        <ActivityIndicator size="large" color="#F4B942" />
      </View>
    );
  }

  const isAuthenticated = !!user;

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

// Root Navigator
const AppNavigation = () => {
  return <NavigationWrapper />;
};

export default AppNavigation;

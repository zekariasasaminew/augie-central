import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  theme: "light",
  savedEvents: [],
  notifications: {
    announcements: true,
    events: true,
    organizations: true,
  },
  isLoading: true,
};

// Action types
const ActionTypes = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  TOGGLE_THEME: "TOGGLE_THEME",
  SAVE_EVENT: "SAVE_EVENT",
  REMOVE_EVENT: "REMOVE_EVENT",
  UPDATE_NOTIFICATIONS: "UPDATE_NOTIFICATIONS",
  SET_LOADING: "SET_LOADING",
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      };
    case ActionTypes.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        savedEvents: [],
      };
    case ActionTypes.TOGGLE_THEME:
      return {
        ...state,
        theme: state.theme === "light" ? "dark" : "light",
      };
    case ActionTypes.SAVE_EVENT:
      return {
        ...state,
        savedEvents: [...state.savedEvents, action.payload],
      };
    case ActionTypes.REMOVE_EVENT:
      return {
        ...state,
        savedEvents: state.savedEvents.filter(
          (event) => event.id !== action.payload
        ),
      };
    case ActionTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload },
      };
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Context
const AppContext = createContext(null);

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load persisted data on app start
  useEffect(() => {
    loadPersistedData();
  }, []);

  // Save data when state changes (but not during initial load)
  useEffect(() => {
    if (!state.isLoading) {
      saveDataToStorage();
    }
  }, [state.theme, state.notifications, state.savedEvents, state.isLoading]);

  const loadPersistedData = async () => {
    try {
      const theme = await AsyncStorage.getItem("theme");
      const notifications = await AsyncStorage.getItem("notifications");
      const savedEvents = await AsyncStorage.getItem("savedEvents");
      const userData = await AsyncStorage.getItem("userData");

      if (theme && theme === "dark") {
        dispatch({ type: ActionTypes.TOGGLE_THEME });
      }
      if (notifications) {
        dispatch({
          type: ActionTypes.UPDATE_NOTIFICATIONS,
          payload: JSON.parse(notifications),
        });
      }
      if (savedEvents) {
        // Load saved events - implement if needed
      }
      if (userData) {
        dispatch({
          type: ActionTypes.LOGIN,
          payload: JSON.parse(userData),
        });
      }
    } catch (error) {
      console.error("Error loading persisted data:", error);
    } finally {
      // Set loading to false after attempting to load data
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const saveDataToStorage = async () => {
    try {
      await AsyncStorage.setItem("theme", state.theme);
      await AsyncStorage.setItem(
        "notifications",
        JSON.stringify(state.notifications)
      );
      await AsyncStorage.setItem(
        "savedEvents",
        JSON.stringify(state.savedEvents)
      );
      if (state.user) {
        await AsyncStorage.setItem("userData", JSON.stringify(state.user));
      }
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  const login = (userData) => {
    dispatch({ type: ActionTypes.LOGIN, payload: userData });
  };

  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["userData", "savedEvents"]);
      dispatch({ type: ActionTypes.LOGOUT });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const toggleTheme = () => {
    dispatch({ type: ActionTypes.TOGGLE_THEME });
  };

  const saveEvent = (event) => {
    dispatch({ type: ActionTypes.SAVE_EVENT, payload: event });
  };

  const removeEvent = (eventId) => {
    dispatch({ type: ActionTypes.REMOVE_EVENT, payload: eventId });
  };

  const updateNotifications = (settings) => {
    dispatch({ type: ActionTypes.UPDATE_NOTIFICATIONS, payload: settings });
  };

  const value = {
    ...state,
    login,
    logout,
    toggleTheme,
    saveEvent,
    removeEvent,
    updateNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    // Return a default state if context is not available
    return {
      isAuthenticated: false,
      user: null,
      theme: "light",
      savedEvents: [],
      notifications: {
        announcements: true,
        events: true,
        organizations: true,
      },
      isLoading: true,
      login: () => {},
      logout: () => {},
      toggleTheme: () => {},
      saveEvent: () => {},
      removeEvent: () => {},
      updateNotifications: () => {},
    };
  }
  return context;
};

export { ActionTypes };

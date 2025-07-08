import React from "react";
import { AuthProvider } from "./src/contexts/AuthContext";
import { AppProvider } from "./src/contexts/AppContext";
import AppNavigation from "./src/navigation/AppNavigation";

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </AppProvider>
  );
}

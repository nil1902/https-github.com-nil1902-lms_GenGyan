import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "./components/ui/toaster";

import { TempoDevtools } from "tempo-devtools";
TempoDevtools.init();

// Initialize Supabase connection
import { supabase } from "./lib/supabase";

// Log Supabase connection status and handle errors
supabase.auth.onAuthStateChange((event, session) => {
  console.log(
    "Supabase auth event:",
    event,
    session ? "(session exists)" : "(no session)",
  );
});

// Check if Supabase is properly configured
if (
  !import.meta.env.VITE_SUPABASE_URL ||
  !import.meta.env.VITE_SUPABASE_ANON_KEY
) {
  console.error(
    "Supabase environment variables are missing. Please check your .env file.",
  );
}

// Test Supabase connection with better error handling
supabase.auth
  .getSession()
  .then(({ data, error }) => {
    if (error) {
      console.error("Supabase auth session check failed:", error);
    } else {
      console.log("Supabase auth connection successful");
    }
  })
  .catch((err) => {
    console.error("Failed to connect to Supabase auth:", err);
  });

const basename = import.meta.env.BASE_URL;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="system" storageKey="gyan-gen-ui-theme">
      <BrowserRouter basename={basename}>
        <AuthProvider>
          <App />
          <Toaster />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

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

// Initialize Firebase connection
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Log Firebase auth state changes
onAuthStateChanged(auth, (user) => {
  console.log(
    "Firebase auth state changed:",
    user ? "User is signed in" : "User is signed out",
  );
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

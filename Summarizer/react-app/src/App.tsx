import { FunctionComponent, useEffect, useState } from "react";
import Navbar2 from "./components/Navbar/Navbar2.tsx";
import TextSummarizer from "./components/Summarizer/TextSummarizer.tsx";
import styles from "./App.module.css";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserDashboard from "./components/UserDashboard/UserDashboard.tsx";
import VoiceSelector from "./components/VoiceSelector/VoiceSelector.tsx";
import VideoGenerator from "./components/VideoGenerator/VideoGenerator.tsx";

import { TextProvider } from "./Context";
import React from "react";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (token && userId) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    setIsLoggedIn(false);
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <Router>
      <div className={styles.home}>
        <Navbar2
          isLoggedIn={isLoggedIn}
          onLoginSuccess={handleLoginSuccess}
          onLogout={handleLogout}
        />
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <TextProvider>
                  <section className={styles.homeInner}>
                    <TextSummarizer />
                  </section>
                  <VoiceSelector />
                  <VideoGenerator />
                </TextProvider>
              ) : null
            }
          />
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

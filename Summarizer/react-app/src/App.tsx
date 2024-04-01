import { FunctionComponent, useEffect, useState } from "react";
import Navbar2 from "./components/Navbar/Navbar2.tsx";
import TextSummarizer from "./components/Summarizer/TextSummarizer.tsx";
import styles from "./App.module.css";
import Cookies from "js-cookie";

import VoiceSelector from "./components/VoiceSelector/VoiceSelector.tsx";
import VideoGenerator from "./components/VideoGenerator/VideoGenerator.tsx";

import { TextProvider } from "./Context";
import React from "react";

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  useEffect(() => {
    // On component mount, check if the token is in cookies
    const token = Cookies.get("token");
    const userId = Cookies.get("userId");

    if (token && userId) {
      // If a token exists in cookies, set login state to true
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    // Clear cookies
    Cookies.remove("token");
    Cookies.remove("userId");
    // Update state
    setIsLoggedIn(false);
  };

  // Call handleLogout when you need to log out the user

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
    <div className={styles.home}>
      <Navbar2
        isLoggedIn={isLoggedIn}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />{" "}
      {isLoggedIn && (
        <TextProvider>
          <section className={styles.homeInner}>
            <TextSummarizer />
          </section>
          <VoiceSelector />
          <VideoGenerator />
        </TextProvider>
      )}
    </div>
  );
};

export default App;

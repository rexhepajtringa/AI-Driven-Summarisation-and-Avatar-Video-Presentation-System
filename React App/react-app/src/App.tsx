import { useEffect } from "react";
import Navbar2 from "./components/Navbar/Navbar2.tsx";
import TextSummarizer from "./components/Summarizer/TextSummarizer.tsx";
import styles from "./App.module.css";
import Cookies from "js-cookie";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceSelector from "./components/VoiceSelector/VoiceSelector.tsx";
import VideoGenerator from "./components/VideoGenerator/VideoGenerator.tsx";
import StepIndicator from "./components/StepIndicator/StepIndicator.tsx";
import { GlobalContentProvider } from "./components/Utils/GlobalContentContext.tsx";
import React from "react";
import ContentTabs from "./components/UserDashboard/ContentTabs.tsx";
import HomePage from "./components/HomePage/HomePage.tsx"; // Make sure to have this component created
import { TextProvider } from "./Context";

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
    <GlobalContentProvider>
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
                    <StepIndicator
                      number={1}
                      instructions="Input a text or a document you want to summarize. The generated summary will be used as the script for your avatar speaking video."
                    />
                    <section className={styles.homeInner}>
                      <TextSummarizer />
                    </section>
                    <StepIndicator
                      number={2}
                      instructions="Choose your favorite voice to generate speech. This audio will be the voice your avatar will use."
                    />
                    <VoiceSelector />
                    <StepIndicator
                      number={3}
                      instructions="Choose an avatar or upload your own to generate an avatar speaking video."
                    />
                    <VideoGenerator />
                  </TextProvider>
                ) : (
                  <HomePage />
                ) // Show HomePage if not logged in
              }
            />
            <Route path="/user-dashboard" element={<ContentTabs />} />
          </Routes>
        </div>
      </Router>
    </GlobalContentProvider>
  );
};

export default App;

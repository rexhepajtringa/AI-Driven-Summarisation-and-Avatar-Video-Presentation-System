import { FunctionComponent } from "react";
import Navbar2 from "./components/Navbar/Navbar2.tsx";
import TextSummarizer from "./components/Summarizer/TextSummarizer.tsx";
import styles from "./App.module.css";
import VoiceSelector from "./components/VoiceSelector/VoiceSelector.tsx";
import VideoGenerator from "./components/VideoGenerator/VideoGenerator.tsx";

import { TextProvider } from "./Context";

const App: React.FC = () => {
  return (
    <div className={styles.home}>
      <Navbar2 />
      <TextProvider>
        <section className={styles.homeInner}>
          <TextSummarizer />
        </section>
        <VoiceSelector />
        <VideoGenerator />
      </TextProvider>
    </div>
  );
};

export default App;

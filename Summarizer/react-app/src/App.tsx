import { FunctionComponent } from "react";
import Navbar2 from "./components/Navbar/Navbar2.tsx";
import TextSummarizer from "./components/Summarizer/TextSummarizer.tsx";
import styles from "./App.module.css";

const App: React.FC = () => {
  return (
    <div className={styles.home}>
      <Navbar2 />
      <section className={styles.homeInner}>
        <TextSummarizer />
      </section>
    </div>
  );
};

export default App;

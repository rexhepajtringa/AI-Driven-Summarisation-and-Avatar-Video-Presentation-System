// HomePage.jsx
import React from "react";
import styles from "./HomePage.module.css";
import {
  MdInsertDriveFile,
  MdKeyboardVoice,
  MdPersonOutline,
  MdVideocam,
  MdArrowForward,
} from "react-icons/md";

const HomePage: React.FC = () => {
  return (
    <div className={styles.background}>
      <div className={styles.card}>
        <h1 className={styles.title}>Welcome!</h1>
        <div className={styles.iconsContainer}>
          <MdInsertDriveFile className={styles.icon} />
          <MdArrowForward className={styles.arrowIcon} />
          <MdKeyboardVoice className={styles.icon} />
          <MdArrowForward className={styles.arrowIcon} />
          <MdPersonOutline className={styles.icon} />
          <MdArrowForward className={styles.arrowIcon} />
          <MdVideocam className={styles.icon} />
        </div>
        <h2 className={styles.description}>
          Discover the power of AI with our Text Summarizer & Avatar Video
          Builder. Create compelling summaries and video presentations with
          ease.
        </h2>
        <p>Sign Up or Log In to get started!</p>
      </div>
    </div>
  );
};

export default HomePage;

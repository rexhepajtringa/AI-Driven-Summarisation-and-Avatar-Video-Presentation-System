// StepIndicator.js
import React from "react";
import PropTypes from "prop-types"; // If you're using TypeScript, you can skip this and use types instead
import styles from "./StepIndicator.module.css"; // Make sure to create this CSS module file

const StepIndicator = ({ number, instructions }) => {
  return (
    <div className={styles.container}>
      <h1>
        Step {number} : {instructions}
      </h1>
    </div>
  );
};

StepIndicator.propTypes = {
  number: PropTypes.number.isRequired,
  instructions: PropTypes.string.isRequired,
};

export default StepIndicator;

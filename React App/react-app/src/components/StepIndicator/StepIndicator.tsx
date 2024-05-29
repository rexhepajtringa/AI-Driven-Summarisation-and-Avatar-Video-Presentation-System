import React from "react";
import styles from "./StepIndicator.module.css";

interface StepIndicatorProps {
  number: number;
  instructions: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  number,
  instructions,
}) => {
  return (
    <div className={styles.container}>
      <h1>
        Step {number} : {instructions}
      </h1>
    </div>
  );
};

export default StepIndicator;

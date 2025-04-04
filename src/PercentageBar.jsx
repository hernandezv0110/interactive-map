import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";

const PercentageBar = ({ interactionPercentage, color }) => {
  const [animatedValue, setAnimatedValue] = useState(0);
  console.log(color);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setAnimatedValue(interactionPercentage);
    }, 100);

    return () => clearTimeout(timeout);
  }, [interactionPercentage]);

  return (
    <div className="zone-data" style={{ textAlign: "center" }}>
      <div style={{ width: 250, height: 250, margin: "auto" }}>
        <CircularProgressbar
          value={animatedValue}
          text={`${animatedValue}%`}
          styles={buildStyles({
            pathTransitionDuration: 1.5,
            textSize: "16px",
            pathColor: color,
            trailColor: "#ddd",
            textColor: "#333",
            strokeLinecap: "round",
          })}
        />
      </div>
    </div>
  );
};

export default PercentageBar;

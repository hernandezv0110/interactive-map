import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useEffect, useState } from "react";

const PercentageBar = ({ interactionPercentage }) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    // Start animation when the component is mounted
    const timeout = setTimeout(() => {
      setAnimatedValue(interactionPercentage);
    }, 100); // Small delay to ensure animation triggers on mount

    return () => clearTimeout(timeout);
  }, [interactionPercentage]);

  return (
    <div className="zone-data" style={{ textAlign: "center" }}>
      <div style={{ width: 250, height: 250, margin: "auto" }}>
        <CircularProgressbar
          value={animatedValue}
          text={`${animatedValue}%`}
          styles={buildStyles({
            pathTransitionDuration: 1.5, // Enables smooth transition
            textSize: "16px",
            pathColor: "deepskyblue",
            trailColor: "#ddd",
            textColor: "#333",
            strokeLinecap: "round",
          })}
        />
      </div>
    </div>
  );

  // return (
  //   <div className="zone-data" style={{ textAlign: "center" }}>
  //     <div style={{ width: 250, height: 250, margin: "auto" }}>
  //       <CircularProgressbar
  //         value={interactionPercentage}
  //         text={`${interactionPercentage}%`}
  //         styles={buildStyles({
  //           pathTransitionDuration: 1.5,
  //           textSize: "16px",
  //           pathColor: "argentinanblue",
  //           trailColor: "#ddd",
  //           textColor: "#333",
  //           strokeLinecap: "round",
  //         })}
  //       />
  //     </div>
  //   </div>
  // );
};

export default PercentageBar;

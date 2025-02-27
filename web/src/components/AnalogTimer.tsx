import React, { useMemo } from "react";
import "../styles/AnalogTimer.css";

interface AnalogTimerProps {
  timeLeft: number;
  totalTime: number;
}

const AnalogTimer: React.FC<AnalogTimerProps> = ({ timeLeft, totalTime }) => {
  const radius = 25;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / totalTime) * circumference;
  const dashOffset = circumference - progress;
  const isWarning = timeLeft <= 10;

  return (
    <div className={`analog-timer ${isWarning ? "warning" : ""}`}>
      <svg className="timer-svg" viewBox="0 0 60 60">
        <circle className="timer-background" cx="30" cy="30" r={radius} fill="none" strokeWidth="5" />
        <circle
          className="timer-progress"
          cx="30"
          cy="30"
          r={radius}
          fill="none"
          strokeWidth="5"
          style={{
            strokeDasharray: circumference,
            strokeDashoffset: dashOffset,
            stroke: isWarning ? "#dc3545" : "#198754",
          }}
        />
        <text
          x="30"
          y="30"
          dominantBaseline="middle"
          textAnchor="middle"
          className="timer-number"
          style={{
            fill: isWarning ? "#dc3545" : "#198754",
          }}>
          {timeLeft}
        </text>
      </svg>
    </div>
  );
};

export default AnalogTimer;

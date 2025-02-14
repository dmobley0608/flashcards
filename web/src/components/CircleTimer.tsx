import React from "react";

interface CircleTimerProps {
  timeLeft: number;
  maxTime: number;
}

export default function CircleTimer({ timeLeft, maxTime }: CircleTimerProps) {
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const progress = (timeLeft / maxTime) * circumference;

  return (
    <div className="circle-timer">
      <svg width="80" height="80" viewBox="0 0 80 80">
        {/* Background circle */}
        <circle cx="40" cy="40" r={radius} fill="none" stroke="#e6e6e6" strokeWidth="4" />
        {/* Timer circle */}
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke={timeLeft <= 10 ? "#dc3545" : "#0d6efd"}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          transform="rotate(-90 40 40)"
          style={{
            transition: "stroke-dashoffset 1s linear",
          }}
        />
        {/* Timer text */}
        <text x="50%" y="50%" textAnchor="middle" dy=".3em" fill={timeLeft <= 10 ? "#dc3545" : "#0d6efd"} fontSize="20" fontWeight="bold">
          {timeLeft}
        </text>
      </svg>
    </div>
  );
}

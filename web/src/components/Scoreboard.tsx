import React from "react";

interface ScoreboardProps {
  score: number;
  total: number;
}

export default function Scoreboard({ score, total }: ScoreboardProps) {
  return (
    <div className="scoreboard">
      <div className="score-display">
        <div className="score-value">{String(score).padStart(2, "0")}</div>
        <div className="score-divider">—</div>
        <div className="score-total">{String(total).padStart(2, "0")}</div>
      </div>
      <div className="score-label">SCORE</div>
    </div>
  );
}

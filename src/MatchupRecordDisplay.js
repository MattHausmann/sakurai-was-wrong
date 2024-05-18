import React from "react";
import { useSelector } from "react-redux";

import "./MatchupRecordDisplay.css";

const MatchupRecordDisplay = ({ leftWins, rightWins }) => {
  const quizMode = useSelector((state) => state.quizMode);

  return (
    <div className="matchup-record-display">
      <div className="record-display-percentages">
        <span className="win-text-color">
          {Math.floor((leftWins * 100) / (leftWins + rightWins))}
        </span>
        <span className="percent-divider">:</span>
        <span className="lose-text-color">
          {Math.ceil((rightWins * 100) / (leftWins + rightWins))}
        </span>
      </div>
    </div>
  );
};

export default MatchupRecordDisplay;

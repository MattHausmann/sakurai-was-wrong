// ScoreDisplay.js
import React from "react";
import { useSelector } from "react-redux";

const ScoreDisplay = ({ score }) => {
  const seenMatchups = useSelector((state) => state.seenMatchups);

  return (
    <div className="quizResults">
      <h4>Score: {score}</h4>
      <div className="quizResultsList">
        {Object.entries(seenMatchups).map(([key, value]) => (
          <div>{key}</div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDisplay;

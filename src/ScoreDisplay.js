// ScoreDisplay.js
import React from "react";
import { useSelector } from "react-redux";

const ScoreDisplay = ({ score }) => {
  const quizResults = useSelector((state) => state.quizResults);

  return (
    <div className="quizResults">
      <h4>Score: {score}</h4>
      <div className="quizResultsList">
        {quizResults.map((result, index) => (
          <div>result {index}</div>
        ))}
      </div>
    </div>
  );
};

export default ScoreDisplay;

// MatchupSlider.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import "./QuizModeSlider.css";
import wins from "./wins.json";

const MatchupSlider = ({ winsDisplay }) => {
  const quizMode = useSelector((state) => state.quizMode);
  const dispatch = useDispatch();

  const [sliderValue, setSliderValue] = useState(winsDisplay[0]);
  const [leftWins, setLeftWins] = useState(winsDisplay[0]);
  const [rightWins, setRightWins] = useState(winsDisplay[1]);

  useEffect(() => {
    setLeftWins(winsDisplay[0]);
    setRightWins(winsDisplay[1]);
    setSliderValue(winsDisplay[0]);
  }, [winsDisplay]);

  const handleTextInput = (e) => {
    let newSliderValue = parseInt(e.target.value, 10);
    newSliderValue = Math.max(0, newSliderValue);
    newSliderValue = Math.min(newSliderValue, leftWins + rightWins);
    setSliderValue(newSliderValue);
  };

  return (
    <div className="matchup-slider">
      <div className="text-above-slider">
        <span className="left-percent">
          {Math.floor((sliderValue * 100) / (leftWins + rightWins))}
        </span>
        <span className="percent-divider">:</span>
        <span className="right-percent">
          {Math.ceil(
            ((leftWins + rightWins - sliderValue) * 100) /
              (leftWins + rightWins)
          )}
        </span>
      </div>
      <>
        <div>
          {quizMode ? (
            <input
              id="slider-input"
              type="range"
              min="0"
              max={leftWins + rightWins}
              value={sliderValue}
              step="1"
              onChange={(e) => {
                let l = parseInt(e.target.value, 10);
                let r = leftWins + rightWins - l;
                dispatch({ type: "updateWinsDisplay", winsDisplay: [l, r] });
              }}
            />
          ) : (
            <meter
              id="slider-meter"
              min="0"
              max={leftWins + rightWins}
              value={leftWins}
            />
          )}
        </div>
      </>
      <div className="percentContainer">
        <>
          {quizMode ? (
            <input
              type="number"
              value={sliderValue}
              onChange={quizMode ? handleTextInput : undefined}
              className="winrate-input"
            />
          ) : (
            <div className="winrate-text">{leftWins}</div>
          )}
        </>
        <span className="winLoseSeparator">:</span>
        <div className="loserate-text">
          {leftWins + rightWins - sliderValue}
        </div>
      </div>
    </div>
  );
};

export default MatchupSlider;

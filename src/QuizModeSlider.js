// MatchupSlider.js
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";

import "./QuizModeSlider.css";

const MatchupSlider = ({ winsDisplay }) => {
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
      <>
        <div>
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
        </div>
      </>
      <div className="percentContainer">
        <>
          <input
            type="number"
            value={sliderValue}
            onChange={(e) => {
              let l = parseInt(e.target.value, 10);
              let r = leftWins + rightWins - l;
              dispatch({ type: "updateWinsDisplay", winsDisplay: [l, r] });
            }}
            className="slider-num-input win-text-color"
          />
          <h2>:</h2>
          <input
            type="number"
            value={rightWins}
            onChange={(e) => {
              let r = parseInt(e.target.value, 10);
              let l = leftWins + rightWins - r;
              dispatch({ type: "updateWinsDisplay", winsDisplay: [l, r] });
            }}
            className="slider-num-input lose-text-color"
          />
        </>
      </div>
      <div className="submit-button">
        <button
          type="button"
          onClick={(e) => {
            dispatch({ type: "setQuizSubmitAnimation", val: true });
            setTimeout(() => {
              dispatch({ type: "setQuizSubmitAnimation", val: false });
            }, 5000);
          }}
        >
          submit
        </button>
      </div>
    </div>
  );
};

export default MatchupSlider;

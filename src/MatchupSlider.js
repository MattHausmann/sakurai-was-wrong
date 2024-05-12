// MatchupSlider.js
import React, { useState, useEffect } from "react";

const MatchupSlider = ({
  winsL,
  winsR,
  newRandomMatchup,
  leftCharacter,
  rightCharacter,
  onChange,
  videogameId,
  quizMode,
}) => {
  const [sliderValue, setSliderValue] = useState(winsL);

  const [leftWins, setLeftWins] = useState(winsL);
  const [rightWins, setRightWins] = useState(winsR);

  const handleSliderChange = (e) => {
    if (!quizMode) {
      return;
    }
    let newLeftWins = Math.floor(e.target.value);
    setSliderValue(newLeftWins);
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    setLeftWins(winsL);
    setRightWins(winsR);
    setSliderValue(winsL);
  }, [winsL, winsR]);

  const handleTextInput = (e) => {
    let newSliderValue = parseInt(e.target.value, 10);
    newSliderValue = Math.max(0, newSliderValue);
    newSliderValue = Math.min(newSliderValue, leftWins + rightWins);
    setSliderValue(newSliderValue);
  };

  return (
    <div className="matchup-slider">
      <div className="text-above-slider">
        <>
          {quizMode ? (
            <input
              type="number"
              value={sliderValue}
              onChange={quizMode ? handleTextInput : undefined}
              className="winrate-input"
            />
          ) : (
            <div className="winrate">{leftWins}</div>
          )}
        </>

        <span className="winLoseSeparator">:</span>
        <div className="loserate">{leftWins + rightWins - sliderValue}</div>
      </div>
      <>
        {quizMode ? (
          <input
            id="slider-input"
            type="range"
            min="0"
            max={leftWins + rightWins}
            value={sliderValue}
            step="1"
            onChange={quizMode ? handleSliderChange : undefined}
          />
        ) : (
          <meter
            id="slider-meter"
            min="0"
            max={leftWins + rightWins}
            value={leftWins}
          />
        )}
      </>
      <div className="percentContainer">
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
    </div>
  );
};
export default MatchupSlider;

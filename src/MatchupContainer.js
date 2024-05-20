// MatchupContainer.js
import { useState, React } from "react";
import { useSelector, useDispatch } from "react-redux";

import LabeledCharacterPortrait from "./CharacterPortrait";
import { MatchupNavigator } from "./MatchupNavigator.js";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import PieChartComponent from "./PieChartComponent";
import QuizModeSlider from "./QuizModeSlider";

import "./MatchupContainer.css";

const MatchupContainer = () => {
  const dispatch = useDispatch();
  const { matchup, quizMode, winsDisplay, lockLeft } = useSelector(
    (state) => state
  );
  let { left, right } = matchup;

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait
          lockSwitch
          side={"left"}
          onClick={() => {
            dispatch({ type: "toggleLockLeft" });
          }}
        />
        <div className="matchup-container-center">
          <MatchupRecordDisplay
            leftWins={winsDisplay[0]}
            rightWins={winsDisplay[1]}
          />
          <div className="matchup-graphs">
            <div className="pie-chart-container">
              <PieChartComponent />
            </div>
            {quizMode && <QuizModeSlider winsDisplay={winsDisplay} />}
          </div>
        </div>
        <LabeledCharacterPortrait side={"right"} />
      </div>
      <div class="bottom-row">
        <MatchupNavigator lockLeft={lockLeft} />
      </div>
    </div>
  );
};

export default MatchupContainer;

// MatchupContainer.js
import React from "react";
import { useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";

import LabeledCharacterPortrait from "./CharacterPortrait";
import { MatchupNavigator } from "./MatchupNavigator.js";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import QuizModeSlider from "./QuizModeSlider";

import "./MatchupContainer.css";

let possibleMatchups = {};
const MATCHUP_THRESHOLD = 200;

const MatchupContainer = () => {
  const { matchup, quizMode, winsDisplay } = useSelector((state) => state);
  let { left, right } = matchup;

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait side="left" />
        <div className="matchup-container-center">
          <MatchupRecordDisplay
            leftWins={winsDisplay[0]}
            rightWins={winsDisplay[1]}
          />
          <div className="matchup-graphs">
            <div className="pie-chart-container">
              <PieChart
                slotProps={{ legend: { hidden: true } }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: winsDisplay[1],
                        label: right,
                        color: "#cc76a1",
                      },
                      {
                        id: 1,
                        value: winsDisplay[0],
                        label: left,
                        color: "#87b38d",
                      },
                    ],
                  },
                ]}
                width={200}
                height={200}
              />
            </div>
            {quizMode && <QuizModeSlider winsDisplay={winsDisplay} />}
          </div>
        </div>
        <LabeledCharacterPortrait side="right" />
      </div>
      <div class="bottom-row">
        <MatchupNavigator />
      </div>
    </div>
  );
};

export default MatchupContainer;

// MatchupContainerView.js
import React from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";
import { useSelector } from "react-redux";

import wins from "./wins.json";

import MatchupRecordDisplay from "./MatchupRecordDisplay";
import { PieChart } from "@mui/x-charts/PieChart";
import NavigationOverlay from "./NavigationOverlay";

import "./MatchupContainer.css";

const MatchupContainerView = () => {
  const dimensions = useDimensions();

  const { matchup, quizMode } = useSelector((state) => state);
  const { videogameId, left, right } = matchup;

  const newRandomMatchup = () => {};

  if (dimensions.width < 800) {
    return (
      <div className="matchup-container">
        <div className="top-row">
          <LabeledCharacterPortrait side="left" />
          <LabeledCharacterPortrait side="right" />
        </div>
        <MatchupSlider
          winsL={wins[videogameId][left][right]}
          winsR={wins[videogameId][right][left]}
        />
      </div>
    );
  }

  return (
    <div className="matchup-container">
      <div className="top-row">
        <NavigationOverlay>
          <LabeledCharacterPortrait side="left" />
        </NavigationOverlay>
        <div className="matchup-container-center">
          <MatchupRecordDisplay
            leftWins={wins[videogameId][left][right]}
            rightWins={wins[videogameId][right][left]}
          />
          <div className="matchup-graphs">
            <div className="pie-chart-container">
              <PieChart
                slotProps={{ legend: { hidden: true } }}
                // legend: { classes: ["pie-chart-legend"] } }}
                // hidden: true } }}
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: wins[videogameId][right][left],
                        label: right,
                        color: "#cc76a1",
                      },
                      {
                        id: 1,
                        value: wins[videogameId][left][right],
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
            {quizMode && (
              <div style={{ width: "100%", display: "flex" }}>
                TODO: quizMode slider here
              </div>
            )}
          </div>
        </div>
        <NavigationOverlay>
          <LabeledCharacterPortrait side="right" />
        </NavigationOverlay>
      </div>
    </div>
  );
};

export default MatchupContainerView;

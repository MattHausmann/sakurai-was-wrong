// MatchupContainerView.js
import React from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";
import { useSelector, useDispatch } from "react-redux";

import wins from "./wins.json";

import { PieChart } from "@mui/x-charts/PieChart";
import NavigationOverlay from "./NavigationOverlay";

import "./MatchupContainer.css";

const MatchupContainerView = () => {
	const dispatch = useDispatch();
  const dimensions = useDimensions();

  const { matchup } = useSelector((state) => state);
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
		<LabeledCharacterPortrait side="left" />
        <div className="matchup-graphs">
          <MatchupSlider
            winsL={wins[videogameId][left][right]}
            winsR={wins[videogameId][right][left]}
          />
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
        </div>
          <LabeledCharacterPortrait side="right" />
      </div>
	  <div class="bottom-row">
		<button onClick={() => {console.log('clicked');dispatch({ type: "first"});}}>First</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "prev"});}}>Previous</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "random"});}}>New</button>
	  </div>
    </div>
  );
};

export default MatchupContainerView;

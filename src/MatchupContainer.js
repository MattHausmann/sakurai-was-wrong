// MatchupContainer.js
import React, { useState, useEffect } from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import { MatchupNavigator, first, prev, next, last, randomMatchup, getWins } from "./MatchupNavigator.js";

import { useSelector, useDispatch } from "react-redux";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import { PieChart } from "@mui/x-charts/PieChart";

import "./MatchupContainer.css";


let possibleMatchups = {};
const MATCHUP_THRESHOLD = 200;


//first, if the videogameId changes,you need to create a new matchup with the new videogameId
//then if the videogameId, leftCharacter, or rightCharacter changes,
const MatchupContainer = () => {
	const { matchup, quizMode } = useSelector((state) => state);
	const dispatch = useDispatch();
	
  
  let {videogameId, left, right} = matchup;

  const [leftCharacterName, setLeftCharacterName] = useState(left);
  const [rightCharacterName, setRightCharacterName] = useState(right);

  let [winsL, winsR] = getWins(matchup);

  //winsL and winsR are the correct answer
  //leftWins and rightWins are what's displayed
  const [leftWins, setLeftWins] = useState(winsL);
  const [rightWins, setRightWins] = useState(winsR);

  const [sliderValue, setSliderValue] = useState(leftWins);



  useEffect(() => {
    let [winsL, winsR] = getWins(matchup);
    let newLeftWins = winsL;
    let newRightWins = winsR;
    if (quizMode) {
      let halfWins = Math.ceil((winsL + winsR) / 2);
      newLeftWins = halfWins;
      newRightWins = winsL + winsR - newLeftWins;
    }
    setLeftWins(newLeftWins);
    setRightWins(newRightWins);

    setSliderValue(leftWins);
  }, [matchup]);


  return (
    <div className="matchup-container">
      <div className="top-row">
          <LabeledCharacterPortrait side="left" />
        <div className="matchup-container-center">
          <MatchupRecordDisplay
            leftWins={winsL}
            rightWins={winsR}
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
                        value: winsR,
                        label: right,
                        color: "#cc76a1",
                      },
                      {
                        id: 1,
                        value: winsL,
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
          <LabeledCharacterPortrait side="right" />
      </div>
	  <div class="bottom-row">
		<MatchupNavigator />
	  </div>
    </div>
  );
};

export default MatchupContainer;


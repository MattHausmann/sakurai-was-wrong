// MatchupContainer.js
import React, { useState, useEffect } from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";

import NavigationOverlay from "./NavigationOverlay";
import wins from "./wins.json";

import { useSelector, useDispatch } from "react-redux";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import { PieChart } from "@mui/x-charts/PieChart";

import "./MatchupContainer.css";


let possibleMatchups = {};
const MATCHUP_THRESHOLD = 200;

for (let videogameId of [1, 1386]) {
  possibleMatchups[videogameId] = {};
  for (let winner in wins[videogameId]) {
    possibleMatchups[videogameId][winner] = [];
    for (let loser in wins[videogameId][winner]) {
      var matches = wins[videogameId][winner][loser];
      if (loser in wins[videogameId]) {
        if (winner in wins[videogameId][loser]) {
          matches += wins[videogameId][loser][winner];
        }
      }
      //push matchup if it has at least 200 matches
      //doing list contains idk maybe should be sets
      //whole function takes ~20ms on my ancient laptop so it's fine
      if (matches >= MATCHUP_THRESHOLD && winner != loser) {
        let alphabeticallyFirst = winner > loser ? loser : winner;
        let alphabeticallyLast = winner > loser ? winner : loser;
        if (!(alphabeticallyFirst in possibleMatchups[videogameId])) {
          possibleMatchups[videogameId][alphabeticallyFirst] = [];
        }
        if (
          !possibleMatchups[videogameId][alphabeticallyFirst].includes(
            alphabeticallyLast
          )
        ) {
          possibleMatchups[videogameId][alphabeticallyFirst].push(
            alphabeticallyLast
          );
        }
      }
    }
  }

  //now clean up
  for (let alphabeticallyFirst in possibleMatchups[videogameId]) {
    if (possibleMatchups[videogameId][alphabeticallyFirst].length === 0) {
      delete possibleMatchups[videogameId][alphabeticallyFirst];
    }
  }
}

function randomMatchupNames(videogameId, oldFirst, oldLast) {
  let rolling = true;
  let firsts = {};
  let randomFirst = "";
  let lasts = {};
  let randomLast = "";
  while (rolling) {
    firsts = Object.keys(possibleMatchups[videogameId]);
    randomFirst = firsts[Math.floor(Math.random() * firsts.length)];
    lasts = possibleMatchups[videogameId][randomFirst];
    randomLast = lasts[Math.floor(Math.random() * lasts.length)];
    rolling = randomFirst === oldFirst && randomLast === oldLast;
    rolling = rolling || (randomFirst === oldLast && randomLast === oldFirst);
  }
  if (Math.random() < 0.5) {
    return [randomLast, randomFirst];
  }
  return [randomFirst, randomLast];
}

function getWins(videogameId, left, right) {
  let leftWins = 0;
  let rightWins = 0;
  if (videogameId in wins) {
    if (left in wins[videogameId]) {
      if (right in wins[videogameId][left]) {
        leftWins = wins[videogameId][left][right];
      } else {
        leftWins = 0;
      }
    } else {
      leftWins = 0;
    }
    if (right in wins[videogameId]) {
      if (left in wins[videogameId][right]) {
        rightWins = wins[videogameId][right][left];
      } else {
        rightWins = 0;
      }
    } else {
      rightWins = 0;
    }

    return [leftWins, rightWins];
  }
}

//first, if the videogameId changes,you need to create a new matchup with the new videogameId
//then if the videogameId, leftCharacter, or rightCharacter changes,
const MatchupContainer = () => {
  const { matchup, quizMode } = useSelector((state) => state);
	const dispatch = useDispatch();
  
  let {videogameId, left, right} = matchup;
  console.log(matchup);
  const [leftCharacterName, setLeftCharacterName] = useState(left);
  const [rightCharacterName, setRightCharacterName] = useState(right);

  let [winsL, winsR] = getWins(videogameId, left, right);

  //winsL and winsR are the correct answer
  //leftWins and rightWins are what's displayed
  const [leftWins, setLeftWins] = useState(winsL);
  const [rightWins, setRightWins] = useState(winsR);

  const [sliderValue, setSliderValue] = useState(leftWins);

  const newRandomMatchup = (videogameId, leftChar, rightChar) => {
    let [left, right] = randomMatchupNames(videogameId, leftChar, rightChar);
    setLeftCharacterName(left);
    setRightCharacterName(right);
  };


  useEffect(() => {
    let [winsL, winsR] = getWins(
      videogameId,
      leftCharacterName,
      rightCharacterName
    );
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
  }, [leftCharacterName, rightCharacterName]);


  return (
    <div className="matchup-container">
      <div className="top-row">
          <LabeledCharacterPortrait side="left" />
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
          <LabeledCharacterPortrait side="right" />
      </div>
	  <div class="bottom-row">
		<button onClick={() => {console.log('clicked');dispatch({ type: "first"});}}>First</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "prev"});}}>Previous</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "random"});}}>New</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "next"});}}>Next</button>
		<button onClick={() => {console.log('clicked');dispatch({ type: "last"});}}>Last</button>
	  </div>
    </div>
  );
};

export default MatchupContainer;

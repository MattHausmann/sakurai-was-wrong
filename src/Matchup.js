// Matchup.js
import React, { useState, useEffect } from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupSlider from "./MatchupSlider";
import OverlayComponent from './OverlayComponent';

//import Navigation from './Navigation';
import wins from "./wins.json";

import MatchupNavigator from "./MatchupNavigator";

let possibleMatchups = {};
const MATCHUP_THRESHOLD = 200;

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
const Matchup = ({ videogameId, left, right, quizMode }) => {
  const [leftCharacterName, setLeftCharacterName] = useState(left);
  const [rightCharacterName, setRightCharacterName] = useState(right);

  let [winsL, winsR] = getWins(videogameId, left, right);

  //winsL and winsR are the correct answer
  //leftWins and rightWins are what's displayed
  const [leftWins, setLeftWins] = useState(winsL);
  const [rightWins, setRightWins] = useState(winsR);

  const [sliderValue, setSliderValue] = useState(leftWins);



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

    console.log(`old sliderValue: ${sliderValue}`);
    setSliderValue(leftWins);
  }, [leftCharacterName, rightCharacterName]);

  console.log(
    `getWins(${videogameId}, ${leftCharacterName}, ${rightCharacterName}):`
  );
  console.log(getWins(videogameId, leftCharacterName, rightCharacterName));

  return (
    <div className="matchup-container">
      <div className="top-row">
			<LabeledCharacterPortrait
			  videogameId={videogameId}
			  name={leftCharacterName}
			/>
			<MatchupSlider
			  winsL={leftWins}
			  winsR={rightWins}
			  quizMode={quizMode}
			  videogameId={videogameId}
			  leftCharacter={leftCharacterName}
			  rightCharacter={rightCharacterName}
			/>
			<LabeledCharacterPortrait
			  videogameId={videogameId}
			  name={rightCharacterName}
			/>
	  </div>
      <div className="bottom-row">
        <MatchupNavigator
          videogameId={videogameId}
          leftCharacter={leftCharacterName}
          rightCharacter={rightCharacterName}
        />
      </div>
    </div>
  );
};

export default Matchup;

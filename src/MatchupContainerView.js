// MatchupContainerView.js
import React, { useState, useEffect } from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupNavigator from "./MatchupNavigator";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";

import "./MatchupContainer.css";

const MatchupContainerView = (props) => {
  const dimensions = useDimensions();

  if (dimensions.width < 800) {
    return (
      <div className="matchup-container">
        <div className="top-row">
          <LabeledCharacterPortrait
            videogameId={props.videogameId}
            name={props.leftCharacterName}
          />
          <LabeledCharacterPortrait
            videogameId={props.videogameId}
            name={props.rightCharacterName}
          />

          <MatchupSlider
            winsL={props.leftWins}
            winsR={props.rightWins}
            quizMode={props.quizMode}
            newRandomMatchup={props.newRandomMatchup}
            videogameId={props.videogameId}
            leftCharacter={props.leftCharacterName}
            rightCharacter={props.rightCharacterName}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait
          videogameId={props.videogameId}
          name={props.leftCharacterName}
        />
        <MatchupSlider
          winsL={props.leftWins}
          winsR={props.rightWins}
          quizMode={props.quizMode}
          newRandomMatchup={props.newRandomMatchup}
          videogameId={props.videogameId}
          leftCharacter={props.leftCharacterName}
          rightCharacter={props.rightCharacterName}
        />
        <LabeledCharacterPortrait
          videogameId={props.videogameId}
          name={props.rightCharacterName}
        />
      </div>
      <div className="bottom-row">
        <MatchupNavigator
          videogameId={props.videogameId}
          leftCharacter={props.leftCharacterName}
          rightCharacter={props.rightCharacterName}
        />
      </div>
    </div>
  );
};

export default MatchupContainerView;

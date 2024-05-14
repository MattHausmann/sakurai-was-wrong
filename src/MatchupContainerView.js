// MatchupContainerView.js
import React from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupNavigator from "./MatchupNavigator";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";
import { useSelector } from 'react-redux';
import wins from './wins.json';

import "./MatchupContainer.css";

const MatchupContainerView = () => {
  const dimensions = useDimensions();
  
  const {matchup} = useSelector((state) => state);
  const {videogameId, left, right} = matchup;
  
  const newRandomMatchup = () => {};

  if (dimensions.width < 800) {
    return (
      <div className="matchup-container">
        <div className="top-row">
          <LabeledCharacterPortrait side="left"/>
          <LabeledCharacterPortrait side="right"/>
        </div>

          <MatchupSlider
            winsL={wins[videogameId][left][right]}
            winsR={wins[videogameId][right][left]}/>
        </div>
    );
  }

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait side="left"/>
        <MatchupSlider 
			winsL={wins[videogameId][left][right]}
			winsR={wins[videogameId][right][left]}/>
        <LabeledCharacterPortrait side="right"/>

      </div>
      <div className="bottom-row">
        <MatchupNavigator
          newRandomMatchup={newRandomMatchup}
        />
      </div>
    </div>
  );
};

export default MatchupContainerView;

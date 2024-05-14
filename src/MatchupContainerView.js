// MatchupContainerView.js
import React from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupNavigator from "./MatchupNavigator";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";
import { useSelector } from 'react-redux';
import wins from './wins.json';

import NavigationOverlay from './NavigationOverlay';

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
			<NavigationOverlay>
				<LabeledCharacterPortrait side="left"/>
			</NavigationOverlay>
					<MatchupSlider 
						winsL={wins[videogameId][left][right]}
						winsR={wins[videogameId][right][left]}
					/>
			<NavigationOverlay>
				<LabeledCharacterPortrait side="right"/>
			</NavigationOverlay>
		  </div>
		</div>
  );
};

export default MatchupContainerView;

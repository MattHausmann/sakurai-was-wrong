// MatchupContainerView.js
import React from "react";
import LabeledCharacterPortrait from "./CharacterPortrait";
import MatchupNavigator from "./MatchupNavigator";
import MatchupSlider from "./MatchupSlider";
import useDimensions from "./hooks/useDimensions";
import { useSelector } from "react-redux";

import "./MatchupContainer.css";

const MatchupContainerView = () => {
	let {matchup} = useSelector((state) => state);
  const dimensions = useDimensions();

  if (dimensions.width < 800) {
    return (
      <div className="matchup-container">
        <div className="top-row">
          <LabeledCharacterPortrait orientation='left'/>
          <LabeledCharacterPortrait orientation='right'/>
        </div>

          <MatchupSlider/>
        </div>
    );
  }

  return (
    <div className="matchup-container">
      <div className="top-row">
        <LabeledCharacterPortrait orientation='left'/>
        <MatchupSlider/>
        <LabeledCharacterPortrait orientation='right'/>
      </div>
      <div className="bottom-row">
        <MatchupNavigator/>
      </div>
    </div>
  );
};

export default MatchupContainerView;

// CharacterPortrait.js
import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';

const LabeledCharacterPortrait = ({side}) => {
	console.log(side);
	
	let { matchup } = useSelector((state) => state);
	console.log(matchup);
  let [loading, setLoading] = useState(true);
  let [baseImagePath, setBaseImagePath] = useState(
    `./characters/${videogameId}/${name}/image.png`
  );
  let [resolvedName, setResolvedName] = useState(name);

	const fromNameToResolvedName = {
		"R.O.B.":"R.O.B",
		"Bowser Jr.":"Bowser Jr",
		"Sheik / Zelda" : "Sheik & Zelda",
		"Daisy" : "Peach",
		"Dark Samus": "Samus",
		"Dark Pit": "Pit",
		"Richter": "Simon Belmont"
	};

	
	const getResolvedName = () => {
		let name=matchup.left;
		if(side=='right') {
			name = matchup.right;
		}
		if(name in fromNameToResolvedName) {
			return fromNameToResolvedName[name];
		}
		return name;
	}

  
  const getBaseImagePath = () => {
		let resolvedName = getResolvedName();		
		let videogameId = matchup.videogameId;
		
		return `./characters/${videogameId}/${resolvedName}/image.png`;
  }

  useEffect(() => {
    setLoading(true);
    const handleImageLoad = () => {
      setLoading(false);
    };
	
	const baseImagePath = getBaseImagePath();
	console.log(baseImagePath);


    // Create a new image element directly
    const imageElement = new Image();
    imageElement.src = baseImagePath;
    imageElement.onload = handleImageLoad;
  }, [matchup]);

  if (loading) {
    return (
      <div className="labeled-portrait">
        <div className="loading-container">Loading...</div>
        <p>{getResolvedName()}</p>
      </div>
    );
  }


  return (
    <div className="labeled-portrait">
      <img src={getBaseImagePath()} alt={getResolvedName()} />
      <p>{getResolvedName()}</p>
    </div>
  );
};

export default LabeledCharacterPortrait;

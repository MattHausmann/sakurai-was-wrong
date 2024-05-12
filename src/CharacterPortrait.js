// CharacterPortrait.js
import React, { useState, useEffect } from "react";

const LabeledCharacterPortrait = ({ videogameId, name, onLoad }) => {
  let [loading, setLoading] = useState(true);

  let resolvedName = name;
  //directory names can't end in periods
  if (name === "R.O.B.") {
    resolvedName = "R.O.B";
  }
  if (name === "Bowser Jr.") {
    resolvedName = "Bowser Jr";
  }
  if (name === "Sheik / Zelda") {
    resolvedName = "SheikZelda";
  }
  if (name === "Daisy") {
    resolvedName = "Peach";
  }
  if (name === "Dark Samus") {
    resolvedName = "Samus";
  }
  if (name === "Dark Pit") {
    resolvedName = "Pit";
  }

  const baseImagePath = `./characters/${videogameId}/${resolvedName}/image.png`;
  useEffect(() => {
    setLoading(true);
    const handleImageLoad = () => {
      setLoading(false);
      if (onLoad) {
        onLoad();
      }
    };

    // Create a new image element directly
    const imageElement = new Image();
    imageElement.src = baseImagePath;
    imageElement.onload = handleImageLoad;
  }, [name, videogameId]);

  if (loading) {
    return (
      <div className="labeled-portrait">
        <div className="loading-container">Loading...</div>
        <p>{resolvedName}</p>
      </div>
    );
  }

  return (
    <div className="labeled-portrait">
      <img src={baseImagePath} alt={resolvedName} />
      <p>{resolvedName}</p>
    </div>
  );
};

export default LabeledCharacterPortrait;

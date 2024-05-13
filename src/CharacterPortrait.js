// CharacterPortrait.js
import React, { useState, useEffect } from "react";

const LabeledCharacterPortrait = ({ videogameId, name }) => {
  let [loading, setLoading] = useState(true);
  let [baseImagePath, setBaseImagePath] = useState(
    `./characters/${videogameId}/${name}/image.png`
  );
  let [resolvedName, setResolvedName] = useState(name);

  useEffect(() => {
    //directory names can't end in periods
    if (name === "R.O.B.") {
      setResolvedName("R.O.B");
    }
    if (name === "Bowser Jr.") {
      setResolvedName("Bowser Jr");
    }
    if (name === "Sheik / Zelda") {
      setResolvedName("SheikZelda");
    }
    if (name === "Daisy") {
      setResolvedName("Daisy");
    }
    if (name === "Dark Samus") {
      setResolvedName("Samus");
    }
    if (name === "Dark Pit") {
      setResolvedName("Pit");
    }
  }, [name]);

  useEffect(() => {
    setLoading(true);
    setBaseImagePath(`./characters/${videogameId}/${resolvedName}/image.png`);
  }, [resolvedName, videogameId]);

  return (
    <div className="labeled-portrait">
      <img
        src={baseImagePath}
        alt={loading ? "Loading..." : resolvedName}
        onLoad={() => setLoading(false)}
      />
      <p>{resolvedName}</p>
    </div>
  );
};

export default LabeledCharacterPortrait;

// CharacterPortrait.js
import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

const LabeledCharacterPortrait = ({ side }) => {
  let { matchup } = useSelector((state) => state);

  let [loading, setLoading] = useState(true);
  let [baseImagePath, setBaseImagePath] = useState("");
  let [resolvedName, setResolvedName] = useState("");

  let fromNameToResolvedName = useMemo(() => {
    return {
      "R.O.B.": "R.O.B",
      "Bowser Jr.": "Bowser Jr",
      "Sheik / Zelda": "Sheik & Zelda",
      "Daisy": "Peach",
      "Dark Samus": "Samus",
      "Dark Pit": "Pit",
      "Richter": "Simon Belmont",
    };
  }, []);

  useEffect(() => {
    let name = matchup.left;
    if (side === "right") {
      name = matchup.right;
    }
    if (name in fromNameToResolvedName) {
      name = fromNameToResolvedName[name];
    }
    setResolvedName(name);
    setBaseImagePath(`./characters/${matchup.videogameId}/${name}/image.png`);
  }, [fromNameToResolvedName, matchup, side]);

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

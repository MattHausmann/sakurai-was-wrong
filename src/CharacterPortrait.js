// CharacterPortrait.js
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import CharacterDropdown from './CharacterDropdown';
import "./CharacterPortrait.css"

const LabeledCharacterPortrait = ({ side, lockSwitch, onClick }) => {
	let { matchup, lockLeft, quizMode } = useSelector((state) => state);
	let [baseImagePath, setBaseImagePath] = useState("");
	let [loading, setLoading] = useState(true);
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
		let newName = matchup.left;
		if (side === "right") {
			newName = matchup.right;
		}
		if (newName in fromNameToResolvedName) {
			newName = fromNameToResolvedName[newName];
		}

		setResolvedName(newName);
		setLoading(true);
		setBaseImagePath(`./characters/${matchup.videogameId}/${newName}/image.png`);
	}, [fromNameToResolvedName, matchup, side]);

	let dispatch = useDispatch();

	return (
		<div className="labeled-portrait">
			<img
				src={baseImagePath}
				alt={loading ? "Loading..." : resolvedName}
				onLoad={() => setLoading(false)}
			/>
			{quizMode?
				<div className="character-label">{resolvedName}</div>:
				<CharacterDropdown side={side} />
			}
				{lockSwitch && (
					<label>
						Lock Character:
						<input type="checkbox" checked={lockLeft} onChange={() => {dispatch({type:"toggleLockLeft"});}} />
					</label>
				)}
		</div>
	);
};

export default LabeledCharacterPortrait;

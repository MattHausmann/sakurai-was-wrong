// CharacterPortrait.js
import React, { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import CharacterDropdown from './CharacterDropdown';
import "./CharacterPortrait.css"
import { matchupsPerCharacter, winnerWinPercentList } from './MatchupNavigator';

const LabeledCharacterPortrait = ({ side, lockSwitch, onClick }) => {
	let { idx, requiredLeft, quizMode } = useSelector((state) => state.main);
	let list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let matchup = list[idx];
	let [baseImagePath, setBaseImagePath] = useState("");
	let [loading, setLoading] = useState(true);
	let [name, setName] = useState("");
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

		setName(newName);

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
				<div className="character-label">
					<img className="selection-game" src={"/characters/"+matchup.videogameId+"/logo.png"} alt={resolvedName} />
					{resolvedName}
				</div>:
				<CharacterDropdown side={side} />
			}
				{lockSwitch && (
					<label>
						Lock Character:
						<input type="checkbox" checked={requiredLeft} onChange={() => {dispatch({type:"toggleRequiredLeft", val:name});}} />
					</label>
				)}
		</div>
	);
};

export default LabeledCharacterPortrait;

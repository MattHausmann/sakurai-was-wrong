import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { matchupsPerCharacter, winnerWinPercentList, getTotalGames, searchListForMatchingMatchup } from "./MatchupNavigator";
import {gameIdMap } from "./consts";
import "./CharacterDropdown.css";
import wins from './wins.json';

const CharacterDropdown = ({ side }) => {
	let dispatch = useDispatch();
	const { idx, minimumGames, videogameIds, requiredLeft } = useSelector((state) => state.main);
	let list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let matchup = list[idx];

	let [dropdownOpen, setDropdownOpen] = useState(false);
	let [dialogErrors, setDialogErrors] = useState("");
	let [attemptedMatchup, setAttemptedMatchup] = useState(null);

	let [dropdownId, setDropdownId] = useState(side + "CustomDropdown");
	let [selected, setSelected] = useState(side === "left" ? matchup.left : matchup.right);
	let [other, setOther] = useState(side === "left" ? matchup.right : matchup.left);

	useEffect(() => {
		setSelected(side === "left" ? matchup.left : matchup.right);
		setOther(side === "left" ? matchup.right : matchup.left);
	}, [side, matchup]);

	useEffect(()=>{
		setDropdownId(side + "CustomDropdown")
	}, [side]);

	const errorRef = useRef();

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const setMatchup = (m) => {
		let {left,right, videogameId} = m;
		let leftWins = wins[videogameId][left][right];
		let rightWins = wins[videogameId][right][left];
		if(rightWins > leftWins) {
			dispatch({ type: "setRequiredLeft", requiredLeft:left });
		}
		dispatch({ type: "setMatchupIdx", idx:searchListForMatchingMatchup(list, m)});
		setDropdownOpen(false);
	};

	const notEnoughGames = "Not enough games.\n";
	const wrongVideogameId = "Matchup for wrong game.\n";
	const getErrors = (m) => {
		let errors = "";
		if (getTotalGames(m) < minimumGames) {
			errors += notEnoughGames;
		}
		if (videogameIds.length > 0 && !videogameIds.includes("" + m.videogameId)) {
			errors += wrongVideogameId;
		}
		return errors;
	};

	const compareMatchups = (a, b) => {
		if (getErrors(a) && !getErrors(b)) {
			return 1;
		}
		if (getErrors(b) && !getErrors(a)) {
			return -1;
		}

		if (a.videogameId === b.videogameId) {
			return a.right.localeCompare(b.right);
		}

		if (videogameIds.length === 1) {
			let targetVideogameId = videogameIds[0];
			if (a.videogameId !== b.videogameId) {
				if (a.videogameId === targetVideogameId) {
					return -1;
				}
				return 1;
			}
		}
		return a.right.localeCompare(b.right);
	};
	let matchupsPerOtherCharacter = [...matchupsPerCharacter[other]].sort(
		compareMatchups
	);

	const showErrorDialog = (errors, m) => {
		setAttemptedMatchup(m);
		setDialogErrors(errors);
		errorRef.current.showModal();
	};

	return (
		<div className="dropdown" id={dropdownId}>
			<div
				className="dropdown-toggle"
				id="dropdownToggle"
				onClick={toggleDropdown}
			>
				<img
					className="selection-game"
					src={"characters/" + matchup.videogameId + "/logo.png"}
					alt={gameIdMap[matchup.videogameId] || "Smash"}
				/>
				<span className="selection-char">
					{selected}
					<i className="fa-solid fa-triangle" />
				</span>
			</div>
			<div
				className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}
				id="dropdownMenu"
			>
				{matchupsPerOtherCharacter.map((m) => (
					<div
						key={m.videogameId + m.right}
						className={`dropdown-item ${getErrors(m) ? "errors" : ""}`}
						onClick={() => {
							if (getErrors(m)) {
								showErrorDialog(getErrors(m), m);
							} else {
								if (side === "left") {
									let oldLeft = m.left;
									m.left = m.right;
									m.right = oldLeft;
								}
								setMatchup(m);
							}
						}}
					>
						<img
							className="selection-game"
							src={"characters/" + m.videogameId + "/logo.png"}
							alt={gameIdMap[m.videogameId] || "Smash"}
						/>
						<span>{m.right}</span>
					</div>
				))}
			</div>
			<dialog ref={errorRef}>
				<p>{dialogErrors}</p>

				<button
					onClick={() => {
						if (dialogErrors.includes(notEnoughGames)) {
							dispatch({
								type: "setMinimumGames",
								val: getTotalGames(attemptedMatchup),
							});
						}
						if (dialogErrors.includes(wrongVideogameId)) {
							dispatch({
								type: "toggleVideogameId",
								val: attemptedMatchup.videogameId,
							});
						}
						dispatch({ type: "setMatchupIdx", idx:searchListForMatchingMatchup(list, attemptedMatchup)});
						setAttemptedMatchup(null);
						errorRef.current.close();
					}}
				>
					Set criteria
				</button>

				<button
					onClick={() => {
						errorRef.current.close();
					}}
				>
					OK
				</button>
			</dialog>
		</div>
	);
};

export default CharacterDropdown;

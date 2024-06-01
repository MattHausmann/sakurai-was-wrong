// ScoreDisplay.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
	getTotalGames,
	getWins,
	matchupsPerCharacter,
	compareByLeftWinPercent,
	fromMinimumGamesToTotalMatchups,
} from "./MatchupNavigator";
import MatchupSlider from "./MatchupSlider.js";
import "./ScoreDisplay.css";

let guessedMatchups = JSON.parse(localStorage.getItem("guessedMatchups")) ?? {};
let seenMatchups = JSON.parse(localStorage.getItem("seenMatchups")) ?? {};
let bestScorePerMatchup =
	JSON.parse(localStorage.getItem("bestScorePerMatchup")) ?? {};

for (let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(
		compareByLeftWinPercent
	);
}

const ScoreDisplay = () => {
	const {
		matchup,
		bestScore,
		mostRecentScore,
		totalScore,
		totalSeen,
		totalGuessed,
		totalMatchups,
		quizResults,
		minimumGames,
	} = useSelector((state) => state);
	const dispatch = useDispatch();

	const [scoreImpact, setScoreImpact] = useState([]);

	const [sliderValue, setSliderValue] = useState(500);

	useEffect(() => {
		const impact = quizResults.map((data) => {
			let diff = data.guess[0] - data.actual[0];
			if (diff >= 0) {
				return (
					<div className="win-text-color">
						you OVERestimated the winner by {diff}.
					</div>
				);
			} else {
				return (
					<div className="lose-text-color">
						you UNDERestimated the winner by {Math.abs(diff)}.
					</div>
				);
			}
		});
		setScoreImpact(impact);
	}, [quizResults]);

	return (
		<div className="score-display">
			<div className="score-box">
				<span className="score-label">Best score</span>
				<span className="score-value">{bestScore}</span>
			</div>
			<div className="score-box">
				<span className="score-label">Most recent score</span>
				<span className="score-value">{mostRecentScore}</span>
			</div>
			<div className="score-box">
				<span className="score-label">Total score</span>
				<span className="score-value">{totalScore}</span>
			</div>
			<div className="score-box">
				<span className="score-label">Matchups guessed</span>
				<span className="score-value">{totalGuessed}<span className="align">0000</span></span>
			</div>
			<div className="score-box">
				<span className="score-label">Matchups seen</span>
				<span className="score-value">{totalSeen}<span className="align">0000</span></span>
			</div>
			<div className="score-box">
				<span className="score-label">Total matchups</span>
				<span className="score-value">{totalMatchups}<span className="align">0000</span></span>
			</div>
		</div>
	);
};

export default ScoreDisplay;

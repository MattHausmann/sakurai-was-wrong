// ScoreDisplay.js
import React from "react";
import { useSelector } from "react-redux";
import {
	matchupsPerCharacter,
	compareByLeftWinPercent,
} from "./MatchupNavigator";
import "./ScoreDisplay.css";

for (let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(
		compareByLeftWinPercent
	);
}

const ScoreDisplay = () => {
	const {
		bestScore,
		mostRecentScore,
		totalScore,
		totalSeen,
		totalGuessed,
		totalMatchups,
	} = useSelector((state) => state);

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
				<span className="score-value">
					{totalGuessed}
					<span className="align">0000</span>
				</span>
			</div>
			<div className="score-box">
				<span className="score-label">Matchups seen</span>
				<span className="score-value">
					{totalSeen}
					<span className="align">0000</span>
				</span>
			</div>
			<div className="score-box">
				<span className="score-label">Total matchups</span>
				<span className="score-value">
					{totalMatchups}
					<span className="align">0000</span>
				</span>
			</div>
		</div>
	);
};

export default ScoreDisplay;

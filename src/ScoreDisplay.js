// ScoreDisplay.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getWins, matchupsPerCharacter, compareByLeftWinPercent, fromMinimumGamesToTotalMatchups } from "./MatchupNavigator";
import "./ScoreDisplay.css";
import wins from "./wins.json";

let sortedKeys = Object.keys(fromMinimumGamesToTotalMatchups).map(Number).sort((a,b) => a-b);




for(let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(compareByLeftWinPercent);
}





const ScoreDisplay = () => {
	
	const { bestScore, totalScore, totalSeen, totalGuessed, mostRecentScore, quizResults, minimumGames } = useSelector((state) => state);
	const dispatch = useDispatch();
	
	const [scoreImpact, setScoreImpact] = useState([]);
	
	const [sliderValue, setSliderValue] = useState(500);

	const handleChange = (event) => {
		const newIndex = parseInt(event.target.value, 10);
		setSliderValue(newIndex);

		dispatch({ type: "setMinimumGames", val: sortedKeys[newIndex]});

	}
	
	
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
	<div class="score-display">
		<div class="score-box">
			<span class="score-label">Best score</span>
			<span class="score-value">{bestScore}</span>
		</div>
		<div class="score-box">
			<span class="score-label">Most recent score</span>
			<span class="score-value">{mostRecentScore}</span>
		</div>
		<div class="score-box">
			<span class="score-label">Total score</span>
			<span class="score-value">{totalScore}</span>
		</div>
		<div class="score-box">
			<span class="score-label">Matchups guessed</span>
			<span class="score-value">{totalGuessed}</span>
		</div>
		<div class="score-box">
			<span class="score-label">Matchups seen</span>
			<span class="score-value">{totalSeen}</span>
		</div>
		<div class="score-box">
			<span class="score-label">Total matchups</span>
			<span class="score-value">{fromMinimumGamesToTotalMatchups[sortedKeys[sliderValue]]}</span>
		</div>
		
		<div>
			<input
				type="range"
				min={0}
				max={sortedKeys.length - 1}
				value={sliderValue}
				onChange={handleChange}
			/>
			<span>minimumGames: {sortedKeys[sliderValue]}</span>
		</div>
	</div>
	);
};

export default ScoreDisplay;

// ScoreDisplay.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTotalGames, getWins, matchupsPerCharacter, compareByLeftWinPercent, fromMinimumGamesToTotalMatchups } from "./MatchupNavigator";
import MatchupSlider from './MatchupSlider.js';
import "./ScoreDisplay.css";
import wins from "./wins.json";



let guessedMatchups = JSON.parse(localStorage.getItem('guessedMatchups')) ?? {};
let seenMatchups = JSON.parse(localStorage.getItem('seenMatchups')) ?? {};
let bestScorePerMatchup = JSON.parse(localStorage.getItem('bestScorePerMatchup')) ?? {};


for(let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(compareByLeftWinPercent);
}




const ScoreDisplay = () => {
	
	const { matchup, bestScore, mostRecentScore, totalScore, totalSeen, totalGuessed, totalMatchups, quizResults, minimumGames } = useSelector((state) => state);
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
			<span class="score-value">{totalMatchups}</span>
		</div>
		<MatchupSlider />
	</div>
	);
};

export default ScoreDisplay;

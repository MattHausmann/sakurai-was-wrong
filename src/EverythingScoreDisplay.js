import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './EverythingScoreDisplay.css';

const EverythingScoreDisplay = () => {
	let { totalScore, totalGuessed, totalSeen, totalMatchups } = useSelector((state) => state.main);

	let maxTotalGuessedScore = totalGuessed * 10000;
	let maxTotalSeenScore = totalSeen * 10000;
	let maxTotalScore = totalMatchups * 10000;

	let [totalScoreWidth, setTotalScoreWidth] = useState(totalScore * 600 / maxTotalScore);
	let [totalSeenScoreWidth, setTotalSeenScoreWidth] = useState(maxTotalSeenScore * 600 / maxTotalScore);
	let [totalGuessedScoreWidth, setTotalGuessedScoreWidth] = useState(maxTotalGuessedScore * 600 / maxTotalScore);

	useEffect(() => {
		maxTotalScore = totalMatchups * 10000;
		maxTotalSeenScore = totalSeen * 10000;
		setTotalScoreWidth(totalScore * 600 / maxTotalScore);
		setTotalSeenScoreWidth(maxTotalSeenScore * 600 / maxTotalScore);
		setTotalGuessedScoreWidth(maxTotalGuessedScore * 600 / maxTotalScore);
	}, [totalScore, totalGuessed, totalSeen, totalMatchups]);

	return (
		<div className="everything-score-display">
			<div className="everything-score-bar total-seen" style={{ width: `${totalSeenScoreWidth}px` }}>
			</div>
			<div className="everything-score-bar total-guessed" style={{ width: `${totalGuessedScoreWidth}px` }}>
			</div>
			<div className="everything-score-bar total-score" style={{ width: `${totalScoreWidth}px` }}>
			</div>

		</div>
	);
};

export default EverythingScoreDisplay;

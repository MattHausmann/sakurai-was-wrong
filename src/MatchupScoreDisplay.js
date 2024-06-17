// src/MatchupScoreDisplay.js
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import './MatchupScoreDisplay.css';

const MatchupScoreDisplay = () => {
	let { mostRecentScore, bestScore } = useSelector((state) => state.main);

	const [recentHeight, setRecentHeight] = useState(mostRecentScore * 100 / 10000);
	const [bestHeight, setBestHeight] = useState(bestScore * 100 / 10000);


	useEffect(() => {
		setBestHeight(bestScore * 100 / 10000);
		setRecentHeight(mostRecentScore * 100 / 10000);
	}, [mostRecentScore, bestScore]);

	return (
		<div className="score-display-container">
			<div className="score-bar best-score" style={{ height: `${bestHeight}%` }}>
			</div>
			<div className="score-bar recent-score" style={{ height: `${recentHeight}%` }}>
			</div>
			<div className = "score-bar guessed-score" style= {{ height:`${0}%` }}>
			</div>
		</div>
	);
};

export default MatchupScoreDisplay;

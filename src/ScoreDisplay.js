// ScoreDisplay.js
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./ScoreDisplay.css";

const scoreGuess = (quizResults) => {
	let {matchup, guess, actual} = quizResults;
	
}



const ScoreDisplay = () => {
	const { score, seenMatchups, guessedMatchups, quizResults } = useSelector((state) => state);
	
	console.log(guessedMatchups, quizResults);
	
	const [scoreImpact, setScoreImpact] = useState([]);

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
		<div className="quizResults">
			<h4>Score: {score}</h4>
			<div className="quizResultsList">
				{quizResults.map((data, i) => {
					return (
						<>
							<div className="quizResultsRow">
								<div className="header">
									<h3>
										{data.matchup.left} vs {data.matchup.right}
									</h3>
								</div>
								<div className="data">
									<div>
										<h4>your guess</h4>
										<div className="record-display">
											<div className="win-text-color">{data.guess[0]}</div> :{" "}
											<div className="lose-text-color">{data.guess[1]}</div>
										</div>
									</div>
									<div>
										<h4>actual</h4>
										<div className="record-display">
											<div className="win-text-color">{data.actual[0]}</div> :{" "}
											<div className="lose-text-color">{data.actual[1]}</div>
										</div>
									</div>
								</div>
								{scoreImpact[i]}
							</div>
						</>
					);
				})}
			</div>
		</div>
	);
};

export default ScoreDisplay;

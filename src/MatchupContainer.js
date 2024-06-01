// MatchupContainer.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import LabeledCharacterPortrait from "./CharacterPortrait";
import { MatchupNavigator } from "./MatchupNavigator.js";
import MatchupRecordDisplay from "./MatchupRecordDisplay";
import PieChartComponent from "./PieChartComponent";
import QuizModeSlider from "./QuizModeSlider";

import "./MatchupContainer.css";

const MatchupContainer = () => {
	const dispatch = useDispatch();
	const { displayQuizResults, quizMode, winsDisplay, lockLeft, reversed } = useSelector(
		(state) => state
	);
	const [pieChartDisplay, setPieChartDisplay] = useState(winsDisplay);

	useEffect(() => {
		if (displayQuizResults) {
			return;
		}
		setPieChartDisplay([winsDisplay[reversed?1:0], winsDisplay[reversed?0:1]]);
	}, [winsDisplay, displayQuizResults, reversed]);


	return (
		<div className="matchup-container">
			<div className="top-row">
				<LabeledCharacterPortrait
					lockSwitch={!quizMode}
					side={reversed?"right":"left"}
					onClick={() => {
						dispatch({ type: "toggleLockLeft" });
					}}
				/>
				<div className="matchup-container-center">
					<MatchupRecordDisplay
						leftWins={winsDisplay[reversed?1:0]}
						rightWins={winsDisplay[reversed?0:1]}
					/>
					<div className="matchup-graphs">
						{quizMode ? (
							<QuizModeSlider />
						) : (
							<div className="pie-chart-container">
								<PieChartComponent pieChartDisplay={pieChartDisplay} />
							</div>
						)}
					</div>
				</div>
				<LabeledCharacterPortrait side={reversed?"left":"right"} />
			</div>
			<div className="bottom-row">
				{!quizMode && <MatchupNavigator lockLeft={lockLeft} />}
			</div>
		</div>
	);
};


export default MatchupContainer;

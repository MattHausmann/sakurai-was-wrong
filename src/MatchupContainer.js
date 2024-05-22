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
	const { displayQuizResults, quizMode, winsDisplay, lockLeft } = useSelector(
		(state) => state
	);
	const [pieChartDisplay, setPieChartDisplay] = useState(winsDisplay);

	useEffect(() => {
		if (displayQuizResults) {
			return;
		}
		setPieChartDisplay([winsDisplay[0], winsDisplay[1]]);
	}, [winsDisplay, displayQuizResults]);

	return (
		<div className="matchup-container">
			<div className="top-row">
				<LabeledCharacterPortrait
					lockSwitch
					side={"left"}
					onClick={() => {
						dispatch({ type: "toggleLockLeft" });
					}}
				/>
				<div className="matchup-container-center">
					<MatchupRecordDisplay
						leftWins={winsDisplay[0]}
						rightWins={winsDisplay[1]}
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
				<LabeledCharacterPortrait side={"right"} />
			</div>
			<div class="bottom-row">
				<MatchupNavigator lockLeft={lockLeft} />
			</div>
		</div>
	);
};

export default MatchupContainer;

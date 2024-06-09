// MatchupSlider.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { colors } from "./colors";
import { sliderAnimationDuration, submitGuessClick, lerp } from "./events";
import NumberInput from "./NumberInput";
import { winnerWinPercentList } from "./MatchupNavigator";
import wins from "./wins.json";
import "./QuizModeSlider.css";

const isValid = (num) => {
	return num.length > 0 && !isNaN(num) && !num.startsWith("-");
};

const MatchupSlider = () => {
	const { displayQuizResults, idx, winsDisplay } = useSelector(
		(state) => state.main
	);
	const { elapsed, quizSliderAnimation } = useSelector((state) => state.async);
	const dispatch = useDispatch();

	const [sliderValue, setSliderValue] = useState(winsDisplay[0]);
	const [leftWins, setLeftWins] = useState(winsDisplay[0]);
	const [rightWins, setRightWins] = useState(winsDisplay[1]);
	const [leftWinsGuess, setLeftWinsGuess] = useState(leftWins);

	useEffect(() => {
		setLeftWins(winsDisplay[0]);
		setRightWins(winsDisplay[1]);
		setSliderValue(winsDisplay[0]);
	}, [winsDisplay]);

	useEffect(() => {
		const percentage = (leftWins / (leftWins + rightWins)) * 100;
		document.querySelector(
			".quiz-slider"
		).style.background = `linear-gradient(to right, ${colors.winGreen} ${percentage}%, ${colors.loseRed} ${percentage}%)`;
	}, [leftWins, rightWins]);

	useEffect(() => {
		if (quizSliderAnimation) {
			const totalWins = leftWins + rightWins;
			let { left, right, videogameId } = winnerWinPercentList[idx];
			let actual = [
				wins[videogameId][left][right],
				wins[videogameId][right][left],
			];
			const animatedLeftVal = Math.floor(
				lerp(leftWinsGuess, actual[0], elapsed / sliderAnimationDuration)
			);
			setLeftWins(animatedLeftVal);
			setRightWins(totalWins - animatedLeftVal);
			setSliderValue(animatedLeftVal);
		}
	}, [elapsed, idx, leftWins, leftWinsGuess, rightWins, quizSliderAnimation]);

	const handleInputChange = (e, isLeft) => {
		if (isValid(e.target.value)) {
			let l;
			let r;
			if (isLeft) {
				l = parseInt(e.target.value, 10);
				r = leftWins + rightWins - l;
			} else {
				r = parseInt(e.target.value, 10);
				l = leftWins + rightWins - r;
			}
			dispatch({ type: "updateWinsDisplay", winsDisplay: [l, r] });
		}
	};

	return (
		<>
			<div className="quiz-mode-slider">
				<input
					className={
						"quiz-slider" + (displayQuizResults ? " showing-results" : "")
					}
					type="range"
					min="0"
					max={leftWins + rightWins}
					value={sliderValue}
					step="1"
					onChange={(e) => {
						if (displayQuizResults) {
							return;
						}
						let l = parseInt(e.target.value, 10);
						let r = leftWins + rightWins - l;
						dispatch({ type: "updateWinsDisplay", winsDisplay: [l, r] });
					}}
				/>
			</div>
			<div className="num-input-container">
				<>
					<NumberInput
						label=""
						color={colors.winGreen}
						aria-label="number input"
						value={sliderValue}
						onChange={(e) => {
							handleInputChange(e, true);
						}}
					/>
					<h2>:</h2>
					<NumberInput
						label=""
						color={colors.loseRed}
						aria-label="number input"
						value={rightWins}
						onChange={(e) => {
							handleInputChange(e, false);
						}}
					/>
				</>
			</div>
			<div className="submit-button">
				{displayQuizResults ? (
					<button
						type="button"
						onClick={(_e) => dispatch({ type: "resetQuizSubmitDisplay" })}
					>
						New
					</button>
				) : (
					<button
						type="button"
						onClick={(_e) => {
							// setLeftWinsGuess is only used for the lerping here
							// the main_reducer is able to read the users guess from the leftover winsDisplay value
							// which never gets updated during the animation
							setLeftWinsGuess(leftWins);
							dispatch(submitGuessClick());
						}}
					>
						submit
					</button>
				)}
			</div>
		</>
	);
};

export default MatchupSlider;

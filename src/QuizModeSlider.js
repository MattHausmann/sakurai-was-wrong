// MatchupSlider.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NumberInput from "./NumberInput";
import "./QuizModeSlider.css";
import { colors } from "./colors";

const isValid = (num) => {
	return num.length > 0 && !isNaN(num) && !num.startsWith("-");
};

const MatchupSlider = () => {
	const { displayQuizResults, winsDisplay } = useSelector((state) => state);
	const dispatch = useDispatch();

	const [sliderValue, setSliderValue] = useState(winsDisplay[0]);
	const [leftWins, setLeftWins] = useState(winsDisplay[0]);
	const [rightWins, setRightWins] = useState(winsDisplay[1]);

	useEffect(() => {
		setLeftWins(winsDisplay[0]);
		setRightWins(winsDisplay[1]);
		setSliderValue(winsDisplay[0]);
	}, [winsDisplay]);

	useEffect(() => {
		const percentage = (leftWins / (leftWins + rightWins)) * 100;
		document.querySelector(
			".slider"
		).style.background = `linear-gradient(to right, #87b38d ${percentage}%, #cc76a1 ${percentage}%)`;
	}, [leftWins, rightWins]);

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
			<div className="matchup-slider">
				<input
					className="slider"
					type="range"
					min="0"
					max={leftWins + rightWins}
					value={sliderValue}
					step="1"
					onChange={(e) => {
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
							dispatch({ type: "submitGuess" });
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

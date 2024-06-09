import React, { useState, useRef } from "react";
import {getTotalGames, getTotalMatchups, fromMinimumGamesToTotalMatchups, matchupsPerCharacter, winnerWinPercentList} from "./MatchupNavigator.js";
import { useSelector, useDispatch } from "react-redux";

let sortedKeys = Object.keys(fromMinimumGamesToTotalMatchups).map(Number).sort((a,b) => a-b);


function MatchupSlider() {
	const dispatch = useDispatch();
	const {idx, minimumGames, videogameIds, requiredLeft} = useSelector((state) => state.main);
	const [sliderValue, setSliderValue] = useState(minimumGames);
	const [confirming, setConfirming] = useState(false);

	const list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	const matchup = list[idx];
	const dialogRef = useRef();
	const confirmRef = useRef();
	const cannotChangeRef = useRef();

	const getMaxIndex = (matchup) => {
		let totalGames = getTotalGames(matchup);
		let idx = sortedKeys.length - 1;
		while(sortedKeys[idx] > totalGames) {
			idx--;
		}
		return idx;
	}

	const handleSliderTick = (newIndex) => {
		let maximumMinimum = getTotalGames(matchup);
		if(newIndex >= sortedKeys.length) {
			return;
		}
		const newMinimumGames = sortedKeys[newIndex];
		if(newMinimumGames > getTotalGames(matchup)) {
			confirmRef.current.show();
			setConfirming(true);
		}
		if(newMinimumGames <= maximumMinimum) {
			setSliderValue(newIndex);
			dispatch({type:"setMinimumGames", val:newMinimumGames});
		}
	};

	const handleChange = (event) => {
		const newIndex = parseInt(event.target.value, 10);
		setSliderValue(newIndex);
		let newMinimumGames=sortedKeys[newIndex];
		dispatch({type:"setMinimumGames", val:newMinimumGames});
	}

	const handleOnMouseUp = () => {
		let newMinimumGames=sortedKeys[sliderValue];
		let maximumMinimum = getTotalGames(matchup);
		if(!getTotalMatchups(newMinimumGames, videogameIds, requiredLeft)) {
			cannotChangeRef.current.showModal();
			return;
		}

		if(newMinimumGames > maximumMinimum) {
			confirmRef.current.show();
			setConfirming(true);
		}
	};

	const dialogOnClick = () => {
		let newIndex = getMaxIndex(matchup);
		let minGames = sortedKeys[newIndex];
		setSliderValue(newIndex);
		dispatch({ type: "setMinimumGames", val: minGames });
		confirmRef.current.close();
		setConfirming(false);
	};

	return (
		<div className="slider-container">
			<span>Minimum games: {minimumGames}</span><br /> <br />
			<div className="matchup-slider">
				<button onClick={(_e) => {
					handleSliderTick(sliderValue - 1);
				}}>-</button>
				<input
					type="range"
					min="0"
					max={sortedKeys.length - 1}
					onChange={!confirming?handleChange:null}
					value={sliderValue}
					onMouseUp={handleOnMouseUp}
				/>
				<button onClick={(_e) => {
					handleSliderTick(sliderValue + 1);
				}}>+</button> <br />
			</div>
			<dialog ref={dialogRef}>
				<button onClick={()=>{
					let closing = sliderValue <= getTotalGames(matchup);
					if(closing) {
						dialogRef.current.close();
					} else {
						confirmRef.current.show();
					}
				}}>
					<i className="fa fa-close"></i>
				</button>
			</dialog>
			<dialog ref={confirmRef}>
				<span>The current matchup is beneath the threshold; this will set a new matchup.</span>
				<span>Are you sure?</span>
				<button onClick={()=>{
					dispatch({type:"forceMinimumGames",val:sortedKeys[sliderValue]});
					confirmRef.current.close();
					setConfirming(false);
				}}>Yes</button>
				<button onClick={dialogOnClick}>No</button>
			</dialog>
			<dialog ref={cannotChangeRef}>
				<span>There are no matchups meeting the selected criteria</span>
				<button onClick={dialogOnClick}>OK</button>
			</dialog>
		</div>
	);
}

export default MatchupSlider;

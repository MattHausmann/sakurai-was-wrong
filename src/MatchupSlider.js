import React, { useState, useEffect } from 'react';
import { getTotalGames, fromMinimumGamesToTotalMatchups } from './MatchupNavigator.js';
import { useSelector, useDispatch } from 'react-redux';

let sortedKeys = Object.keys(fromMinimumGamesToTotalMatchups).map(Number).sort((a,b) => a-b);



function MatchupSlider({value}) {
	const dispatch = useDispatch();
	const {matchup, minimumGames} = useSelector((state) => state);
	const [sliderValue, setSliderValue] = useState(value);
	
	const getMaxIndex = (matchup) => {
		let totalGames = getTotalGames(matchup);
		let idx = sortedKeys.length - 1;
		
		while(sortedKeys[idx] > totalGames) {
			idx--;
		}
		return idx;
	}

	const handleIncrement = () => {
		let newIndex = sliderValue + 1;
		let maximumMinimum = getTotalGames(matchup);
		if(newIndex >= sortedKeys.length) {
			return;
		}
		const newMinimumGames = sortedKeys[newIndex];
		if(newMinimumGames > getTotalGames(matchup)) {
			return;
		}
		const newTotalMatchups = fromMinimumGamesToTotalMatchups[newMinimumGames];
		if(newMinimumGames <= maximumMinimum) {
			setSliderValue(newIndex);
			dispatch({type:"setMinimumGames", val:newMinimumGames});
		}
	};

	const handleDecrement = () => {
		let newIndex = sliderValue - 1;
		let maximumMinimum = getTotalGames(matchup);
		if(newIndex >= sortedKeys.length) {
			return;
		}
		const newMinimumGames = sortedKeys[newIndex];
		if(newMinimumGames > getTotalGames(matchup)) {
			return;
		}
		const newTotalMatchups = fromMinimumGamesToTotalMatchups[newMinimumGames];
		if(newMinimumGames <= maximumMinimum) {
			setSliderValue(newIndex);
			dispatch({type:"setMinimumGames", val:newMinimumGames});
		}
	};
  
	const handleChange = (event) => {
		let maximumMinimum = getTotalGames(matchup);
		const newIndex = parseInt(event.target.value, 10);
		const newMinimumGames = sortedKeys[newIndex];
		const newTotalMatchups = fromMinimumGamesToTotalMatchups[newMinimumGames];
		if(newMinimumGames <= maximumMinimum) {
			setSliderValue(newIndex);
			dispatch({type:"setMinimumGames", val:newMinimumGames});
		}
		if(newMinimumGames > maximumMinimum) {
			setSliderValue(getMaxIndex(matchup));
			dispatch({type:"setMinimumGames", val:maximumMinimum});
		}
	}


	return (
		<div className="slider-container">
			<span>Minimum games: {minimumGames}</span><br /> <br />
			<div className="slider">
				<button onClick={handleDecrement}>-</button>
				<input 
					type="range" 
					min="0" 
					max={sortedKeys.length - 1}
					onChange={handleChange}
					value={sliderValue} 
				/>
				<button onClick={handleIncrement}>+</button> <br />
			</div>
		</div>
	);
}

export default MatchupSlider;

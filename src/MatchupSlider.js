import React, { useState, useEffect, useRef } from 'react';
import { getTotalGames, fromMinimumGamesToTotalMatchups } from './MatchupNavigator.js';
import { useSelector, useDispatch } from 'react-redux';

let sortedKeys = Object.keys(fromMinimumGamesToTotalMatchups).map(Number).sort((a,b) => a-b);



function MatchupSlider({value}) {
	const dispatch = useDispatch();
	const {matchup, minimumGames} = useSelector((state) => state);
	const [sliderValue, setSliderValue] = useState(value);
	
	const [confirming, setConfirming] = useState(false);
	
	const dialogRef = useRef();
	const confirmRef = useRef();
	
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
		const newIndex = parseInt(event.target.value, 10);
		let newMinimumGames=sortedKeys[sliderValue];
		setSliderValue(newIndex);
		dispatch({type:"setMinimumGames", val:newMinimumGames});
	}
	
	const handleOnMouseUp = (event) => {
		let newMinimumGames=sortedKeys[sliderValue];
		let maximumMinimum = getTotalGames(matchup);
		
		if(newMinimumGames > maximumMinimum) {
			confirmRef.current.show();
			setConfirming(true);
		}

	}


	return (
		<div className="slider-container">
			<span>Minimum games: {minimumGames}</span><br /> <br />
			<div className="matchup-slider">
				<button onClick={handleDecrement}>-</button>
				<input 
					type="range" 
					min="0" 
					max={sortedKeys.length - 1}
					onChange={!confirming?handleChange:null}
					value={sliderValue} 
					onMouseUp={handleOnMouseUp}
				/>
				<button onClick={handleIncrement}>+</button> <br />
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
				<button onClick={()=>{
					setSliderValue(getMaxIndex(matchup));
					confirmRef.current.close();
					setConfirming(false);
				}}>No</button>
			</dialog>
		</div>
	);
}

export default MatchupSlider;
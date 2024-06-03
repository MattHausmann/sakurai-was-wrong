// GameSelect.js
import React, { useState, useRef } from "react";
import GameButton from "./GameButton"; // Import the GameButton component
import { useDispatch, useSelector } from 'react-redux';
import { getTotalMatchups } from './MatchupNavigator';

const GameSelect = ({ games }) => {	

	const {matchup, minimumGames, videogameIds} = useSelector((state) => state);
	const dispatch = useDispatch();
	const dialogRef = useRef();
	const cannotChangeRef = useRef();
	const [confirming, setConfirming] = useState(false);
	let clicked = "";
	
	const getImageUrl = (gameId) => {
		return "/characters/" + gameId + (videogameIds.includes(gameId)?"/selected":"/unselected")+".png";
	};
	
	
	const toggleGameSelected = (videogameId, dialogRef) => {
		dispatch({type:"toggleGameSelected", val:videogameId});
	}
	

	return (
		<div className="game-select">
			{games.map((game) => (
				<button
					gameId={game.id}
					gameName={game.name}
					isSelected={videogameIds.includes(game.id)}
					text={game.id}
					onClick={()=> {
						let matchingGameId = matchup.videogameId == game.id;
						let videogameIdInList = videogameIds.includes(game.id);
						let longerList = videogameIds.length > 1;
						if(longerList && videogameIds.includes(game.id)) {
							console.log("hi");
							let newVideogameIds = [...videogameIds].filter(e=>e!=game.id);
							if(!getTotalMatchups(minimumGames, newVideogameIds)) {
								cannotChangeRef.current.showModal();
								return;
							}
						} 
						clicked = game.id;
						if(matchingGameId&&videogameIdInList&&longerList) {
							dialogRef.current.showModal();
						} else if(videogameIds.length==0&&game.id!=matchup.videogameId) {
							dialogRef.current.showModal();
						} else {
							dispatch({type:"toggleGameSelected",val:game.id})
						}						
					}}
				>
					<img src={getImageUrl(game.id)} />
				</button>
			))}
			<dialog ref={dialogRef}>
				<span>You are trying to deselect the current matchup's game.</span>
				<span>This will cause the displayed matchup to change.</span>
				<span>Are you sure?</span>
				<button onClick={()=>{
					dispatch({type:"forceToggleGameSelected",val:clicked});
					dialogRef.current.close();
				setConfirming(false);}}>
				Yes
				</button>
				<button onClick={()=>{
					dialogRef.current.close();
					setConfirming(false);
				}}>No</button>
			</dialog>
			<dialog ref={cannotChangeRef}>
				<span>There are no matchups meeting the selected criteria</span>
				<button onClick={()=>{
					cannotChangeRef.current.close();
					setConfirming(false);
				}}>OK</button>
				
			</dialog>

		</div>
	);
};

export default GameSelect;

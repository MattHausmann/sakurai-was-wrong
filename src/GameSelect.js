// GameSelect.js
import React, { useRef } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { getTotalMatchups, matchupsPerCharacter, winnerWinPercentList } from './MatchupNavigator';

const GameSelect = ({ games }) => {

	const {idx, minimumGames, videogameIds, requiredLeft} = useSelector((state) => state.main);
	let list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let matchup = list[idx];
	
	const dispatch = useDispatch();
	const dialogRef = useRef();
	const cannotChangeRef = useRef();
	let clicked = "";

	const getImageUrl = (gameId) => {
		return "/characters/" + gameId + (videogameIds.includes(gameId)?"/selected":"/unselected")+".png";
	};


	return (
		<div className="game-select">
			{games.map((game) => (
				<button
					className={videogameIds.includes(game.id) ? "enabled" : ""}
					key={game.id}
					data-gameid={game.id}
					data-gamename={game.name}
					text={game.id}
					onClick={()=> {
						let matchingGameId = matchup.videogameId === game.id;
						let videogameIdInList = videogameIds.includes(game.id);
						let longerList = videogameIds.length > 1;
						if(longerList && videogameIds.includes(game.id)) {
							let newVideogameIds = [...videogameIds].filter(e=>e!==game.id);
							if(!getTotalMatchups(minimumGames, newVideogameIds, requiredLeft)) {
								cannotChangeRef.current.showModal();
								return;
							}
						}
						clicked = game.id;
						if(matchingGameId&&videogameIdInList&&longerList) {
							dialogRef.current.showModal();
						} else if(videogameIds.length===0&&game.id!==matchup.videogameId) {
							dialogRef.current.showModal();
						} else {
							dispatch({type:"toggleGameSelected",val:game.id})
						}
					}}
				>
					<img src={getImageUrl(game.id)} alt={game.name}/>
				</button>
			))}
			<dialog ref={dialogRef}>
				<span>You are trying to deselect the current matchup's game.</span>
				<span>This will cause the displayed matchup to change.</span>
				<span>Are you sure?</span>
				<button onClick={()=>{
					dispatch({type:"forceToggleGameSelected",val:clicked});
					dialogRef.current.close();
				}}>
				Yes
				</button>
				<button onClick={()=>{
					dialogRef.current.close();
				}}>No</button>
			</dialog>
			<dialog ref={cannotChangeRef}>
				<span>There are no matchups meeting the selected criteria</span>
				<button onClick={()=>{
					cannotChangeRef.current.close();
				}}>OK</button>

			</dialog>

		</div>
	);
};

export default GameSelect;

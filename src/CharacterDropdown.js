import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { matchupsPerCharacter, getTotalGames } from  './MatchupNavigator';
import './CharacterDropdown.css';


const CharacterDropdown = ({side}) => {
	const { matchup, minimumGames, videogameIds } = useSelector((state) => state);
	
	let [dropdownOpen, setDropdownOpen] = useState(false);
	
	let selected = side=="left"?matchup.left:matchup.right;
	let other = side=="left"?matchup.right:matchup.left;
	
	let dropdownId = side+"CustomDropdown";
	let dispatch = useDispatch();
	
	const compareMatchups = (a, b) => {
		if(a.videogameId == b.videogameId) {
			return a.right.localeCompare(b.right);
		}
		if(videogameIds.length == 1) {
			let targetVideogameId = videogameIds[0];
			if(a.videogameId != b.videogameId) {
				if(a.videogameId == targetVideogameId) {
					return -1;
				}
				return 1;
			}
		}
		return a.right.localeCompare(b.right);
	}	
	let matchupsPerOtherCharacter = [...matchupsPerCharacter[other]].sort(compareMatchups);
	
	useEffect(()=>{
		const handleClick = (event) => {
			const dropdownMenu = document.getElementById(dropdownId);
			if(dropdownMenu && !dropdownMenu.contains(event.target)) {
				setDropdownOpen(false);
			}
		};
		document.addEventListener('click', handleClick);
		return () => {
			document.removeEventListener('click', handleClick);
		};
	});
	

	
	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	}
	
	const setMatchup = (m) => {
		dispatch({type:"setMatchup", matchup:m});
		setDropdownOpen(false);
	}
	
	for(let otherMatchup of matchupsPerOtherCharacter) {
		let enoughGames = getTotalGames(otherMatchup) >= minimumGames;
		let correctVideogameId = videogameIds.length == 0;
		correctVideogameId = correctVideogameId || videogameIds.includes(""+otherMatchup.videogameId);
		
	}
	
	
	
	return (
			<div className="dropdown" id={dropdownId}>
				<div className="dropdown-toggle" id="dropdownToggle" onClick={toggleDropdown}>
					<img className="selection-game" src={"characters/"+matchup.videogameId+"/logo.png"} />
					<span className="selection-char">{selected}<i className="fa-solid fa-triangle" /></span>
				</div>
				<div className={`dropdown-menu ${dropdownOpen?'show':''}`} id="dropdownMenu" >
					{matchupsPerOtherCharacter.map((m) => (
						<div className="dropdown-item" onClick={() => setMatchup(m)}>
							<img className="selection-game" src={"characters/"+m.videogameId+"/logo.png"} />
							<span>{m.right}</span>
						</div>))
					}
				</div>
			</div>
	);
};

export default CharacterDropdown;
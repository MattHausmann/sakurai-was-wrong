// Matchup.js
import React, { useState, useEffect } from 'react';
import LabeledCharacterPortrait from './CharacterPortrait';
import MatchupSlider from './MatchupSlider';
import Navigation from './Navigation';
import wins from './wins.json';

function compareByWinnerWinPercent(a, b) {
	let aWins = wins[a[0]][a[1]][a[2]];
	let aLoses = wins[a[0]][a[2]][a[1]];
	
	if(aLoses > aWins) {
		let tmp = aLoses;
		aLoses = aWins;
		aWins = tmp;
	}
	
	let bWins = wins[b[0]][b[1]][b[2]];
	let bLoses = wins[b[0]][b[2]][b[1]];
	if(bLoses > bWins) {
		let tmp = bLoses;
		bLoses = bWins;
		bWins = tmp;
	}
	let winPercentDiff = aWins*bLoses - bWins*aLoses; 
	if(winPercentDiff == 0) {
		return aWins - bWins;
	}
	return winPercentDiff;
}

function compareByLeftWinPercent(a, b) {
	let aLeft = wins[a[0]][a[1]][a[2]];
	let aRight = wins[a[0]][a[2]][a[1]];
	let bLeft = wins[b[0]][b[1]][b[2]];
	let bRight = wins[b[0]][b[2]][b[1]];
	let leftWinPercentDifference = (aLeft*bRight)-(bLeft*aRight);
	if(leftWinPercentDifference == 0) {
		return aLeft+aRight-bLeft-bRight;
	}
	return leftWinPercentDifference;
}


function compareByTotalMatches(a, b) {
	return wins[a[0]][a[1]][a[2]]+wins[a[0]][a[2]][a[1]]-wins[b[0]][b[1]][b[2]]-wins[b[0]][b[2]][b[1]];
}

const labeledComparators = {"Total Matches":compareByTotalMatches, "Left Win%":compareByLeftWinPercent};


const unsortedMatchupsOneSide = {};
const unsortedMatchupsBothSides = {};

//first get all matchups; assume that every character has won one game in the dataset
for(let videogameId of [1,1386]) {
	let allCharacterNames = new Set();
	for(let winner in wins[videogameId]) {
		allCharacterNames.add(winner);
	}
	
	let characters = [...allCharacterNames];

	
	unsortedMatchupsOneSide[videogameId] = [];
	unsortedMatchupsBothSides[videogameId] = []

	for (let i = 0; i < characters.length; i++) {
		for (let j = i + 1; j < characters.length; j++) {
			const matchup = [videogameId, characters[i], characters[j]];
			unsortedMatchupsOneSide[videogameId].push(matchup);
			unsortedMatchupsBothSides[videogameId].push(matchup);
		}
	}
	
	for(let matchup of unsortedMatchupsOneSide[videogameId]) {
		unsortedMatchupsBothSides[matchup[0]].push([matchup[0],matchup[2],matchup[1]]);
	}
	console.log(unsortedMatchupsOneSide);
	console.log(unsortedMatchupsBothSides);
}



const MatchupNavigator = ({videogameId, leftCharacter, rightCharacter, sortMethod}) => {
	return (
	        <div class="matchup-navigator">

				<div class="left-buttons">
					<button disabled>First</button>
					<button disabled>Previous</button>
				</div>


				<div>
					<select>
						<option value="Total Games">Total Games</option>

					</select>
				</div>
				<div>
					<button>Next</button>
					<button>Last</button>
				</div>
			</div>
	);		
};

export default MatchupNavigator;
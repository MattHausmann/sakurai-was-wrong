// Matchup.js
import React, { useState, useEffect } from 'react';
import LabeledCharacterPortrait from './CharacterPortrait';
import MatchupSlider from './MatchupSlider';
import wins from './wins.json';

const possibleMatchups = {}
const MATCHUP_THRESHOLD = 200;



for (let videogameId of [1, 1386]) {
  possibleMatchups[videogameId] = {};
  for (let winner in wins[videogameId]) {
    possibleMatchups[videogameId][winner] = [];
    for (let loser in wins[videogameId][winner]) {
      var matches = wins[videogameId][winner][loser];
      if (loser in wins[videogameId]) {
        if (winner in wins[videogameId][loser]) {
          matches += wins[videogameId][loser][winner];
        }
      }
      //push matchup if it has at least 200 matches
      //doing list contains idk maybe should be sets
      //whole function takes ~20ms on my ancient laptop so it's fine
      if (matches >= MATCHUP_THRESHOLD && winner != loser) {
        let alphabeticallyFirst = winner > loser ? loser : winner;
        let alphabeticallyLast = winner > loser ? winner : loser;
        if (!(alphabeticallyFirst in possibleMatchups[videogameId])) {
          possibleMatchups[videogameId][alphabeticallyFirst] = [];
        }
        if (
          !possibleMatchups[videogameId][alphabeticallyFirst].includes(
            alphabeticallyLast
          )
        ) {
          possibleMatchups[videogameId][alphabeticallyFirst].push(
            alphabeticallyLast
          );
        }
      }
    }
  }

  //now clean up
  for (let alphabeticallyFirst in possibleMatchups[videogameId]) {
    if (possibleMatchups[videogameId][alphabeticallyFirst].length == 0) {
      delete possibleMatchups[videogameId][alphabeticallyFirst];
    }
  }
}


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


function randomMatchupNames(videogameId, oldFirst, oldLast) {
  let rolling = true;
  let firsts = {};
  let randomFirst = "";
  let lasts = {};
  let randomLast = "";
  while (rolling) {
    firsts = Object.keys(possibleMatchups[videogameId]);
    randomFirst = firsts[Math.floor(Math.random() * firsts.length)];
    lasts = possibleMatchups[videogameId][randomFirst];
    randomLast = lasts[Math.floor(Math.random() * lasts.length)];
    rolling = randomFirst == oldFirst && randomLast == oldLast;
    rolling = rolling || (randomFirst == oldLast && randomLast == oldFirst);
  }
  if (Math.random() < 0.5) {
    return [randomLast, randomFirst];
  }
  return [randomFirst, randomLast];
}


const MatchupNavigator = ({videogameId, leftCharacter, rightCharacter, sortMethod}) => {
	
	const[leftCharacterName, setLeftCharacterName] = useState(leftCharacter);
	const[rightCharacterName, setRightCharacterName] = useState(rightCharacter);
	

	const newRandomMatchup = ( videogameId, leftChar, rightChar ) => {
		let [left, right] = randomMatchupNames(videogameId, leftChar, rightChar);
		setLeftCharacterName(left);
		setRightCharacterName(right);
	};

	if(!leftCharacterName || !rightCharacterName) {
		newRandomMatchup(videogameId, leftCharacterName, rightCharacterName);
	}
	
	console.log(leftCharacterName);
	console.log(rightCharacterName);
	
	
	return (
	        <div className="matchup-navigator">
				<div className="navigator-top-row">				
					<div className="left-buttons">
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
				<div className="navigator-bottom-row">
					<button onClick={() => { newRandomMatchup(videogameId, leftCharacter, rightCharacter);}}>						
						New
					</button>
				</div>
			</div>
	);		
};

export default MatchupNavigator;
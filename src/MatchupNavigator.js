import React from "react";
import { useSelector, useDispatch } from "react-redux";
import wins from "./wins.json";

const unsortedMatchupList = [];
const matchupsPerCharacter = {};
for (let videogameId of [1, 1386]) {
	for (let winner in wins[videogameId]) {
		for (let loser in wins[videogameId][winner]) {
			if(!(winner in matchupsPerCharacter)) {
				matchupsPerCharacter[winner] = [];
			}
			if(!(loser in matchupsPerCharacter)) {
				matchupsPerCharacter[loser] = [];
			}
			let matchup = {
				videogameId: videogameId,
				left: winner,
				right: loser,
			};
			
			matchupsPerCharacter[winner].push(matchup);
			
			let matchupWins = getWins(matchup);
			//winner on left, even matchups in alphabetical order			
			if(matchupWins[0] > matchupWins[1] || 
				(
					matchupWins[0]==matchupWins[1]
					&& matchup.right.localeCompare(matchup.left) > 0
				)
			) {
				unsortedMatchupList.push(matchup);
			}
		}
	}
}

const defaultCompareMatchups = (a, b) => {
	let leftCompare = a.left.localeCompare(b.left)
	if(!leftCompare) {
		let rightCompare = a.right.localeCompare(b.right);
		if(!rightCompare) {
			return a.videogameId -b.videogameId;
		}
		return rightCompare;
	}
	return leftCompare;
}

export function getWins(matchup) {
	let {videogameId, left, right} = matchup;
	let leftWins = 0;
	let rightWins = 0;
	if (videogameId in wins) {
		if (left in wins[videogameId]) {
			if (right in wins[videogameId][left]) {
				leftWins = wins[videogameId][left][right];
			} else {
				leftWins = 0;
			}
		} else {
			leftWins = 0;
		}
		if (right in wins[videogameId]) {
			if (left in wins[videogameId][right]) {
				rightWins = wins[videogameId][right][left];
			} else {
				rightWins = 0;
			}
		} else {
			rightWins = 0;
		}
		return [leftWins, rightWins];
	}
}

const getWinnerWins = (matchup) => {
	let [leftWins, rightWins] = getWins(matchup);
	return Math.max(leftWins, rightWins);
};

const getLoserWins = (matchup) => {
	let [leftWins, rightWins] = getWins(matchup);
	return Math.min(leftWins, rightWins);
};



const getTotalGames = (matchup) => {
	let leftWins = wins[matchup.videogameId][matchup.left][matchup.right];
	let rightWins = wins[matchup.videogameId][matchup.right][matchup.left];

	return leftWins + rightWins;
};

const compareByTotalGames = (a, b) => {
	let gamesCompare = getTotalGames(a) - getTotalGames(b);
	return gamesCompare?gamesCompare:defaultCompareMatchups(a,b);
};

const compareByLeftWinPercent = (a, b) => {
	const[aLeftWins,aRightWins] = getWins(a);
	const[bLeftWins,bRightWins] = getWins(b);
	let leftWinPctDifference = aLeftWins * bRightWins - bLeftWins * aRightWins;
	return leftWinPctDifference?-leftWinPctDifference:
		aLeftWins-bLeftWins?bLeftWins-aLeftWins:
		defaultCompareMatchups(a,b);
};

const compareByWinnerWinPercent = (a, b) => {
	let aWinnerWins = getWinnerWins(a);
	let aLoserWins = getLoserWins(a);
	let bWinnerWins = getWinnerWins(b);
	let bLoserWins = getLoserWins(b);
	//awins/aloses > bwins/bloses but with cross-multiplication
	let winnerWinPctDifference = aWinnerWins * bLoserWins - bWinnerWins * aLoserWins;
	if (winnerWinPctDifference === 0) {
		return aWinnerWins - bWinnerWins;
	}
  return -winnerWinPctDifference;
};
const compareByLoserWinPercent = (a, b) => {
  let aWinnerWins = getWinnerWins(a);
  let aLoserWins = getLoserWins(a);
  let bWinnerWins = getWinnerWins(b);
  let bLoserWins = getLoserWins(b);
  //aLoses/aWins > bLoses/bWins but with cross-multiplication
  let loserWinPctDifference =
    bWinnerWins * aLoserWins - aWinnerWins * bLoserWins;
  if (loserWinPctDifference === 0) {
    return aLoserWins - bLoserWins;
  }
  return loserWinPctDifference;
};

const firstMatchupAtOrAboveThreshold = function (threshold) {
	let listName = "Total Games";
	let totalGamesList = sortedMatchupLists[listName];

	let b = 0;
	let e = totalGamesList.length - 1;

	while (b < e) {
		let m = Math.floor((b + e) / 2);
		let totalGames = getTotalGames(totalGamesList[m]);
		if (totalGames < threshold) {
			if (b + 1 === e) {
				return seekFirstMatchupAtThreshold(totalGamesList, e);
			}
			b = m;
		}
		if (threshold < totalGames) {
			if (b + 1 === e) {
				return seekFirstMatchupAtThreshold(totalGamesList, e);
			}
			e = m;
		}
		if (threshold === totalGames) {
			return seekFirstMatchupAtThreshold(totalGamesList, m);
		}
	}
};

const seekFirstMatchupAtThreshold = function (list, index) {
	let goalGames = getTotalGames(list[index]);
	while (index >= 0 && getTotalGames(list[index]) === goalGames) {
		index -= 1;
	}
	return list[index + 1];
};

const binarySearchListForObjectWithComparator = function (list,goal,comparator) {
  let m = Math.floor(list.length / 2);
  let b = 0;
  let e = list.length - 1;
  

  while (comparator(goal, list[m])) {
	let cmp = comparator(goal, list[m]);
    if (cmp > 0) {
		if(b != m) {
			b = m;
		}
		else {
			b += 1;
		}
    }
    if (cmp < 0) {
		if(e != m) {
			e = m;
		} else {
			e -= 1;
		}
    }
    m = Math.floor((b + e) / 2);
  }
  return m;
};

const labeledComparators = {
  "Left Win %": compareByLeftWinPercent,
  "Lopsidedness": compareByWinnerWinPercent,
  "Total Games": compareByTotalGames,
  "Balance": compareByLoserWinPercent,
};

let sortedMatchupLists = {};
for (let sortBy in labeledComparators) {
  sortedMatchupLists[sortBy] = [...unsortedMatchupList].sort(
    labeledComparators[sortBy]
  );
}


export function first(args) {
	let {matchup, orderBy, minimumGames, requiredLeft, requiredRight} = args;
  let currentList = sortedMatchupLists[orderBy];
  let i = -1;

  let enoughGames = false;
  let leftOkay = !requiredLeft;
  let rightOkay = !requiredRight;

  while (i < currentList.length && (!enoughGames || !leftOkay || !rightOkay)) {
    i += 1;
    let matchup = currentList[i];
    enoughGames = getTotalGames(matchup) >= minimumGames;
    leftOkay = !requiredLeft || requiredLeft === matchup.left;
    rightOkay = !requiredRight || requiredRight === matchup.right;
  }

  return currentList[i];
};

export function last(args) {
	let {matchup, orderBy, minimumGames, requiredLeft, requiredRight} = args;
	let currentList = sortedMatchupLists[orderBy];
	let i = currentList.length;

	let enoughGames = false;
	let leftOkay = !requiredLeft;
	let rightOkay = !requiredRight;

	while (i > 0 && (!enoughGames || !leftOkay || !rightOkay)) {
		i -= 1;
		let matchup = currentList[i];
		enoughGames = getTotalGames(matchup) >= minimumGames;
		leftOkay = !requiredLeft || requiredLeft === matchup.left;
		rightOkay = !requiredRight || requiredRight === matchup.right;
	}

	return currentList[i];
};

export function prev(args) {
	let {matchup, orderBy, minimumGames, requiredLeft, requiredRight} = args;
	
	let list = sortedMatchupLists[orderBy];
	let cmp = labeledComparators[orderBy];
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, cmp);
	let targetPrev = currentIndex;

	let enoughGames = false;
	let leftOkay = !requiredLeft;
	let rightOkay = !requiredRight;

	while (targetPrev > 0 && (!enoughGames || !leftOkay || !rightOkay)) {
		targetPrev -= 1;
		let matchup = list[targetPrev];
		enoughGames = getTotalGames(matchup) >= minimumGames;
		leftOkay = !requiredLeft || requiredLeft === matchup.left;
		rightOkay = !requiredRight || requiredRight === matchup.right;
	}
	if(enoughGames && leftOkay && rightOkay) {
		return list[targetPrev];
	}
	return undefined;
	
};

export function next(args) {
	let {matchup, orderBy, minimumGames, requiredLeft, requiredRight} = args;
	
	let list = sortedMatchupLists[orderBy];
	let cmp = labeledComparators[orderBy];
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, cmp);
	let targetNext = currentIndex;

	let enoughGames = false;
	let leftOkay = !requiredLeft;
	let rightOkay = !requiredRight;

	while (targetNext < list.length-1 && (!enoughGames || !leftOkay || !rightOkay)) {
		targetNext += 1;
		let matchup = list[targetNext];
		enoughGames = getTotalGames(matchup) >= minimumGames;
		leftOkay = !requiredLeft || requiredLeft === matchup.left;
		rightOkay = !requiredRight || requiredRight === matchup.right;
	}
	if(enoughGames && leftOkay && rightOkay) {
		return list[targetNext];
	}
	return undefined;	
};




export function randomMatchup(state) {
	const matchup0 = firstMatchupAtOrAboveThreshold(state.minimumGames);
	const sort = "Total Games";
	const list = sortedMatchupLists[sort];
	const comp = labeledComparators[sort];
	const index0 = binarySearchListForObjectWithComparator(list, matchup0, comp);
	const numMatchups = list.length - index0;
	const newIndex = index0 + Math.floor(Math.random() * numMatchups);
	return list[newIndex];
};

function leftButtonsVisible(args) {
	return !!prev(args);
}

function rightButtonsVisible(args) {
	return !!next(args);
}

export function MatchupNavigator() {
	const dispatch = useDispatch();
	const {matchup, orderBy, minimumGames, requiredLeft, requiredRight}=useSelector((state)=>state);
	let options = {matchup, orderBy, minimumGames, requiredLeft, requiredRight};
	
	let args = {matchup, orderBy, minimumGames, requiredLeft, requiredRight};
	

	return (
		<div class="matchup-navigator">
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:first(args)});}}
				style={{visibility:leftButtonsVisible(options)?'visible':'hidden'}}
			>
				First
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:prev(args)});}}
				style={{visibility:leftButtonsVisible(options)?'visible':'hidden'}}
			>
				Previous
			</button>
			
			<button onClick={() => {dispatch({ type: "setMatchup", matchup:randomMatchup(args)});}}>
				New
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:next(args)});}}
				style={{visibility:rightButtonsVisible(options)?'visible':'hidden'}}
			>
				Next
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:last(args)});}}
				style={{visibility:rightButtonsVisible(options)?'visible':'hidden'}}
			>
				Last
			</button>
		</div>
	);
}
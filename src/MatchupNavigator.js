import React from "react";
import { useSelector, useDispatch } from "react-redux";
import wins from "./wins.json";

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

const firstMatchupAtOrAboveThreshold = function (threshold) {
	let listName = "Total Games";

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

const unreverse = function(matchup) {
	let {videogameId, left, right} = matchup;
	let reverse = {videogameId, left:right, right:left};
	let [leftWins, rightWins] = getWins(matchup);
	if(leftWins - rightWins < 0) {
		return reverse;
	}
	if(leftWins - rightWins == 0) {
		if(left.localeCompare(right) > 0) {
			return reverse;
		}
	}
	return matchup;
}

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



export function first(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = -1;
	let enoughGames = false;
	while (currentIndex <list.length-1 && !enoughGames) {
		currentIndex += 1;
		let matchup = list[currentIndex];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[currentIndex];
	}
	return undefined;	
};


export function last(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = list.length;
	let enoughGames = false;
	while (currentIndex >0 && !enoughGames) {
		currentIndex -= 1;
		let matchup = list[currentIndex];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[currentIndex];
	}
	return undefined;	
};

export function prev(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, compareByLeftWinPercent);
	let targetPrev = currentIndex;
	let enoughGames = false;
	while (targetPrev >0 && !enoughGames) {
		targetPrev -= 1;
		let matchup = list[targetPrev];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[targetPrev];
	}
	return undefined;	
};


export function next(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, compareByLeftWinPercent);
	let targetNext = currentIndex;
	let enoughGames = false;

	while (targetNext < list.length-1 && !enoughGames) {
		targetNext += 1;
		let matchup = list[targetNext];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[targetNext];
	}
	return undefined;	
};




export function randomMatchup(state) {
	let list = totalGamesList
	if(state.lockLeft) {
		list = matchupsPerCharacter[state.matchup.left];
		let newIndex = Math.floor(Math.random() * list.length);
		while(list[newIndex] == state.matchup) {
			newIndex = Math.floor(Math.random() * list.length);			
		}
		return list[newIndex];
	}
	const matchup0 = firstMatchupAtOrAboveThreshold(state.minimumGames);
	const index0 = binarySearchListForObjectWithComparator(list, matchup0, compareByTotalGames);
	const newIndex = index0 + Math.floor(Math.random() * (list.length-index0));
	return totalGamesList[newIndex];
};
function leftButtonsVisible(args) {
	return !!prev(args);
}

function rightButtonsVisible(args) {
	console.log('checking if right button is visible for',args);
	return !!next(args);
}


const oneSidedMatchupListA = [];
const oneSidedMatchupListB = [];
const oneSidedMatchupListC = [];
const twoSidedMatchupList = []
const matchupsPerCharacter = {};

for (let videogameId of [1, 1386]) {
	for (let left in wins[videogameId]) {
		if(!(left in matchupsPerCharacter)) {
			matchupsPerCharacter[left] = []
		}

		for (let right in wins[videogameId][left]) {
			if(left != right) {
				let matchup = {videogameId, left, right};
				twoSidedMatchupList.push(matchup);
				matchupsPerCharacter[left].push(matchup);
				let winnerWins = getWinnerWins(matchup);
				if(wins[videogameId][left][right] == winnerWins) {
					oneSidedMatchupListA.push(matchup);
				}
			}
		}
	}
}

let totalGamesList = [...oneSidedMatchupListA].sort(compareByTotalGames);
let leftPercentList = [...twoSidedMatchupList].sort(compareByLeftWinPercent);
let winnerWinPercentList = [...oneSidedMatchupListA].sort(compareByWinnerWinPercent);

for(let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(compareByLeftWinPercent);
}


export function MatchupNavigator() {
	const dispatch = useDispatch();
	const {matchup, orderBy, minimumGames, lockLeft}=useSelector((state)=>state);

	let args = {matchup, orderBy, minimumGames, lockLeft};
	
	

	return (
		<div class="matchup-navigator">
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:first(args)});}}
				style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
			>
				First
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:prev(args)});}}
				style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
			>
				Previous
			</button>
			
			<button onClick={() => {
				let newMatchup = randomMatchup(args); 
				console.log(newMatchup); 
				dispatch({ type: "setMatchup", matchup:newMatchup});
			}}>
				New
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:next(args)});}}
				style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
			>
				Next
			</button>
			<button 
				onClick={() => {dispatch({ type: "setMatchup", matchup:last(args)});}}
				style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
			>
				Last
			</button>
		</div>
	);
}
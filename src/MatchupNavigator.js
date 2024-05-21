import { useEffect, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import wins from "./wins.json";

const defaultCompareMatchups = (a, b) => {
	//first, alphabetical order then reverse alphabetical order	
	
	let alphabeticalOrderA = a.left.localeCompare(a.right) < 0;
	let alphabeticalOrderB = b.left.localeCompare(b.right) < 0;
	
	if(alphabeticalOrderB & !alphabeticalOrderA) {
		return 1;
	}
	if(alphabeticalOrderA & !alphabeticalOrderB) {
		return -1;
	}
	
	
	let leftCompare = a.left.localeCompare(b.left)
	//if it's in alphabetical order
	if(leftCompare < 0) {		
	}
	if(!leftCompare) {
		let rightCompare = a.right.localeCompare(b.right);
		if (!rightCompare) {
			return a.videogameId - b.videogameId;
		}
		return rightCompare;
	}
	return leftCompare;
};

export function getWins(matchup) {
	let { videogameId, left, right } = matchup;
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
	return gamesCompare ? gamesCompare : defaultCompareMatchups(a, b);
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
	if(isReversed(matchup)) {
		return {videogameId:matchup.videogameId, left:matchup.right, right:matchup.left};
	}
	return matchup;
}

const reverse = function(matchup) {
	if(isReversed(matchup)) {
		return matchup;
	}
	return {videogameId:matchup.videogameId, left:matchup.right, right:matchup.left};
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
	let list = lockLeft?matchupsPerCharacter[matchup.left]:winnerWinPercentList;
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
}

export function last(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:winnerWinPercentList;
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
}

export function prev(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, compareByLeftWinPercent);
	let inc = -1;
	if(!lockLeft && currentIndex > list.length/2) {
		inc = 1;		
	}
	let targetPrev = currentIndex;
	let enoughGames = false;
	while (targetPrev >0 && targetPrev < list.length-1 && !enoughGames) {
		targetPrev += inc;
		let matchup = list[targetPrev];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[targetPrev];
	}
	return undefined;
}

export function next(args) {
	let {matchup, orderBy, minimumGames, lockLeft} = args;
	let list = lockLeft?matchupsPerCharacter[matchup.left]:leftPercentList;
	let currentIndex = binarySearchListForObjectWithComparator(list, matchup, compareByLeftWinPercent);
	let targetNext = currentIndex;
	let enoughGames = false;
	
	let endIndex = lockLeft?list.length-1:Math.floor((list.length-1)/2);
	while (targetNext < endIndex && !enoughGames) {
		targetNext += 1;
		let matchup = list[targetNext];
		enoughGames = getTotalGames(matchup) >= minimumGames;
	}
	if(enoughGames) {
		return list[targetNext];
	}
	return undefined;
}

export function randomMatchup(state) {
	let list = state.lockLeft?matchupsPerCharacter[state.matchup.left]:totalGamesList;
	let enoughGames = false;
	let newState = state.matchup;	
	if(state.lockLeft) {
		list = matchupsPerCharacter[state.matchup.left];
		let newIndex = Math.floor(Math.random() * list.length);
		while(list[newIndex] == state.matchup || !enoughGames) {
			console.log(enoughGames, state.minimumGames);
			newIndex = Math.floor(Math.random() * list.length);			
			enoughGames = getTotalGames(list[newIndex]) >= state.minimumGames;
		}
		return list[newIndex];
	}
	const matchup0 = firstMatchupAtOrAboveThreshold(state.minimumGames);
	const index0 = binarySearchListForObjectWithComparator(list, matchup0, compareByTotalGames);
	const newIndex = index0 + Math.floor(Math.random() * (list.length-index0));
	return totalGamesList[newIndex];
}
function leftButtonsVisible(args) {
	return !!prev(args);
}

function rightButtonsVisible(args) {
	console.log(args);
	return !!next(args);
}

function randomButtonVisible(args) {
	return leftButtonsVisible(args) || rightButtonsVisible(args);
}

function isReversed(matchup) {
	let{videogameId, left, right} = matchup;
	let winsDifference = wins[videogameId][left][right] - wins[videogameId][right][left];
	if(winsDifference) {
		return winsDifference < 0;
	}
	return left.localeCompare(right) > 0;
}


const oneSidedMatchupListA = [];
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
	let {matchup, orderBy, minimumGames, lockLeft}=useSelector((state)=>state);
	
	let args = {matchup, orderBy, minimumGames, lockLeft};
	console.log('making matchupnavigator');
	useEffect(() => {
		if(!lockLeft) {
			dispatch({type:"setMatchup", matchup:unreverse(matchup)});
		}
	}, [lockLeft]);

	

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

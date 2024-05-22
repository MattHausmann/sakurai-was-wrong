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

const getWinnerWinRate = (matchup) => {
	let [leftWins, rightWins] = getWins(matchup);
	let winnerWins = Math.max(leftWins,rightWins);
	return winnerWins/(leftWins+rightWins);
}

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
	let winnerWinRateA = getWinnerWinRate(a);
	let winnerWinRateB = getWinnerWinRate(b);
	let winnerWinRateDifference = winnerWinRateB-winnerWinRateA;
	if(!winnerWinRateDifference) {
		return defaultCompareMatchups(a,b);
	}
	return winnerWinRateDifference;
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

export function unreverse(matchup) {
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


export function firstMatchup(args) {
	let {matchup, minimumGames, lockLeft} = args;
	let idx = 0;

	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		while(idx < list.length) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx += 1;
		}
	} else {
		let list = winnerWinPercentList;
		while(idx < list.length) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx += 1;
		}
	}
}

export function lastMatchup(args) {
	let {matchup, minimumGames, lockLeft} = args;
	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		let idx = list.length - 1;
		while(idx > 0) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx -= 1;
		}
	} else {
		let list = winnerWinPercentList;
		let idx = list.length - 1;
		while(idx >= 0) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx -= 1;
		}
	}
}

function binarySearchListForObjectWithComparator(list, matchup, comparator) {
	let idx = 0;

	while(idx < list.length && !(list[idx].left == matchup.left &&
								list[idx].right == matchup.right &&
								list[idx].videogameId == matchup.videogameId)) {
		idx+=1;
	}
	return idx;
}

export function nextMatchup(args) {
	let {matchup, minimumGames, lockLeft} = args;
	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		let comparator = compareByLeftWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, matchup, comparator);
		while(idx < list.length) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx += 1;
		}
	} else {
		let list = winnerWinPercentList;
		let comparator = compareByWinnerWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, matchup, comparator);
		while(idx < list.length) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx += 1;
		}
	}
}

export function prevMatchup(args) {
	let {matchup, minimumGames, lockLeft} = args;
	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		let comparator = compareByLeftWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, matchup, comparator);
		while(idx >= 0) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx -= 1;
		}
	} else {
		let list = winnerWinPercentList;
		let comparator = compareByWinnerWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, matchup, comparator);
		while(idx >= 0) {
			let newMatchup = list[idx];
			if(matchup != newMatchup && getTotalGames(newMatchup) >= minimumGames) {
				return newMatchup;
			}
			idx -= 1;
		}
	}
}




export function randomMatchup(state) {
	let list = state.lockLeft?matchupsPerCharacter[state.matchup.left]:totalGamesList;
	let enoughGames = false;
	let newState = state.matchup;
	if(state.lockLeft) {
		list = matchupsPerCharacter[state.matchup.left];
		let newIndex = Math.floor(Math.random() * list.length);
		while(list[newIndex] == state.matchup || !enoughGames) {
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
	return !!prevMatchup(args);
}

function rightButtonsVisible(args) {
	return !!nextMatchup(args);
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
			if(left !== right) {
				let matchup = {videogameId, left, right};
				twoSidedMatchupList.push(matchup);
				matchupsPerCharacter[left].push(matchup);
				let winnerWins = getWinnerWins(matchup);
				if(wins[videogameId][left][right] == winnerWins) {
					if(wins[videogameId][right][left] == winnerWins) {
						if(left.localeCompare(right) < 0) {
							oneSidedMatchupListA.push(matchup);
						}
					} else {
						oneSidedMatchupListA.push(matchup);
					}
				}
			}
		}
	}
}

let seenMatchups = JSON.parse(localStorage.getItem('seenMatchups')) ?? {};
let guessedMatchups = localStorage.getItem('guessedMatchups') ?? {};
let bestScorePerMatchup = localStorage.getItem('bestScorePerMatchup') ?? {};

let totalGamesList = [...oneSidedMatchupListA].sort(compareByTotalGames);
let leftPercentList = [...twoSidedMatchupList].sort(compareByLeftWinPercent);
let winnerWinPercentList = [...oneSidedMatchupListA].sort(compareByWinnerWinPercent);


for(let left in matchupsPerCharacter) {
	matchupsPerCharacter[left] = [...matchupsPerCharacter[left]].sort(compareByLeftWinPercent);
}

export function MatchupNavigator() {
	const dispatch = useDispatch();
	let {matchup, minimumGames, lockLeft}=useSelector((state)=>state);

	let args = {matchup, minimumGames, lockLeft};
	let videogameId = matchup.videogameId;

	useEffect(() => {
		if(!lockLeft) {
			dispatch({type:"setMatchup", matchup:matchup});
		}
	}, [dispatch, matchup, lockLeft]);
	
	if(!(matchup.videogameId in seenMatchups)) {
		seenMatchups[videogameId] = {};
	}
	let alphabeticallyFirst = matchup.left.localeCompare(matchup.right) < 0? matchup.left:matchup.right;
	let alphabeticallyLast = alphabeticallyFirst == matchup.left?matchup.right:matchup.left;
	
	if(!(alphabeticallyFirst in seenMatchups[videogameId])) {
		seenMatchups[videogameId][alphabeticallyFirst] = [];
	}
	if(!(seenMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast))) {
		seenMatchups[videogameId][alphabeticallyFirst].push(alphabeticallyLast);
	}

	localStorage.setItem('seenMatchups', JSON.stringify(seenMatchups));
	
	return (
		<div class="matchup-navigator">
			<button
				disabled={!firstMatchup(args)}
				onClick={() => {dispatch({ type: "setMatchup", matchup:firstMatchup(args)});}}
				style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
			>
				First
			</button>
			<button
				disabled={!prevMatchup(args)}
				onClick={() => {dispatch({ type: "setMatchup", matchup:prevMatchup(args)});}}
				style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
			>
				Previous
			</button>

			<button onClick={() => {
				let newMatchup = randomMatchup(args);
				dispatch({ type: "setMatchup", matchup:newMatchup});
			}}>
				New
			</button>
			<button
				disabled={!nextMatchup(args)}
				onClick={() => {dispatch({ type: "setMatchup", matchup:nextMatchup(args)});}}
				style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
			>
				Next
			</button>
			<button
				disabled={!lastMatchup(args)}
				onClick={() => {dispatch({ type: "setMatchup", matchup:lastMatchup(args)});}}
				style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
			>
				Last
			</button>
		</div>
	);
}

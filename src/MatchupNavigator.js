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
	if(!leftCompare) {
		let rightCompare = a.right.localeCompare(b.right);
		if (!rightCompare) {
			return a.videogameId - b.videogameId;
		}
		return rightCompare;
	}
	return leftCompare;
};
export const getTotalMatchups = (minimumGames, videogameIds, matchup, lockLeft) => {
	let list = totalGamesList;
	let totalMatchups = 0;
	
	if(matchup && lockLeft) {
		list = matchupsPerCharacter[matchup.left];
		for(let m of list) {
			let enoughGames = getTotalGames(m) >= minimumGames;
			let correctVideogameId = videogameIds.length == 0;
			correctVideogameId = correctVideogameId || videogameIds.includes(""+m.videogameId);
			if(enoughGames && correctVideogameId) {
				totalMatchups += 1;
			}		
		}
		return totalMatchups;
	}
	let idx = firstIndexAtOrAboveThreshold(minimumGames);
	while(idx < totalGamesList.length) {
		let matchup = totalGamesList[idx];
		let enoughGames = getTotalGames(matchup) >= minimumGames;
		let correctVideogameId = videogameIds.length == 0;
		correctVideogameId = correctVideogameId || videogameIds.includes(""+matchup.videogameId);
		if(enoughGames && correctVideogameId) {
			totalMatchups += 1;
		}
		idx += 1;
	}
	return totalMatchups;
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

export const getTotalGames = (matchup) => {
	let leftWins = wins[matchup.videogameId][matchup.left][matchup.right];
	let rightWins = wins[matchup.videogameId][matchup.right][matchup.left];

	return leftWins + rightWins;
};

const compareByTotalGames = (a, b) => {
	let gamesCompare = getTotalGames(a) - getTotalGames(b);
	return gamesCompare ? gamesCompare : defaultCompareMatchups(a, b);
};

export const compareByLeftWinPercent = (a, b) => {
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

export const firstIndexAtOrAboveThreshold = function (threshold) {
	let listName = "Total Games";

	let b = 0;
	let e = totalGamesList.length - 1;

	while (b < e) {
		let m = Math.floor((b + e) / 2);
		let totalGames = getTotalGames(totalGamesList[m]);
		if (totalGames < threshold) {
			if (b + 1 === e) {
				return seekFirstIndexAtThreshold(totalGamesList, e);
			}
			b = m;
		}
		if (threshold < totalGames) {
			if (b + 1 === e) {
				return seekFirstIndexAtThreshold(totalGamesList, e);
			}
			e = m;
		}
		if (threshold === totalGames) {
			return seekFirstIndexAtThreshold(totalGamesList, m);
		}
	}
};

const seekFirstIndexAtThreshold = function (list, index) {
	let goalGames = getTotalGames(list[index]);
	while (index >= 0 && getTotalGames(list[index]) === goalGames) {
		index -= 1;
	}
	return index + 1;
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
	let {matchup, minimumGames, videogameIds, lockLeft} = args;
	let idx = 0;

	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		while(idx < list.length) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			if(matchup != newMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx += 1;
		}
	} else {
		let list = winnerWinPercentList;
		while(idx < list.length) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			if(matchup != newMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx += 1;
		}
	}
}

export function lastMatchup(args) {
	let {matchup, minimumGames, videogameIds, lockLeft} = args;
	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		let idx = list.length - 1;
		while(idx > 0) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			if(matchup != newMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx -= 1;
		}
	} else {
		let list = winnerWinPercentList;
		let idx = list.length - 1;
		while(idx >= 0) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			if(matchup != newMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx -= 1;
		}
	}
}

function binarySearchListForObjectWithComparator(list, matchup, comparator) {
	let idx = 0;

	while(idx < list.length && !(list[idx].left === matchup.left &&
								list[idx].right === matchup.right &&
								list[idx].videogameId === matchup.videogameId)) {
		idx+=1;
	}
	return idx;
}

export function nextMatchup(args) {
	let {matchup, minimumGames, videogameIds, lockLeft} = args;
	let goalMatchup = {...matchup};
	if(lockLeft) {
		let list = matchupsPerCharacter[goalMatchup.left];
		let comparator = compareByLeftWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, goalMatchup, comparator);
		while(idx < list.length) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			let sameMatchup = goalMatchup.videogameId == newMatchup.videogameId
							&& goalMatchup.left == newMatchup.left
							&& goalMatchup.right== newMatchup.right;
			if(!sameMatchup && enoughGames && correctVideogameId) {
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
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			let sameMatchup = goalMatchup.videogameId == newMatchup.videogameId
							&& goalMatchup.left == newMatchup.left
							&& goalMatchup.right== newMatchup.right;
			if(!sameMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx += 1;
		}
	}
}

export function prevMatchup(args) {
	let {matchup, minimumGames, videogameIds, lockLeft} = args;
	if(lockLeft) {
		let list = matchupsPerCharacter[matchup.left];
		let comparator = compareByLeftWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, matchup, comparator);
		let filteredVideogameIds = videogameIds;

		while(idx >= 0) {
			let newMatchup = list[idx];
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length == 0;
			if(matchup != newMatchup && enoughGames && correctVideogameId) {
				return newMatchup;
			}
			idx -= 1;
		}
	} else {
		let list = winnerWinPercentList;
		let comparator = compareByWinnerWinPercent;
		let idx = binarySearchListForObjectWithComparator(list, unreverse(matchup), comparator);
		while(idx >= 0) {
			let newMatchup = list[idx];
			let correctVideogameId = videogameIds.includes(""+newMatchup.videogameId);
			correctVideogameId = correctVideogameId || videogameIds.length==0;
			let enoughGames = getTotalGames(newMatchup) >= minimumGames;
			if(matchup != newMatchup && correctVideogameId&&enoughGames) {
				return newMatchup;
			}
			idx -= 1;
		}
	}
}


export function randomMatchup(state, filteredMatchups) {

	let list = state.lockLeft?matchupsPerCharacter[state.matchup.left]:totalGamesList;
	let enoughGames = false;
	let newState = state.matchup;
	if(getTotalMatchups(state.minimumGames, state.videogameIds, state.matchup, state.lockLeft) == 1) {
		return state.matchup;
	}
	if(state.lockLeft) {
		list = matchupsPerCharacter[state.matchup.left];
		if (list.length === 1) {
			return state.matchup;
		}
		let newIndex = Math.floor(Math.random() * list.length);
		while(list[newIndex] == state.matchup || !enoughGames) {
			newIndex = Math.floor(Math.random() * list.length);
			enoughGames = getTotalGames(list[newIndex]) >= state.minimumGames;
		}
		return list[newIndex];
	}
	if(state.quizMode) {
		let looping = true;
		let selected = {};

		while(looping) {
			let characters = Object.keys(matchupsPerCharacter);
			let randomCharacter = characters[Math.floor(Math.random()*characters.length)];
			let matchups = matchupsPerCharacter[randomCharacter];
			selected = matchups[Math.floor(Math.random()*matchups.length)];
			let noGameRequirements=state.videogameIds.length==0;
			let videogameIdInList = state.videogameIds.includes(""+selected.videogameId)
			let correctVideogameId = noGameRequirements||videogameIdInList;
			let enoughGames=getTotalGames(selected) >= state.minimumGames

			if(enoughGames && correctVideogameId) {
				looping = false;
			}
		}
		return selected;
	}
	const index0 = firstIndexAtOrAboveThreshold(state.minimumGames);
	let looping = true;
	let newIndex = index0 + Math.floor(Math.random() * (list.length-index0));
	while(looping) {
		newIndex = index0 + Math.floor(Math.random() * (list.length-index0));
		let newMatchup = totalGamesList[newIndex];

		let noGameRequirements=state.videogameIds.length==0;
		let videogameIdInList = state.videogameIds.includes(""+newMatchup.videogameId)
		let correctVideogameId = noGameRequirements||videogameIdInList;
		if(correctVideogameId) {
			looping=false;
		}
	}
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
export const matchupsPerCharacter = {};


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


export const totalGamesList = [...oneSidedMatchupListA].sort(compareByTotalGames);

export const fromMinimumGamesToTotalMatchups = {};

let numMatchups = 1;
let currentMinimumGames = 9999999;

while(numMatchups <= totalGamesList.length) {
	let lastMatchup = totalGamesList[totalGamesList.length - numMatchups];
	let thresholdForNumMatchups = getTotalGames(lastMatchup);
	if(thresholdForNumMatchups < currentMinimumGames) {
		fromMinimumGamesToTotalMatchups[thresholdForNumMatchups] = numMatchups;
	}
	numMatchups += 1;
}

let leftPercentList = [...twoSidedMatchupList].sort(compareByLeftWinPercent);
let winnerWinPercentList = [...oneSidedMatchupListA].sort(compareByWinnerWinPercent);


export function MatchupNavigator() {
	const dispatch = useDispatch();
	let {matchup, minimumGames, videogameIds, lockLeft}=useSelector((state)=>state);

	let args = {matchup, minimumGames, videogameIds, lockLeft};
	let videogameId = matchup.videogameId;

	useEffect(() => {
		if(!lockLeft) {
			dispatch({type:"setMatchup", matchup:matchup});
		}
	}, [dispatch, matchup, lockLeft]);


	return (
		<div className="matchup-navigator">
			<div className="matchup-navigator-bottom-row">
				<button
					className="button"
					disabled={!firstMatchup(args)}
					onClick={() => {dispatch({ type: "setMatchup", matchup:firstMatchup(args)});}}
					style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
				>
					First
				</button>
				<button
					className="button"
					disabled={!prevMatchup(args)}
					onClick={() => {
						dispatch({ type: "setMatchup", matchup:prevMatchup(args)});
					}}
					style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
				>
					Previous
				</button>

				<button
					className="button"
					onClick={() => {
						let newMatchup = randomMatchup(args);
						dispatch({ type: "setMatchup", matchup:newMatchup});
					}}
				>
					New
				</button>
				<button
					className="button"
					disabled={!nextMatchup(args)}
					onClick={() => {dispatch({ type: "setMatchup", matchup:nextMatchup(args)});}}
					style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
				>
					Next
				</button>
				<button
					className="button"
					disabled={!lastMatchup(args)}
					onClick={() => {dispatch({ type: "setMatchup", matchup:lastMatchup(args)});}}
					style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
				>
					Last
				</button>
			</div>
		</div>
	);
}

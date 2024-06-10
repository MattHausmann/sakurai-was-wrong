import { useEffect, React } from "react";
import { useSelector, useDispatch } from "react-redux";
import { gameIdMap } from "./consts";
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

export const getTotalMatchups = (minimumGames, videogameIds, requiredLeft) => {
	let totalMatchups = 0;
	let list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	for(let m of list) {
		if(matchupSatisfiesCriteria(m, minimumGames, videogameIds, requiredLeft)) {
			totalMatchups += 1;
		}
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

export const searchListForMatchingMatchup = (list, matchup) => {
	let idx = 0;
	while(idx < list.length) {
		let newMatchup = list[idx];
		if(newMatchup.left===matchup.left && newMatchup.right === matchup.right && newMatchup.videogameId === matchup.videogameId) {
			return idx;
		}
		idx += 1;
	}
	return idx;
}

export function firstMatchup(args) {
	let {minimumGames, videogameIds, requiredLeft} = args;
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	for(let i = 0; i < list.length; i++) {
		if(matchupSatisfiesCriteria(list[i], minimumGames, videogameIds)) {
			return i;
		}
	}
	return -1;
}

export function lastMatchup(args) {
	let {minimumGames, videogameIds, requiredLeft} = args;
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	for(let i = list.length-1; i >= 0; i--) {
		if(matchupSatisfiesCriteria(list[i], minimumGames, videogameIds)) {
			return i;
		}
	}
	return -1;
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

export const matchupSatisfiesCriteria = (m, minimumGames, videogameIds, requiredCharacter) => {
	if(getTotalGames(m) < minimumGames) {
		return false;
	}
	if(!videogameIds.length) {
		return true;
	}
	if(requiredCharacter && m.left!=requiredCharacter && m.right!=requiredCharacter) {
		return false;
	}
	return videogameIds.includes(""+m.videogameId);
};

export function nextMatchup(args) {
	let {idx, minimumGames, videogameIds, requiredLeft} = args;
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	for(let i = idx+1; i < list.length; i++) {
		if(matchupSatisfiesCriteria(list[i], minimumGames, videogameIds)) {
			return i;
		}
	}
	return -1;
}

export function prevMatchup(args) {
	let {idx, minimumGames, videogameIds, requiredLeft} = args;
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	for(let i = idx-1; i >= 0; i--) {
		if(matchupSatisfiesCriteria(list[i], minimumGames, videogameIds)) {
			return i;
		}
	}
	return -1;
}


export function randomMatchup(args) {
	let {idx, minimumGames, videogameIds, requiredLeft} = args;
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let {videogameId, left, right} = list[idx];
	
	let minIdx = firstIndexAtOrAboveThreshold(minimumGames);
	
	let i = minIdx;
	let totalGamesListIndices = totalGamesList.length - minIdx;
	if(getTotalMatchups(minimumGames, videogameIds, requiredLeft)==1){
		return searchListForMatchingMatchup(list, totalGamesList[i]);
	}

	i = Math.floor(Math.random()*totalGamesListIndices) + minIdx;
	while(!matchupSatisfiesCriteria(totalGamesList[i], minimumGames, videogameIds, requiredLeft)) {		
		i = Math.floor(Math.random()*totalGamesListIndices) + minIdx;
	}
	return searchListForMatchingMatchup(list, totalGamesList[i]);
}

export function randomQuizQuestion(args) {
	let {minimumGames, videogameIds, idx, requiredLeft} = args;
	let list = requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let matchup = list[idx];


	let i = Math.floor(Math.random() * winnerWinPercentList.length);

	if(!videogameIds) {

	}
}

function leftButtonsVisible(args) {
	return prevMatchup(args) !== -1;
}

function rightButtonsVisible(args) {
	return nextMatchup(args) !== -1;
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


export const matchupsPerCharacter = {};
for (let videogame of gameIdMap) {

	let videogameId = videogame.id;
	for (let left in wins[videogameId]) {
		if(!(left in matchupsPerCharacter)) {
			matchupsPerCharacter[left] = []
		}
		for (let right in wins[videogameId][left]) {
		if(left !== right) {
			let matchup = {videogameId, left, right};
			matchupsPerCharacter[left].push(matchup);
			let winnerWins = getWinnerWins(matchup);
			if(wins[videogameId][left][right] === winnerWins) {
				if(wins[videogameId][right][left] === winnerWins) {
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

export const winnerWinPercentList = [...oneSidedMatchupListA].sort(compareByWinnerWinPercent);

export function MatchupNavigator() {
	const dispatch = useDispatch();
	let {idx, minimumGames, videogameIds, requiredLeft}=useSelector((state)=>state.main);
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:winnerWinPercentList;
	let matchup = list[idx];
	let args = {idx, minimumGames, videogameIds, requiredLeft};

	useEffect(() => {
		if(!requiredLeft) {
			dispatch({type:"setMatchupIdx", idx});
		}
	}, [dispatch, idx, requiredLeft]);

	return (
		<div className="matchup-navigator">
			<div className="matchup-navigator-bottom-row">
				<button
					className="button"
					disabled={firstMatchup(args) === -1}
					onClick={() => {dispatch({ type: "setMatchupIdx", idx:firstMatchup(args)});}}
					style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
				>
					First
				</button>
				<button
					className="button"
					disabled={prevMatchup(args) === -1}
					onClick={() => {dispatch({ type: "setMatchupIdx", idx:prevMatchup(args)});}}
					style={{visibility:leftButtonsVisible(args)?'visible':'hidden'}}
				>
					Previous
				</button>

				<button
					className="button"
					onClick={() => {
						dispatch({ type: "setMatchupIdx", idx:randomMatchup(args)});
					}}
				>
					New
				</button>
				<button
					className="button"
					disabled={nextMatchup(args) === -1}
					onClick={() => {dispatch({ type: "setMatchupIdx", idx:nextMatchup(args)});}}
					style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
				>
					Next
				</button>
				<button
					className="button"
					disabled={lastMatchup(args) === -1}
					onClick={() => {dispatch({ type: "setMatchupIdx", idx:lastMatchup(args)});}}
					style={{visibility:rightButtonsVisible(args)?'visible':'hidden'}}
				>
					Last
				</button>
			</div>
		</div>
	);
}

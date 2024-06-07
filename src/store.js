import { createStore } from "redux";
import { getWins, getTotalGames, getTotalMatchups, totalGamesList, firstIndexAtOrAboveThreshold, randomMatchup, unreverse, fromMinimumGamesToTotalMatchups,matchupsPerCharacter, searchListForMatchingMatchup, winnerWinPercentList } from "./MatchupNavigator";
import wins from "./wins.json";

let initialState = {
	currentIndex: 1,
	matchup: {},
	orderBy: "Left Win %",
	quizMode: false,
	quizResults: [],
	totalScore: 0,
	mostRecentScore: 0,
	scoreDisplay: [],
	selectedGames: [],
	winsDisplay: [0, 0],
	lockLeft: false,
	minimumGames:1000,
	videogameIds:["1","1386"],
	idx:0,
};

let minGames = initialState.minimumGames;
let keys = Object.keys(fromMinimumGamesToTotalMatchups);
while(!(minGames in fromMinimumGamesToTotalMatchups) && minGames < keys.length) {
	minGames += 1;
}

let guessedMatchups = JSON.parse(localStorage.getItem('guessedMatchups')) || {};
let seenMatchups = JSON.parse(localStorage.getItem('seenMatchups')) || {};
let bestScorePerMatchup = JSON.parse(localStorage.getItem('bestScorePerMatchup')) || {};

function alphabetize(left, right) {
	let alphabeticallyFirst = left.localeCompare(right) < 0 ? left:right;
	let alphabeticallyLast = alphabeticallyFirst === left?right:left;
	return [alphabeticallyFirst, alphabeticallyLast];
}


const mutateStateFromGuess = (prevState, matchup, guess) => {
	let {videogameId, left, right} = matchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left,right);

	let prevGuess = 0;
	let totalGuessed = prevState.totalGuessed+1;

	if(videogameId in guessedMatchups) {
		if(alphabeticallyFirst in guessedMatchups[videogameId]) {
			if(alphabeticallyLast in guessedMatchups[videogameId][alphabeticallyFirst]) {
				prevGuess = guessedMatchups[videogameId][alphabeticallyFirst][alphabeticallyLast];
				totalGuessed -= 1;
			}
		}
	}


	let prevMatchupScore = scoreMatchup(matchup, prevGuess);
	let matchupScore = scoreMatchup(matchup, guess);
	let newTotalScore = prevState.totalScore - prevMatchupScore + matchupScore;

	let prevBestScore = getBestScore(matchup);

	if(!(videogameId in bestScorePerMatchup)) {
		bestScorePerMatchup[videogameId] = {};
	}

	if(!(alphabeticallyFirst in bestScorePerMatchup[videogameId])) {
		bestScorePerMatchup[videogameId][alphabeticallyFirst] = {};
	}
	if(!(alphabeticallyLast in bestScorePerMatchup[videogameId][alphabeticallyFirst])) {
		bestScorePerMatchup[videogameId][alphabeticallyFirst][alphabeticallyLast] = 0;
	}
	let newBestScore = Math.max(prevBestScore, matchupScore);
	bestScorePerMatchup[videogameId][alphabeticallyFirst][alphabeticallyLast] = newBestScore;



	if(!(videogameId in guessedMatchups)) {
		guessedMatchups[videogameId] = {};
	}
	if(!(alphabeticallyFirst in guessedMatchups[videogameId])) {
		guessedMatchups[videogameId][alphabeticallyFirst] = {};
	}
	guessedMatchups[videogameId][alphabeticallyFirst][alphabeticallyLast] = guess;


	localStorage.setItem("guessedMatchups", JSON.stringify(guessedMatchups));
	localStorage.setItem("bestScorePerMatchup", JSON.stringify(bestScorePerMatchup));

	let newTotalSeen = prevState.totalSeen+1;

	if(videogameId in seenMatchups) {
		if(alphabeticallyFirst in seenMatchups[videogameId]) {
			if(seenMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast)) {
				newTotalSeen -= 1;
			}
		}
	}

	if(!(videogameId in seenMatchups)) {
		seenMatchups[videogameId] = {};
	}
	if(!(alphabeticallyFirst in seenMatchups[videogameId])) {
		seenMatchups[videogameId][alphabeticallyFirst] = []
	}
	if(!(seenMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast))) {
		seenMatchups[videogameId][alphabeticallyFirst].push(alphabeticallyLast);
	}
	localStorage.setItem("seenMatchups", JSON.stringify(seenMatchups));


	return {
		...prevState,
		totalSeen:newTotalSeen,
		totalGuessed:totalGuessed,
		totalScore:newTotalScore,
		mostRecentScore:matchupScore,
		bestScore:newBestScore,
		displayQuizResults:true,
		winsDisplay: newWinsDisplay(false, prevState.matchup),
	}

}

const getBestScore = (matchup) => {
	let {videogameId, left, right} = matchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left, right);

	if(videogameId in bestScorePerMatchup) {
		if(alphabeticallyFirst in bestScorePerMatchup[videogameId]) {
			if(alphabeticallyLast in bestScorePerMatchup[videogameId][alphabeticallyFirst]) {
				return bestScorePerMatchup[videogameId][alphabeticallyFirst][alphabeticallyLast];
			}
		}
	}
	return 0;
}


const newWinsDisplay = (quizMode, matchup) => {
	if (quizMode) {
		let sum =
			wins[matchup.videogameId][matchup.left][matchup.right] +
			wins[matchup.videogameId][matchup.right][matchup.left];
		let halfWins = Math.ceil(sum / 2);
		return [halfWins, sum - halfWins];
	} else {
		return [
			wins[matchup.videogameId][matchup.left][matchup.right],
			wins[matchup.videogameId][matchup.right][matchup.left],
		];
	}
};

// this is distinct from mutating due to a quiz guess
const mutateStateFromNav = (prevState, newMatchup) => {
	let {videogameId, left, right} = newMatchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left, right);
	let newLockLeft = prevState.lockLeft;


	if(wins[videogameId][left][right]<wins[videogameId][right][left]) {
		newLockLeft = true;
	}
	if(wins[videogameId][left][right]===wins[videogameId][right][left]) {
		newLockLeft = left !== alphabeticallyFirst;
	}


	let newTotalSeen = prevState.totalSeen + 1;


	if(videogameId in seenMatchups) {
		if(alphabeticallyFirst in seenMatchups[videogameId]) {
			if(seenMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast)) {
				newTotalSeen -= 1;
			}
		}
	}
	if(!(videogameId in seenMatchups)) {
		seenMatchups[videogameId] = {};
	}
	if(!(alphabeticallyFirst in seenMatchups[videogameId])) {
		seenMatchups[videogameId][alphabeticallyFirst] = [];
	}
	if(!(seenMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast))) {
		seenMatchups[videogameId][alphabeticallyFirst].push(alphabeticallyLast);
	}

	localStorage.setItem("seenMatchups", JSON.stringify(seenMatchups));

	let winsDisplay =  newWinsDisplay(prevState.quizMode, newMatchup);

	return {
		...prevState,
		totalSeen:newTotalSeen,
		bestScore: getBestScore(newMatchup),
		matchup: newMatchup,
		mostRecentScore: scoreMatchup(newMatchup),
		winsDisplay: winsDisplay,
		lockLeft:newLockLeft,
	};
};

const scoreMatchup = (matchup, guess) => {
	let {videogameId, left, right} = matchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left, right);
	if(!guess) {
		if(videogameId in guessedMatchups) {
			let videogame = guessedMatchups[videogameId];
			if(alphabeticallyFirst in videogame) {
				let character = videogame[alphabeticallyFirst];
				if(alphabeticallyLast in character) {
					guess = character[alphabeticallyLast];
				}
			}
		}
	}
	if(!guess) {
		return 0;
	}
	let wins = getWins({videogameId, left:alphabeticallyFirst, right:alphabeticallyLast});
	let scoreRatio = guess/wins[0];
	if(scoreRatio > 1) {
		let totalWins = wins[0] + wins[1];
		guess = totalWins - guess;
		scoreRatio = guess / wins[1];
	}
	let totalScore = Math.floor(scoreRatio*scoreRatio*10000);
	return totalScore;
};

let firstMatchup = randomMatchup(initialState);
initialState = mutateStateFromNav(initialState, firstMatchup);
initialState.idx = searchListForMatchingMatchup(winnerWinPercentList, firstMatchup);



const getTotalScore = (minimumGames, videogameIds, requiredLeft) => {
	console.log(requiredLeft);
	let idx = requiredLeft?0:firstIndexAtOrAboveThreshold(minimumGames);
	let list=requiredLeft?matchupsPerCharacter[requiredLeft]:totalGamesList;
	let totalScore = 0;
	while(idx < list.length) {
		let matchup = list[idx];
		let enoughGames = getTotalGames(matchup) >= minimumGames;
		let correctVideogameId = videogameIds.length === 0;
		correctVideogameId = correctVideogameId || videogameIds.includes(""+matchup.videogameId);
		if(enoughGames && correctVideogameId) {
			totalScore += scoreMatchup(matchup);
		}
		idx += 1;
	}
	return totalScore;
}

initialState.totalMatchups = getTotalMatchups(initialState.minimumGames, initialState.videogameIds);

const countSeenMatchupsMinimumGames = (minimumGames, videogameIds) => {
	let seen = 0;
	let videogameIdKeys = videogameIds;
	if(videogameIds.length === 0) {
		videogameIdKeys=Object.keys(seenMatchups);
	}
	for(let videogameId of videogameIdKeys) {
		for(let alphabeticallyFirst in seenMatchups[videogameId]) {
			for(let alphabeticallyLast of seenMatchups[videogameId][alphabeticallyFirst]) {
				if(getTotalGames({videogameId, left:alphabeticallyFirst, right:alphabeticallyLast}) >= minimumGames) {
					seen += 1;
				}
			}
		}
	}
	return seen;
}

const countGuessedMatchupsMinimumGames = (minimumGames, videogameIds, ) => {
	let guessed = 0;
	let videogameIdKeys = videogameIds;
	if(videogameIds.length === 0) {
		videogameIdKeys = Object.keys(guessedMatchups);
	}

	for(let videogameId of videogameIdKeys) {
		for(let alphabeticallyFirst in guessedMatchups[videogameId]) {
			for(let alphabeticallyLast in guessedMatchups[videogameId][alphabeticallyFirst]) {
				if(getTotalGames({videogameId, left:alphabeticallyFirst, right:alphabeticallyLast}) >= minimumGames) {
					guessed += 1;
				}
			}
		}
	}
	return guessed;
}

initialState.totalScore = getTotalScore(
	initialState.minimumGames,
	initialState.videogameIds
);
initialState.totalSeen = countSeenMatchupsMinimumGames(
	initialState.minimumGames,
	initialState.videogameIds
);
initialState.totalGuessed = countGuessedMatchupsMinimumGames(initialState.minimumGames, initialState.videogameIds);



const reducer = (prevState = initialState, action) => {
	let {matchup, lockLeft} = prevState;
	let requiredLeft = lockLeft?matchup.left:"";
	switch (action.type) {
		case "setGameId":
			return {
				...prevState,
				gameId: action.gameId,
			};
		case "updateWinsDisplay":
			return {
				...prevState,
				winsDisplay: action.winsDisplay,
			};
		case "setMatchup":
			return mutateStateFromNav(prevState, action.matchup);
		case "setMatchupIdx":
			return {
				...prevState,
				idx:action.idx,
			}
		case "toggleLockLeft":
			let unreversedMatchup = matchup;
			if(prevState.lockLeft) {
				unreversedMatchup = unreverse(unreversedMatchup);
			}
			return {
				...prevState,
				lockLeft: !prevState.lockLeft,
				matchup:unreversedMatchup,
			};

		// quiz muts
		case "pushQuizResult":
			return {
				...prevState,
				quizResults: [...prevState.quizResults, action.result],
			};

		case "toggleQuizMode":
			prevState.lockLeft = false;
			let newMatchup = action.val?randomMatchup(prevState):prevState.matchup;
			return {
				...prevState,
				quizMode: action.val,
				winsDisplay: newWinsDisplay(action.val, newMatchup),
				matchup:newMatchup,
				displayQuizResults:false,
				lockLeft:false,
			};

		case "submitGuess": {
			let[alphabeticallyFirst, _alphabeticallyLast] = alphabetize(prevState.matchup.left, prevState.matchup.right);
			let guess = alphabeticallyFirst === prevState.matchup.left?prevState.winsDisplay[0]:prevState.winsDisplay[1];
			let newGuessedMatchups = mutateStateFromGuess(prevState, prevState.matchup, guess);

			return newGuessedMatchups;
		}

		case "resetQuizSubmitDisplay": {
			let newMatchup = randomMatchup(prevState);
			return {
				...prevState,
				displayQuizResults: false,
				matchup: newMatchup,
				mostRecentScore:scoreMatchup(newMatchup),
				winsDisplay: newWinsDisplay(prevState.quizMode, newMatchup),
				bestScore: getBestScore(newMatchup),
			};
		}
		case "setMinimumGames": {
			return {
				...prevState,
				minimumGames:action.val,
				totalMatchups:getTotalMatchups(action.val, prevState.videogameIds, requiredLeft),
				totalGuessed: countGuessedMatchupsMinimumGames(action.val, prevState.videogameIds, prevState.lo),
				totalSeen: countSeenMatchupsMinimumGames(action.val, prevState.videogameIds),
				totalScore: getTotalScore(action.val, prevState.videogameIds, requiredLeft),
			}
		}

		case "forceMinimumGames": {
			prevState.minimumGames=action.val;
			return {
				...prevState,
				minimumGames:action.val,
				totalMatchups:getTotalMatchups(action.val, prevState.videogameIds),
				totalGuessed:countGuessedMatchupsMinimumGames(action.val, prevState.videogameIds),
				totalSeen:countSeenMatchupsMinimumGames(action.val, prevState.videogameIds),
				matchup:randomMatchup({...prevState, minimumGames:action.val}),
				totalScore: getTotalScore(action.val, prevState.videogameIds,requiredLeft),
			}
		}


		case "toggleGameSelected": {
			const videogameId = ""+action.val;
			let newVideogameIds;
			if(prevState.videogameIds.includes(videogameId)) {
				newVideogameIds = prevState.videogameIds.filter(e => e!==videogameId);
			} else {
				newVideogameIds = [...prevState.videogameIds, videogameId];
			}

			return {
				...prevState,
				videogameIds: newVideogameIds,
				totalMatchups:getTotalMatchups(prevState.minimumGames, newVideogameIds),
				totalGuessed: countGuessedMatchupsMinimumGames(prevState.minimumGames, newVideogameIds),
				totalSeen: countSeenMatchupsMinimumGames(prevState.minimumGames, newVideogameIds),
				totalScore: getTotalScore(prevState.minimumGames, newVideogameIds, requiredLeft),
			}
		}

		case "forceToggleGameSelected": {
			let filteredMatchups = prevState.videogameIds.filter(e => e!==action.val);
			if(prevState.videogameIds.length === 0) {
				filteredMatchups = [action.val];
			}
			prevState.videogameIds = filteredMatchups;
			return {
				...prevState,
				videogameIds: filteredMatchups,
				matchup: randomMatchup(prevState),
				totalMatchups:getTotalMatchups(prevState.minimumGames, filteredMatchups),
				totalSeen: countSeenMatchupsMinimumGames(prevState.minimumGames, filteredMatchups),
				totalGuessed: countGuessedMatchupsMinimumGames(prevState.minimumGames, filteredMatchups),
				totalScore: getTotalScore(prevState.minimumGames, filteredMatchups, requiredLeft),
			};
		}

		default:
			return prevState;
	}
};

const store = createStore(
	reducer,
	initialState,
	window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
export default store;

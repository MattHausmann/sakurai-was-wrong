import { createStore } from "redux";
import { randomMatchup, unreverse } from "./MatchupNavigator";
import wins from "./wins.json";

let initialState = {
	bestScores: {},
	currentIndex: 1,
	seenMatchups: JSON.parse(localStorage.getItem('seenMatchups')) ?? {},
	guessedMatchups: JSON.parse(localStorage.getItem('guessedMatchups')) ?? {},
	matchup: {},
	minimumGames: 1000,
	orderBy: "Left Win %",
	quizMode: false,
	quizResults: [],
	score: 0,
	scoreDisplay: [],
	selectedGames: [],
	winsDisplay: [0, 0],
	lockLeft: false,
};

function alphabetize(left, right) {
	let alphabeticallyFirst = left.localeCompare(right) < 0 ? left:right;
	let alphabeticallyLast = alphabeticallyFirst == left?right:left;
	return [alphabeticallyFirst, alphabeticallyLast];
}

const mutateSeenMatchups = (seenMatchups, matchup) => {
	let {videogameId, left, right} = matchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left, right);
	
	let newMatchups = {...seenMatchups};
	
	if(!(videogameId in newMatchups)) {
		newMatchups[videogameId] = {}
	}
	if(!(alphabeticallyFirst in newMatchups[videogameId])) {
		newMatchups[videogameId][alphabeticallyFirst] = [];
	}
	if(!(newMatchups[videogameId][alphabeticallyFirst].includes(alphabeticallyLast))) {
		newMatchups[videogameId][alphabeticallyFirst].push(alphabeticallyLast);
	}
	console.log(newMatchups);
	localStorage.setItem('seenMatchups', JSON.stringify(newMatchups));
	return newMatchups;
}



const mutateGuessedMatchups = (guessedMatchups, matchup, guess) => {
	let {videogameId, left, right} = matchup;
	let [alphabeticallyFirst, alphabeticallyLast] = alphabetize(left, right);
	
	let newMatchups = {...guessedMatchups};

	if(!(videogameId in newMatchups)) {
		newMatchups[videogameId] = {}
	}
	if(!(alphabeticallyFirst in newMatchups[videogameId])) {
		newMatchups[videogameId][alphabeticallyFirst] = {};
	}
	
	newMatchups[videogameId][alphabeticallyFirst][alphabeticallyLast] = guess;

	console.log(newMatchups);
	localStorage.setItem('guessedMatchups', JSON.stringify(newMatchups));
	console.log(newMatchups);
	return newMatchups;

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
	
	console.log(prevState.matchup, newMatchup);
	return {
		...prevState,
		matchup: newMatchup,
		seenMatchups: mutateSeenMatchups(prevState.seenMatchups, newMatchup),
		winsDisplay: newWinsDisplay(prevState.quizMode, newMatchup),
	};
};
// const mutateStateFromQuiz = (prevState, newMatchup) => {
// 	return {
// 		...prevState,
// 		matchup: newMatchup,
// 		seenMatchups: {
// 			...prevState.seenMatchups,
// 			[seenMatchupStringify(newMatchup)]: true,
// 		},
// 		scoreDisplay: [
// 			...prevState.scoreDisplay,
// 			{ matchup: prevState.matchup, guess: prevState.winsDisplay },
// 		],
// 		winsDisplay: newWinsDisplay(prevState.quizMode, newMatchup),
// 	};
// };

let firstMatchup = randomMatchup(initialState);
initialState = mutateStateFromNav(initialState, firstMatchup);

const reducer = (prevState = initialState, action) => {
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
		case "toggleLockLeft":
		console.log(prevState.matchup, unreverse(prevState.matchup));
			return {
				...prevState,
				lockLeft: !prevState.lockLeft,
				matchup:unreverse(prevState.matchup),
			};

		// quiz muts
		case "pushQuizResult":
			return {
				...prevState,
				quizResults: [...prevState.quizResults, action.result],
			};

		case "toggleQuizMode":
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
			let actual = [
				wins[prevState.matchup.videogameId][prevState.matchup.left][
					prevState.matchup.right
				],
				wins[prevState.matchup.videogameId][prevState.matchup.right][
					prevState.matchup.left
				],
			];
			console.log(prevState.winsDisplay);
			let[alphabeticallyFirst , alphabeticallyLast] = alphabetize(prevState.matchup.left, prevState.matchup.right);
			let guess = alphabeticallyFirst == prevState.matchup.left?prevState.winsDisplay[0]:prevState.winsDisplay[1];
			let newGuessedMatchups = mutateGuessedMatchups(prevState.guessedMatchups, prevState.matchup, guess);
			localStorage.setItem("guessedMatchups", JSON.stringify(newGuessedMatchups));
			return {
				...prevState,
				quizResults: [
					...prevState.quizResults,
					{ matchup: prevState.matchup, guess: prevState.winsDisplay, actual },					
				],
				seenMatchups:mutateSeenMatchups(prevState.seenMatchups, prevState.matchup),
				guessedMatchups:newGuessedMatchups,
				displayQuizResults: true,
				winsDisplay: newWinsDisplay(false, prevState.matchup),
			};
		}
		case "resetQuizSubmitDisplay": {
			let newMatchup = randomMatchup(prevState);
			return {
				...prevState,
				displayQuizResults: false,
				matchup: newMatchup,
				winsDisplay: newWinsDisplay(prevState.quizMode, newMatchup),
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

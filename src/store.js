import { createStore } from "redux";
import { randomMatchup } from "./MatchupNavigator";
import wins from "./wins.json";

let initialState = {
	bestScores: {},
	currentIndex: 1,
	guessedMatchups: {},
	matchup: {},
	minimumGames: 1,
	orderBy: "Left Win %",
	quizMode: false,
	quizResults: [],
	score: 0,
	scoreDisplay: [],
	selectedGames: [],
	seenMatchups: {},
	winsDisplay: [0, 0],
	lockLeft: false,
};

const seenMatchupStringify = (newMatchup) => {
	return [[newMatchup.left, newMatchup.right].sort().join("")];
};

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
	return {
		...prevState,
		matchup: newMatchup,
		seenMatchups: {
			...prevState.seenMatchups,
			[seenMatchupStringify(newMatchup)]: true,
		},
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
			return {
				...prevState,
				lockLeft: !prevState.lockLeft,
			};

		// quiz muts
		case "pushQuizResult":
			return {
				...prevState,
				quizResults: [...prevState.quizResults, action.result],
			};

		case "toggleQuizMode":
			return {
				...prevState,
				quizMode: action.val,
				winsDisplay: newWinsDisplay(action.val, prevState.matchup),
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
			return {
				...prevState,
				quizResults: [
					...prevState.quizResults,
					{ matchup: prevState.matchup, guess: prevState.winsDisplay, actual },
				],
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

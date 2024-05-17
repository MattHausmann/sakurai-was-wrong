import wins from "./wins.json";
import { createStore } from "redux";
import { randomMatchup } from "./MatchupNavigator";

let initialState = {
  bestScores: {},
  currentIndex: 1,
  guessedMatchups: {},
  minimumGames: 3000,
  orderBy: "Left Win %",
  quizMode: false,
  quizResults: [],
  selectedGames: [],
  seenMatchups: {},
  winsDisplay: [0, 0],
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

    case "setOrderBy":
      return {
        ...prevState,
        orderBy: action.orderBy,
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

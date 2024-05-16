import wins from "./wins.json";
import { createStore } from "redux";
import {
  binarySearchListForObjectWithComparator,
  compareByTotalGames,
  first,
  prev,
  next,
  last,
  randomMatchup,
} from "./MatchupNavigator";

let initialState = {
  bestScores: {},
  currentIndex: 1,
  guessedMatchups: {},
  minimumGames: 1000,
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


//searches for a matchup by minimum games
let firstMatchup = randomMatchup(initialState);

// let totalGamesList = sortedMatchupLists["Total Games"];
// let totalGamesIndex = binarySearchListForObjectWithComparator(
//   totalGamesList,
//   firstMatchup,
//   compareByTotalGames
// );
// let matchupsPossible = totalGamesList.length - totalGamesIndex;
// totalGamesIndex =
// totalGamesIndex + Math.floor(Math.random() * matchupsPossible);

// initialState.matchup = totalGamesList[totalGamesIndex];

initialState.matchup = firstMatchup;
initialState.winsDisplay = newWinsDisplay(initialState.quizMode, initialState.matchup);
initialState.seenMatchups = {
  [[initialState.matchup.left, initialState.matchup.right]
    .sort()
    .join("")]: true,
};


let state = initialState;
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

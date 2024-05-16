import { createStore } from "redux";
import { MatchupNavigator, first, prev, next, last, randomMatchup} from './MatchupNavigator';
console.log("in store.js");















console.log("defined first, next, last");







let initialState = {
  minimumGames: 8000,
  selectedGames: [],
  seenMatchups: {},
  guessedMatchups: {},
  bestScores: {},
  orderBy: "Left Win %",
  quizMode: false,
  currentIndex: 1,
  quizResults: [],
};

//searches for a matchup by minimum games
let firstMatchup = randomMatchup(initialState);


initialState.matchup = firstMatchup;

initialState.seenMatchups = {[[initialState.matchup.left, initialState.matchup.right].sort().join("")]:true};

let state = initialState;

const reducer = (prevState = initialState, action) => {
  switch (action.type) {
    case "setGameId":
      return {
        ...prevState,
        gameId: action.gameId,
      };
    case "setWins":
      return {
        ...prevState,
        wins: action.wins,
      };
    case "setLeftWins":
      return {
        ...prevState,
        wins: [action.leftWins, prevState.wins[1]],
      };
    case "setRightWins":
      return {
        ...prevState,
        wins: [prevState.wins[0], action.rightWins],
      };
    case "prev":
      return {
        ...prevState,
        matchup: prev(prevState),
      };
    case "next":
      return {
        ...prevState,
        matchup: next(prevState),
      };
    case "first":
      return {
        ...prevState,
        matchup: first(prevState),
      };
    case "last":
      return {
        ...prevState,
        matchup: last(prevState),
      };
    case "random": {

      let newMatchup = randomMatchup(prevState);
        if (prevState.lockedSide == "left") {
          while (newMatchup.left !== prevState.matchup.left) {
            newMatchup = randomMatchup(prevState);
          }
        }
        if (prevState.lockedSide == "right") {
          while (newMatchup.right !== prevState.matchup.right) {
            newMatchup = randomMatchup(prevState);
          }
        }
      

      return {
        ...prevState,
        matchup: newMatchup,
        seenMatchups: {
          ...prevState.seenMatchups,
          [[newMatchup.left, newMatchup.right].sort().join("")]: true,
        },
      };
	}

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

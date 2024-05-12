import wins from "./wins.json";
import { createStore } from "redux";

console.log("in store.js");

const getWinnerWins = (matchup) => {
  let leftWins = wins[matchup.videogameId][matchup.left][matchup.right];
  let rightWins = wins[matchup.videogameId][matchup.right][matchup.left];
  return Math.max(leftWins, rightWins);
};

const getLoserWins = (matchup) => {
  let videogameId = matchup.videogameId;
  let leftWins = wins[videogameId][matchup.left][matchup.right];
  let rightWins = wins[videogameId][matchup.right][matchup.left];
  return Math.min(leftWins, rightWins);
};

const getTotalGames = (matchup) => {
  let leftWins = wins[matchup.videogameId][matchup.left][matchup.right];
  let rightWins = wins[matchup.videogameId][matchup.right][matchup.left];

  return leftWins + rightWins;
};

const compareByTotalGames = (a, b) => {
  return getTotalGames(a) - getTotalGames(b);
};

const compareByLeftWinPercent = (a, b) => {
  let aLeftWins = wins[a.videogameId][a.left][a.right];
  let aRightWins = wins[a.videogameId][a.right][a.left];
  let bLeftWins = wins[b.videogameId][b.left][b.right];
  let bRightWins = wins[b.videogameId][b.right][b.left];

  let leftWinPctDifference = aLeftWins * bRightWins - bLeftWins * aRightWins;
  if (leftWinPctDifference == 0) {
    return aLeftWins - bLeftWins;
  }
  return leftWinPctDifference;
};

const compareByWinnerWinPercent = (a, b) => {
  let aWinnerWins = getWinnerWins(a);
  let aLoserWins = getLoserWins(a);
  let bWinnerWins = getWinnerWins(b);
  let bLoserWins = getLoserWins(b);
  //awins/aloses > bwins/bloses but with cross-multiplication
  let winnerWinPctDifference =
    aWinnerWins * bLoserWins - bWinnerWins * aLoserWins;
  if (winnerWinPctDifference == 0) {
    return aWinnerWins - bWinnerWins;
  }
  return winnerWinPctDifference;
};
const compareByLoserWinPercent = (a, b) => {
  let aWinnerWins = getWinnerWins(a);
  let aLoserWins = getLoserWins(a);
  let bWinnerWins = getWinnerWins(b);
  let bLoserWins = getLoserWins(b);
  //aLoses/aWins > bLoses/bWins but with cross-multiplication
  let loserWinPctDifference =
    bWinnerWins * aLoserWins - aWinnerWins * bLoserWins;
  if (loserWinPctDifference == 0) {
    return aLoserWins - bLoserWins;
  }
  return loserWinPctDifference;
};

const unsortedMatchupList = [];
for (let videogameId of [1, 1386]) {
  for (let winner in wins[videogameId]) {
    for (let loser in wins[videogameId][winner]) {
      if (loser != winner) {
        unsortedMatchupList.push({
          videogameId: videogameId,
          left: winner,
          right: loser,
        });
      }
    }
  }
}

const labeledComparators = {
  "Left Win %": compareByLeftWinPercent,
  Lopsidedness: compareByWinnerWinPercent,
  "Total Games": compareByTotalGames,
  Balance: compareByLoserWinPercent,
};

let sortedMatchupLists = {};
for (let sortBy in labeledComparators) {
  sortedMatchupLists[sortBy] = [...unsortedMatchupList].sort(
    labeledComparators[sortBy]
  );
}

//ok so now we have a bunch of sorted matchup lists and the comparators we used to sort them
//we need to use this to enable first/prev/next/last/random
//whenever we change sort methods we look up the appropriate list at sortedMatchupLists[sortBy]
//we binary search our index in sortedMatchupLists[sortBy] using labeledComparators(sortBy)
//we need to know the first, prev, next, and last matchups that satisfy our criteria (vgids, min games, required character)
//we don't make the button appear if it doesn't make us move
//we make the button appear on the side in the direction it has us move (random on the bottom in the middle)

//games

//score winner win %
//care about being on the right side of 50

//minimumGames, currentMatchup, sortBy, selectedGames, quizMode
//seenMatchups object, guessedMatchups object, bestScores object

//every time we change minimumGames
const prev = (state) => {
  let targetPrev = state.currentIndex - 1;
  let currentList = sortedMatchupLists[state.orderBy];

  let enoughGames = false;
  let leftOkay = !state.requiredLeft;
  let rightOkay = !state.requiredRight;

  while (targetPrev >= 0 && (!enoughGames || !leftOkay || !rightOkay)) {
    let matchup = currentList[targetPrev];
    let enoughGames = getTotalGames(matchup) >= state.minimumGames;
    let leftOkay = !state.requiredLeft || state.requiredLeft == matchup.left;
    let rightOkay = state.requiredRight || state.requiredRight == matchup.right;
    targetPrev -= 1;
  }

  return targetPrev;
};

const next = (state) => {
  let targetNext = state.currentIndex + 1;
  let currentList = sortedMatchupLists[state.orderBy];

  let enoughGames = false;
  let leftOkay = !state.requiredLeft;
  let rightOkay = !state.requiredRight;

  while (
    targetNext < currentList.length &&
    (!enoughGames || !leftOkay || !rightOkay)
  ) {
    let matchup = currentList[targetNext];
    let enoughGames = getTotalGames(matchup) >= state.minimumGames;
    let leftOkay = !state.requiredLeft || state.requiredLeft == matchup.left;
    let rightOkay = state.requiredRight || state.requiredRight == matchup.right;
    targetNext += 1;
  }
  return targetNext;
};

const first = (state) => {
  let currentList = sortedMatchupLists[state.orderBy];
  let i = 0;

  let enoughGames = false;
  let leftOkay = !state.requiredLeft;
  let rightOkay = !state.requiredRight;

  while (i < currentList.length && (!enoughGames || !leftOkay || !rightOkay)) {
    let matchup = currentList[i];
    let enoughGames = getTotalGames(matchup) >= state.minimumGames;
    let leftOkay = !state.requiredLeft || state.requiredLeft == matchup.left;
    let rightOkay = state.requiredRight || state.requiredRight == matchup.right;
    i += 1;
  }

  return i;
};

const last = (state) => {
  let currentList = sortedMatchupLists[state.orderBy];
  let i = currentList.length - 1;

  let enoughGames = false;
  let leftOkay = !state.requiredLeft;
  let rightOkay = !state.requiredRight;

  while (i >= 0 && (!enoughGames || !leftOkay || !rightOkay)) {
    let matchup = currentList[i];
    let enoughGames = getTotalGames(matchup) >= state.minimumGames;
    let leftOkay = !state.requiredLeft || state.requiredLeft == matchup.left;
    let rightOkay = state.requiredRight || state.requiredRight == matchup.right;
    i -= 1;
  }

  return i;
};
console.log("defined first, next, last");
const random = function (state) {
  var enoughGames = false;
  let leftOkay = !state.requiredLeft;
  let rightOkay = !state.requiredRight;

  let i = 0;
  while (!enoughGames || !leftOkay || !rightOkay) {
    let i = Math.floor(Math.random(unsortedMatchupList.length));
    let matchup = unsortedMatchupList[i];

    enoughGames = getTotalGames(matchup) >= state.minimumGames;
    leftOkay = !state.requiredLeft || state.requiredLeft == matchup.left;
    rightOkay = !state.requiredRight || state.requiredRight == matchup.right;
  }
  console.log("out of while loop");
  return i;
};

let initialState = {
  minimumGames: 200,
  selectedGames: [],
  seenMatchups: {},
  guessedMatchups: {},
  bestScores: {},
  orderBy: "Left Win %",
  quizMode: false,
  currentIndex: random({ minimumGames: 200, orderBy: "Evenness" }),
};

while (
  getTotalGames(
    sortedMatchupLists[initialState.orderBy][initialState.currentIndex]
  ) < initialState.minimumGames
) {
  initialState.currentIndex = Math.floor(
    Math.random() * sortedMatchupLists[initialState.orderBy].length
  );
}
console.log("defined initialState");
while (
  getTotalGames(
    sortedMatchupLists[initialState.orderBy][initialState.currentIndex]
  ) < initialState.minimumGames
) {
  initialState.currentIndex = Math.floor(
    Math.random() * sortedMatchupLists[initialState.orderBy].length
  );
}

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
        currentIndex: prev(prevState),
      };
    case "next":
      return {
        ...prevState,
        currentIndex: next(prevState),
      };
    case "first":
      return {
        ...prevState,
        currentIndex: next(prevState),
      };
    case "last":
      return {
        ...prevState,
        currentIndex: next(prevState),
      };
    case "random":
      return {
        ...prevState,
        currentIndex: random(prevState),
      };
    default:
      return prevState;
  }
};

const store = createStore(reducer, initialState);
export default store;

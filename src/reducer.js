<<<<<<< HEAD


=======
>>>>>>> 7720b576a939de5a5bd2da22b55c13dd6b036a26
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "setGameId":
      return {
        ...state,
        gameId: action.gameId,
      };
    case "setWins":
      return {
        ...state,
        wins: action.wins,
      };
    case "setLeftWins":
      return {
        ...state,
        wins: [action.leftWins, state.wins[1]],
      };
    case "setRightWins":
      return {
        ...state,
        wins: [state.wins[0], action.rightWins],
      };
<<<<<<< HEAD
	case "prev":
	  return {
	    ...state,
        currentIndex:prev(state),
	  };
    default:
      return state;
  }
};
=======
    default:
      return state;
  }
};
>>>>>>> 7720b576a939de5a5bd2da22b55c13dd6b036a26

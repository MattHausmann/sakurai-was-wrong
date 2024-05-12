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
    default:
      return state;
  }
};

import { startGuessAnimation, endGuessAnimation } from "./async_reducer";

const submitGuessClick = () => {
	return async (dispatch) => {
		dispatch(startGuessAnimation());
		const t = 750;
		setTimeout(() => {
			dispatch(endGuessAnimation());
			dispatch({ type: "submitGuess" });
		}, t);
	};
};

export { submitGuessClick };

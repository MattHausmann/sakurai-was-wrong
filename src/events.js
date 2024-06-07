import { startGuessAnimation, endGuessAnimation } from "./async_reducer";
import wins from "./wins.json";

const submitGuessClick = () => {
	return async (dispatch, getState) => {
		dispatch(startGuessAnimation());
		const state = getState();
		const currentMatchup = state.main.matchup;
		console.log(currentMatchup);
		const t = 750;
		setTimeout(() => {
			console.log("end guess animation");
			dispatch(endGuessAnimation());
		}, t);
	};
};

export { submitGuessClick };

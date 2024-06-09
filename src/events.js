import {
	animationTick,
	startGuessAnimation,
	endGuessAnimation,
} from "./async_reducer";

const fps = 120;
const sliderAnimationDuration = 750;

const lerp = (a, b, t) => {
	return (1 - t) * a + t * b;
};

const submitGuessClick = () => {
	return async (dispatch, getState) => {
		dispatch(startGuessAnimation());
		let interval = setInterval(() => {
			dispatch(animationTick());
		}, 1000 / fps);
		setTimeout(() => {
			clearInterval(interval);
			dispatch(endGuessAnimation());
			dispatch({ type: "submitGuess" });
		}, sliderAnimationDuration);
	};
};

export { sliderAnimationDuration, submitGuessClick, lerp };

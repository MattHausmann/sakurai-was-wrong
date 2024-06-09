import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	quizSliderAnimation: false,
	startTime: 0,
	elapsed: 0,
};

const slice = createSlice({
	name: "async",
	initialState,
	reducers: {
		animationTick(state) {
			state.quizSliderAnimation += 1;
			state.elapsed = Date.now() - state.startTime;
		},
		startGuessAnimation(state) {
			state.quizSliderAnimation = 0;
			state.startTime = Date.now();
		},
		endGuessAnimation(state) {
			state.quizSliderAnimation = 0;
			state.elapsed = 0;
		},
	},
});

export const { animationTick, startGuessAnimation, endGuessAnimation } =
	slice.actions;
export default slice.reducer;

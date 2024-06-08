import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	quizSliderIsAnimating: false,
};

const slice = createSlice({
	name: "async",
	initialState,
	reducers: {
		startGuessAnimation(state) {
			state.quizSliderIsAnimating = true;
		},
		endGuessAnimation(state) {
			state.quizSliderIsAnimating = false;
		},
	},
});

export const { startGuessAnimation, endGuessAnimation } = slice.actions;
export default slice.reducer;

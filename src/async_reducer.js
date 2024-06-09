import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	quizSliderAnimation: false,
};

const slice = createSlice({
	name: "async",
	initialState,
	reducers: {
		startGuessAnimation(state) {
			console.log("startQuizSliderAnimation");
			state.quizSliderAnimation = true;
		},
		endGuessAnimation(state) {
			console.log("endQuizSliderAnimation");
			state.quizSliderAnimation = false;
		}
	},
});

export const { startGuessAnimation, endGuessAnimation } = slice.actions;
export default slice.reducer;

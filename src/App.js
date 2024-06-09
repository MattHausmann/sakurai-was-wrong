// App.js
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import { gameIdMap as games } from "./consts";
import GameSelect from "./GameSelect";
import MatchupContainer from "./MatchupContainer";
import MatchupSlider from "./MatchupSlider";
import ScoreDisplay from "./ScoreDisplay";
import "./App.css";

const App = () => {
	const dispatch = useDispatch();
	const { quizMode, quizResults } = useSelector((state) => state.main);
	const dialogRef = useRef();

	return (
		<div className="app-container">
			<div className="app-header">
				<button
					id="settingsButton"
					onClick={() => dialogRef.current.showModal()}
				>
					<i className="fa fa-cog"></i>
				</button>
				<dialog ref={dialogRef}>
					<button onClick={() => dialogRef.current.close()}>
						<i className="fa fa-close"></i>
					</button>
					<GameSelect games={games} />
					<MatchupSlider />
				</dialog>
			</div>
			<div className="app-content">
				<div className="left-column">
					<Switch
						onChange={(e) => {
							dispatch({ type: "toggleQuizMode", val: e.target.checked });
						}}
						value={quizMode}
					/>
					<MatchupContainer quizMode={quizMode} />
				</div>
				<div className="right-column" >
					<ScoreDisplay />
				</div>
			</div>
		</div>
	);
};

export default App;

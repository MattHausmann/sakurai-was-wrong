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
	// Define your list of games (you can add more games here)

	const dispatch = useDispatch();
	const { quizMode, quizResults } = useSelector((state) => state);

	const rightColumnRef = useRef(null);

	const dialogRef = useRef();

	useEffect(() => {
		if (rightColumnRef.current) {
			rightColumnRef.current.scrollTo({
				top: rightColumnRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [quizResults]);

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
					<MatchupSlider value={1000} />
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
				<div className="right-column" ref={rightColumnRef}>
					<ScoreDisplay />
				</div>
			</div>
		</div>
	);
};

export default App;

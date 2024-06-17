// App.js
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "@mui/material/Switch";
import { gameIdMap as games } from "./consts";
import GameSelect from "./GameSelect";
import MatchupContainer from "./MatchupContainer";
import MatchupSlider from "./MatchupSlider";
import ScoreDisplay from "./ScoreDisplay";
import MatchupScoreDisplay from "./MatchupScoreDisplay";

import "./App.css";

const App = () => {
	const dispatch = useDispatch();
	const { quizMode, quizResults } = useSelector((state) => state.main);
	const dialogRef = useRef();

	useEffect(() => {
		if (rightColumnRef.current) {
			rightColumnRef.current.scrollTo({
				top: rightColumnRef.current.scrollHeight,
				behavior: "smooth",
			});
		}
	}, [quizResults]);
	
	useEffect(()=>{document.title = 'Sakurai Was Wrong'},[]);

	return (
		<div className="app-container">
			<div className="app-header">
			<br />
			<br />
			<br />
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
					<span>Browse Mode</span>
					<Switch
						onChange={(e) => {
							dispatch({ type: "toggleQuizMode", val: e.target.checked });
						}}
						value={quizMode}
					/>
					<span>Quiz Mode</span>
					<MatchupContainer quizMode={quizMode} />
				</div>
				<div className="right-column" ref={rightColumnRef}>
					<MatchupScoreDisplay />
					<ScoreDisplay />
				</div>
			</div>
		</div>
	);
};

export default App;

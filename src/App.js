// App.js
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameSelect from "./GameSelect";
import MatchupContainer from "./MatchupContainer";
import MatchupSlider from "./MatchupSlider";
import ScoreDisplay from "./ScoreDisplay";
import Switch from "@mui/material/Switch";

import "./App.css";

const App = () => {
	// Define your list of games (you can add more games here)
	const games = [
		{ id: "1", name: "Melee" },
		{ id: "1386", name: "Ultimate" },
	];

	const dispatch = useDispatch();
	const { quizMode, quizResults } = useSelector((state) => state);

	const [videogameId, setVideogameId] = useState("1");
	const rightColumnRef = useRef(null);

	const dialogRef = useRef();

	const openDialog = () => {
		dialogRef.current.showModal();
	};

	const handleGameSelect = (gameId) => {
		setVideogameId(gameId);
	};

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
					<MatchupContainer videogameId={videogameId} quizMode={quizMode} />
				</div>
				<div className="right-column" ref={rightColumnRef}>
					<ScoreDisplay />
				</div>
			</div>
		</div>
	);
};

export default App;

// App.js
import React, { useState } from 'react';
import GameSelect from './GameSelect';
import Matchup from './Matchup';
import ScoreDisplay from './ScoreDisplay';
import OverlayComponent from './OverlayComponent';

import './store.js';
import './App.css';

console.log('in App.js');
const App = () => {
	// Define your list of games (you can add more games here)
	const games = [
		{ id: "1", name: 'Melee' },
		{ id: "1386", name: 'Ultimate' }
	];
  
	const [videogameId, setVideogameId] = useState("1");

	const handleGameSelect = (gameId) => {
		setVideogameId(gameId);
	};
	

	// Other logic for handling character display and matchup
	return (
		<div className="app-container">
			<div className="left-column">
				<GameSelect games={games} videogameId={videogameId} selectGame={handleGameSelect} />
				<Matchup videogameId={videogameId} quizMode={false} />
			</div>
			<div className="right-column">
				<ScoreDisplay score={100} />
			</div>
			
		</div>
		
	);
};

export default App;
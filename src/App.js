// App.js
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import GameSelect from "./GameSelect";
import MatchupContainer from "./MatchupContainer";
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
  const quizMode = useSelector((state) => state.quizMode);

  const [videogameId, setVideogameId] = useState("1");

  const handleGameSelect = (gameId) => {
    setVideogameId(gameId);
  };

  // Other logic for handling character display and matchup
  return (
    <div className="app-container">
      <div className="left-column">
        <GameSelect
          games={games}
          videogameId={videogameId}
          selectGame={handleGameSelect}
        />
        <Switch
          onChange={(e) => {
            dispatch({ type: "toggleQuizMode", val: e.target.checked });
          }}
          value={quizMode}
        />
        <MatchupContainer videogameId={videogameId} quizMode={quizMode} />
      </div>
      <div className="right-column">
        <ScoreDisplay score={100} />
      </div>
    </div>
  );
};

export default App;

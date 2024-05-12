// src/components/GameSelect.js
import React from "react";
import GameButton from "./GameButton"; // Import the GameButton component

const GameSelect = ({ games, videogameId, selectGame }) => {
  return (
    <div className="game-select">
      {games.map((game) => (
        <GameButton
          key={game.id}
          gameId={game.id}
          gameName={game.name}
          isSelected={videogameId === game.id}
          onClick={selectGame}
          text={game.id}
        />
      ))}
    </div>
  );
};

export default GameSelect;

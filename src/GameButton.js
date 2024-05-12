// GameButton.js
import React from 'react';

const GameButton = ({ gameId, gameName, isSelected, onClick }) => {
	return (
		<button
			className={`game-button ${isSelected ? 'selected' : ''}`}
			onClick={() => onClick(gameId)}
		>
			<img
				src={`./characters/${gameId}/${isSelected ? 'selected' : 'unselected'}.png`}
				alt={gameName}
				width="130"
				height="48"
			/>
		</button>
	);
};

export default GameButton;

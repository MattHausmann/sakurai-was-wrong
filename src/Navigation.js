import React from 'react';

const Navigation = ({videogameId, leftChar, rightChar, orderBy, quizMode}) => {

	return <div className="navigation">
		<div className = "navButtons">
			<button id="previous">Previous</button>
			<button id="next">Next</button>
		</div>
		<div className = "getMatchup"><button id="matchup-button">Get Matchup</button></div>
	</div>
};

export default Navigation;
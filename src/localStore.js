import { alphabetize } from "./utils";

const updateSeenMatchups = (matchup) => {
	let seenMatchups = JSON.parse(localStorage.getItem("seenMatchups")) || {};
	let alphabetical = alphabetize(matchup.left, matchup.right);

	if (!seenMatchups[matchup.videogameId]) {
		seenMatchups[matchup.videogameId] = {
			[alphabetical[0]]: { [alphabetical[1]]: true },
		};
	} else {
		if (!seenMatchups[matchup.videogameId][alphabetical[0]]) {
			seenMatchups[matchup.videogameId][alphabetical[0]] = {};
		}
		seenMatchups[matchup.videogameId][alphabetical[0]][alphabetical[1]] = true;
	}

	localStorage.setItem("seenMatchups", JSON.stringify(seenMatchups));
};

const countTotalSeen = () => {
	let seenMatchups = JSON.parse(localStorage.getItem("seenMatchups")) || {};
	let total = 0;

	for (let game in seenMatchups) {
		for (let left in seenMatchups[game]) {
			total += Object.keys(seenMatchups[game][left]).length;
		}
	}

	return total;
};

export { updateSeenMatchups, countTotalSeen };

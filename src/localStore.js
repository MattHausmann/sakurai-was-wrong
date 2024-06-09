import { alphabetize } from "./utils";

const updateSeenMatchups = (matchup) => {
let seenMatchups = JSON.parse(localStorage.getItem("seenMatchups")) || {};
let alphabetical= alphabetize(matchup.left, matchup.right);

if (!seenMatchups[matchup.videogameId]) {
	seenMatchups[matchup.videogameId] = {[alphabetical[0]]: {[alphabetical[1]]: true}};
} else {
	if (!seenMatchups[matchup.videogameId][alphabetical[0]]) {
		seenMatchups[matchup.videogameId][alphabetical[0]] = {};
	}
	seenMatchups[matchup.videogameId][alphabetical[0]][alphabetical[1]] = true;
}

let totalSeen = seenMatchups[matchup.videogameId][alphabetical[0]].size;

localStorage.setItem("seenMatchups", JSON.stringify(seenMatchups));

}

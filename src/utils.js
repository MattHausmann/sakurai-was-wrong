function alphabetize(left, right) {
	return [left, right].sort((l, r) => l.localeCompare(r));
}
export { alphabetize };

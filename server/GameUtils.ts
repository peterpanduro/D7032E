import { BoggleGameModeInterface } from "./GameModes/BoggleGameMode.ts";

export const shuffle = <T>(a: T[]): T[] => {
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};

export const rollAndPlaceDice = (dice: string[][]): string[][] => {
	const size = Math.sqrt(dice.length);
	const returnDice: string[][] = [];
	const shuffledDice = shuffle(dice!);
	for (let i = 0; i < size; i++) {
		returnDice[i] = [];
		for (let j = 0; j < size; j++) {
			const die = shuffledDice.pop();
			const side = Math.floor(Math.random() * 6);
			returnDice[i][j] = die![side];
		}
	}
	return returnDice;
};

export const sortFunc = (
	gameMode: BoggleGameModeInterface,
	a: string[],
	b: string[]
): number => {
	return gameMode.calculateScore(b) - gameMode.calculateScore(a);
};

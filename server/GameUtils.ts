import { BoggleGameModeInterface } from "./GameModes/BoggleGameMode.ts";
import Die from "./Die.ts";

/**
 * Shuffle an array
 * @param a Array to shuffle
 * @returns Shuffled array
 */
export const shuffle = <T>(a: T[]): T[] => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/**
 * 
 * @param dice An array containing arrays of possible dice outcomes.
 * I.e [["1", "2", "3", "4", "5", "6"], ["1", "2", "3", "4", "5", "6"], ...]
 * @returns A Boggle board. A Boggle board is a two-dimensional array with
 * letters (or numbers) in a "square" size
 */
export const rollAndPlaceDice = (dice: Die[]): string[][] => {
  const size = Math.floor(Math.sqrt(dice.length));
  const returnDice: string[][] = [];
  const shuffledDice = shuffle(dice);
  for (let i = 0; i < size; i++) {
    returnDice[i] = [];
    for (let j = 0; j < size; j++) {
      const die = shuffledDice.pop()!;
      returnDice[i][j] = die.getUpSide();
    }
  }
  return returnDice;
};

/**
 * Sorting function using calculateScore from GameMode
 * @param gameMode The game mode used for sorting.
 * This sorting using the game modes calculateScore function
 * @param a Comparison object a
 * @param b Comparison object b
 */
export const sortFunc = (
  gameMode: BoggleGameModeInterface,
  a: string[],
  b: string[],
): number => {
  return gameMode.calculateScore(b) - gameMode.calculateScore(a);
};

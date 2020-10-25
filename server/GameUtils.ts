import {
  BoggleGameModeInterface,
  Foggle,
} from "./GameModes/BoggleGameMode.ts";
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

/**
 * Find all words in a Boggle board
 * @param boggle 2-dimensional Boggle board
 */
export const findAllWordsInBoard = async (
  boggle: string[][],
  gameMode: BoggleGameModeInterface,
  //   timeout: number,
): Promise<Set<string>> => {
  return new Promise(async (resolve) => {
    if (gameMode instanceof Foggle) return resolve(new Set([]));
    const wordlist = await getWordlistFromPath(
      "server/CollinsScrabbleWords2019.txt",
    );
    const valid = findAllPossibleWordCombinations(boggle, wordlist);
    resolve(valid);
  });
};

const getWordlistFromPath = async (path: string): Promise<Set<string>> => {
  return new Promise((resolve) => {
    const decoder = new TextDecoder("utf8");
    const data = Deno.readFileSync(path);
    const text = decoder.decode(data).trim().replace("\r", "");
    const array = text.split("\n");
    resolve(new Set(array));
  });
};

const findAllPossibleWordCombinations = async (
  boggle: string[][],
  wordlist: Set<string>,
): Promise<Set<string>> => {
  return new Promise((resolve) => {
    const size = boggle.length;
    let foundWords: Set<string> = new Set();
    let currentRow = 0;
    let currentColumn = 0;

    const findAllWordsInBoard = () => {
      // Create two-dimensional array with booleans to assign visited
      const size = boggle.length;
      let visited: boolean[][] = [];
      for (let i = 0; i < size; i++) {
        visited[i] = [];
      }

      if (currentColumn === size) {
        currentColumn = 0;
        currentRow++;
      }
      if (currentRow === size) {
        resolve(foundWords);
        return;
      }
      findWordsUtil(visited, currentRow, currentColumn, "");
      currentColumn++;

      let currentString = "";
      setTimeout(() => {
        findAllWordsInBoard();
      }, 100);
    };

    const findWordsUtil = (
      visited: boolean[][],
      i: number,
      j: number,
      currentString: string,
    ) => {
      visited[i][j] = true;
      let newString = currentString + boggle[i][j];

      if (wordlist.has(newString)) {
        foundWords.add(newString);
      }

      for (let row = i - 1; row <= i + 1 && row < size; row++) {
        for (let col = j - 1; col <= j + 1 && col < size; col++) {
          if (row >= 0 && col >= 0 && !visited[row][col]) {
            findWordsUtil(visited, row, col, newString);
          }
        }
      }

      newString = newString.slice(0, -1);
      visited[i][j] = false;
    };
    findAllWordsInBoard();
  });
};

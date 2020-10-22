/**
 * This class contains interface for Boggle game modes.
 * Also an abstract Boggle class that should cover most
 * use cases.
 * In addition an abstract Foggle class that basically
 * only overrides the verify function.
 * 
 * Most classes that extends these classes probably
 * only defines dice values and amounts.
 */

export interface BoggleGameModeInterface {
  dice: string[][];
  generous: boolean;
  calculateScore(list: string[]): number;
  verify(word: string): boolean;
  canPlay(word: string, boggle: string[][], generous: boolean): boolean;
}

export abstract class Boggle implements BoggleGameModeInterface {
  abstract dice: string[][];
  generous;
  private wordlist?: string[];

  constructor(generous = false) {
    this.generous = generous;
  }

  calculateScore = (list: string[]) => {
    var score = 0;
    list.forEach((item) => {
      if (item.includes("=")) item = item.replace(/[^0-9]/gm, "");
      if (item.length == 3 || item.length == 4) score += 1;
      if (item.length == 5) score += 2;
      if (item.length == 6) score += 3;
      if (item.length == 7) score += 5;
      if (item.length > 7) score += 11;
    });
    return score;
  };

  verify = (word: string): boolean => {
    if (!this.wordlist) {
      const decoder = new TextDecoder("utf8");
      const data = Deno.readFileSync("server/CollinsScrabbleWords2019.txt");
      const text = decoder.decode(data).trim().replace("\r", "");
      this.wordlist = text.split("\n");
    }
    return this.wordlist.includes(word.toUpperCase());
  };

  /**
 * Find word in Boogle board.
 * A Boggle board is a two-dimensional array with letters (or numbers)
 * @param word The word to serach for
 * @param boggle The Boggle board
 * @param generous Allow using same dice multiple times
 * @returns True if Boogle board contains the word
 */
  canPlay = (
    word: string,
    boggle: string[][],
    generous = false,
  ): boolean => {
    const size = boggle.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const found = this.findWordFromIndex(word, boggle, generous, [y, x]);
        if (found) return true;
      }
    }
    return false;
  };

  /**
   * 
   * @param word The word to serach for
   * @param boggle The Boggle board
   * @param generous Allow using same dice multiple times
   * @param currentIndex Current die to try for append
   * @param currentWord The current found pre-word
   * @param visited Boolean representation of visited dice on the Boggle board
   * @returns True if Boogle board contains the word from starting index
   */
  private findWordFromIndex = (
    word: string,
    boggle: string[][],
    generous = false,
    currentIndex: [number, number] = [0, 0],
    currentWord: string = "",
    visited: boolean[][] = [],
  ): boolean => {
    const y = currentIndex[0];
    const x = currentIndex[1];
    const size = boggle.length;
    let nextWord = (currentWord + boggle[x][y]).toUpperCase();
    // Generate visited letters table
    if (!visited[0]) {
      for (let i = 0; i < size; i++) {
        visited[i] = [];
      }
    }
    // Return false if word doesn't begin correctly
    if (!word.startsWith(nextWord)) {
      // Make sure Qu works as Q
      nextWord = nextWord.replace("QU", "Q");
      if (!word.startsWith(nextWord)) {
        return false;
      }
    }
    // If word is same, return true
    if (nextWord === word) {
      return true;
    }
    // Fill visited table if generous game is not set
    if (!generous) {
      visited[y][x] = true;
    }
    // Traverse each adjecant row and column not outside of boggle table
    for (
      let row = (y - 1 >= 0 ? y - 1 : 0);
      row < size && row <= y + 1;
      row++
    ) {
      for (
        let column = (x - 1 >= 0 ? x - 1 : 0);
        column < size && column <= x + 1;
        column++
      ) {
        // Don't use the same die again
        if ((row != y || column != x)) {
          // Don't use visited dice (only fills when generous game mode is false)
          if (!visited[row][column]) {
            // Recursive call for next letter. We only care about when true
            const result = this.findWordFromIndex(
              word,
              boggle,
              generous,
              [row, column],
              nextWord,
              visited,
            );
            if (result === true) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };
}

export abstract class Foggle extends Boggle {
  verify = (word: string): boolean => {
    return eval(word.replace("=", "==="));
  };

  canPlay = () => {
    return true;
  };
}

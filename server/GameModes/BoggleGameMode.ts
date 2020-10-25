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

import Die from "../Die.ts";

export interface BoggleGameModeInterface {
  readonly dice: Die[];
  settings: Settings;
  calculateScore(list: string[]): number;
  verify(word: string): boolean;
  canPlay(word: string, boggle: string[][]): boolean;
  add(word: string): boolean;
}

export class Settings {
  generous;
  battle;
  timer;
  constructor(generous: boolean = false, battle: boolean = false, timer = 60) {
    this.generous = generous;
    this.battle = battle;
    this.timer = timer;
  }
}

export abstract class Boggle implements BoggleGameModeInterface {
  abstract dice: Die[];
  settings;
  private wordlist?: string[];
  private playedWords: string[] = [];

  constructor(settings: Settings = new Settings()) {
    this.settings = settings;
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
 * @returns True if Boogle board contains the word
 */
  canPlay = (
    word: string,
    boggle: string[][],
  ): boolean => {
    const size = boggle.length;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const found = this.findWordFromIndex(word, boggle, [y, x]);
        if (found) return true;
      }
    }
    return false;
  };

  /**
   * 
   * @param word The word to serach for
   * @param boggle The Boggle board
   * @param currentIndex Current die to try for append
   * @param currentWord The current found pre-word
   * @param visited Boolean representation of visited dice on the Boggle board
   * @returns True if Boogle board contains the word from starting index
   */
  private findWordFromIndex = (
    word: string,
    boggle: string[][],
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
    if (!this.settings.generous) {
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

  add = (word: string): boolean => {
    if (this.settings.battle) {
      if (this.playedWords.includes(word)) {
        return false;
      }
      this.playedWords.push(word);
    }
    return true;
  };
}

export abstract class Foggle extends Boggle {
  verify = (word: string): boolean => {
    // Search for any occurence of non-numeric or
    // more than one +-*/= in a row
    if (word.match(/([^0-9])([\-\+\*\/\=])/)) {
      return false;
    }
    return eval(word.replace("=", "==="));
  };

  canPlay = () => {
    return true;
  };
}

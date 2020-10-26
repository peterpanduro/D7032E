/**
 * The Game object manages the Game and its state.
 * Most of the functionality is implemented in GameUtils to separate
 * state from more easily testable units.
 * The GameMode class is also interesting to understand low level
 * things regarding gameplay.
 * 
 * To create predictability a State enum defines the state flow.
 * Not startable (not enough players) => Not started (But startable) =>
 * => Started => Ended => Not startable...
 */

import Player from "./Player.ts";
import {
  BoggleGameModeInterface,
  Settings,
} from "./GameModes/BoggleGameMode.ts";
import {
  findAllWordsInBoard,
  rollAndPlaceDice,
  sortFunc,
} from "./GameUtils.ts";
import { printBoggle } from "../common/Utils.ts";
import Boggle16 from "./GameModes/Boggle16.ts";
import Boggle25 from "./GameModes/Boggle25.ts";
import Foggle16 from "./GameModes/Foggle16.ts";

export enum State {
  SETTINGS = 1,
  GAME_NOT_STARTED = 2,
  GAME_STARTED = 3,
  GAME_ENDED = 4,
}

export default class Game {
  players: Array<Player> = [];
  gameMode?: BoggleGameModeInterface;
  settings = new Settings();
  private state = State.GAME_NOT_STARTED;
  private validWords: Set<string> = new Set();

  getState = () => {
    return this.state;
  };

  constructor() {
    this.restart();
  }

  private rollDice = (): string[][] => {
    if (!this.gameMode) throw new Error("Game mode not selected");
    return rollAndPlaceDice([...this.gameMode.dice]); // Copy of dice
  };

  private loadValidWords = async (
    boggle: string[][],
    gameMode: BoggleGameModeInterface,
  ): Promise<Set<string>> => {
    this.validWords = new Set();
    return new Promise((resolve) => {
      resolve(findAllWordsInBoard(boggle, gameMode));
    });
  };

  join = (player: Player) => {
    if (this.state === State.GAME_STARTED) {
      throw new Error("Game already in progress");
      // FEATURE: Maybe add to a queue?
    }
    this.players.push(player);
    if (this.players.length > 1) {
      this.state = State.GAME_NOT_STARTED;
    }
    const message = "There are " + this.players.length +
      " players in this game";
    console.log(message);
    this.players.forEach((player) => {
      player.sendMessage(message);
    });
  };

  playWord = (word: string, boggle: string[][]): boolean => {
    return this.gameMode!.canPlay(word, boggle);
  };

  /**********************************************
   * 
   * State changing functions
   * 
   */

  start = (gameMode: BoggleGameModeInterface) => {
    if (this.state !== State.GAME_NOT_STARTED) {
      console.log("Game is not ready for start");
      return;
    }
    if (this.players.length < 2) {
      console.log("Not enough players");
      return;
    }
    this.state = State.GAME_STARTED;

    this.gameMode = gameMode;
    const boggle = this.rollDice();
    this.players.forEach((player) => {
      player.boggle = boggle;
      player.sendMessage(printBoggle(boggle));
    });
    let timer = this.settings.timer;
    const countdown = setInterval(async () => {
      console.log(`${timer} seconds left`);
      if (timer === 0) {
        clearInterval(countdown);
        this.end();
      }
      timer--;
    }, 1000);
    this.loadValidWords(boggle, gameMode).then((result) => {
      this.validWords = result;
    });
  };

  private end = () => {
    if (this.state !== State.GAME_STARTED) {
      console.log("Game is not started");
      return;
    }
    this.state = State.GAME_ENDED;

    this.players = this.players.sort((a, b) => {
      return sortFunc(this.gameMode!, a.getWordlist(), b.getWordlist());
    });
    this.players.forEach((player, index) => {
      player.sendMessage(
        "You ended up in place " + (index + 1) + " with " +
          this.gameMode?.calculateScore(player.getWordlist()) + " points.\n" +
          "You used the words " + player.getWordlist(),
      );
    });
    this.print();
  };

  restart = () => {
    if (this.state === State.GAME_STARTED) {
      console.log("Can't restart current game");
      return;
    }
    this.state = State.GAME_NOT_STARTED;

    this.players.forEach((player) => {
      player.resetWordlist();
    });
    this.print();
  };

  /**********************************************
   * 
   * MESSAGES
   * 
   */

  /**
   * Collect messages from Console
   * @param message 
   */
  message = (message: string): void => {
    if (this.state === State.GAME_NOT_STARTED) {
      switch (message) {
        case "1":
          this.start(new Boggle16(this.settings));
          break;
        case "2":
          this.start(new Boggle25(this.settings));
          break;
        case "3":
          this.start(new Foggle16(this.settings));
          break;
        case "4":
          this.state = State.SETTINGS;
          break;
        case "!":
          Deno.exit();
        default:
          console.log("Unknown command");
      }
    } else if (this.state === State.SETTINGS) {
      switch (message.substr(0, 1)) {
        case "1":
          this.settings.generous = !this.settings.generous;
          break;
        case "2":
          this.settings.battle = !this.settings.battle;
          break;
        case "3":
          const sec = message.substr(2, message.length - 2);
          const parsedSec = Number(sec);
          if (isNaN(parsedSec) || parsedSec === 0) {
            console.log(
              "You need to provide a number in the format 3[space]number",
            );
            break;
          }
          this.settings.timer = parsedSec;
          break;
        case "4":
          this.state = State.GAME_NOT_STARTED;
          break;
        default:
          console.log("Unknown command");
      }
    } else if (this.state === State.GAME_ENDED) {
      switch (message) {
        case "1":
          this.printScoreboard();
          break;
        case "2":
          this.printValidWords();
          break;
        case "3":
          this.restart();
          break;
        case "!":
          Deno.exit();
        default:
          console.log("Unknown command");
      }
    }
    this.print();
  };

  /**********************************************
   * 
   * PRINTING
   * 
   */

  private print = (state: State = this.state) => {
    switch (state) {
      case State.SETTINGS:
        this.printSettings();
        break;
      case State.GAME_NOT_STARTED:
        this.printNewGame();
        break;
      case State.GAME_STARTED:
        break;
      case State.GAME_ENDED:
        this.printPostGame();
        break;
      default:
        console.log("Trying to print unknown state");
    }
  };

  private printValidWords = () => {
    if (!this.validWords) {
      console.log(
        "Can't print all valid words right now. Maybe it is still calculating?",
      );
      return;
    }
    const sorted = [...this.validWords].sort((a, b) => {
      return b.length - a.length;
    });
    sorted.forEach((word) => {
      console.log(word);
    });
  };

  private printScoreboard = () => {
    this.players.forEach((player, index) => {
      console.log(
        `Placement ${index + 1}\n${player.getName()}\nScore: ${
          this.gameMode?.calculateScore(player.getWordlist())
        }\n`,
      );
    });
  };

  private printNewGame = () => {
    const menu = "**************************************\n" +
      "* Menu:                              *\n" +
      "* [1] Play standard Boggle           *\n" +
      "* [2] Play large Boggle              *\n" +
      "* [3] Play Foggle                    *\n" +
      "* [4] Settings                       *\n" +
      "* [!] Quit                           *\n" +
      "**************************************\n";
    console.log(menu);
  };

  private printPostGame = () => {
    const menu = "**************************************\n" +
      "* Menu:                              *\n" +
      "* [1] Print scoreboard               *\n" +
      "* [2] Print all words                *\n" +
      "* [3] New game                       *\n" +
      "* [!] Quit                           *\n" +
      "**************************************\n" +
      this.players[0].getName() + " was the winner!";
    console.log(menu);
  };

  private printSettings = () => {
    const menu = "**************************************\n" +
      "* Settings:\n" +
      `* [1] Generous: ${this.settings.generous}\n` +
      `* [2] Battle Mode: ${this.settings.battle}\n` +
      `* [3] Timer: ${this.settings.timer}\n` +
      "* [4] Save\n" +
      "*****************************\n";
    console.log(menu);
  };
}

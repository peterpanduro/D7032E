/**
 * The Game object manages the Game and its state.
 * Most of the functionality is implemented in GameUtils to separate
 * state from more easily testable units.
 * 
 * To create predictability a State enum defines the state flow.
 * Not startable (not enough players) => Not started (But startable) =>
 * => Started => Ended => Not startable...
 */

import Player from "./Player.ts";
import { BoggleGameModeInterface } from "./GameModes/BoggleGameMode.ts";
import { rollAndPlaceDice, sortFunc } from "./GameUtils.ts";
import { printBoggle } from "../common/Utils.ts";
import Boggle16 from "./GameModes/Boggle16.ts";
import Foggle16 from "./GameModes/Foggle16.ts";

export enum State {
  GAME_NOT_STARTABLE,
  GAME_NOT_STARTED,
  GAME_STARTED,
  GAME_ENDED,
}

export default class Game {
  players: Array<Player> = [];
  gameMode?: BoggleGameModeInterface;
  private state = State.GAME_NOT_STARTABLE;

  getState = () => {
    return this.state;
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
    const message = "There are " + this.players.length + " in this game";
    console.log(message);
    this.players.forEach((player) => {
      player.sendMessage(message);
    });
  };

  start = (gameMode: BoggleGameModeInterface, timer = 90) => {
    if (this.state !== State.GAME_NOT_STARTED) {
      throw new Error("Game is not ready for start");
    }
    this.state = State.GAME_STARTED;
    this.gameMode = gameMode;
    this.players.forEach((player) => {
      const boggle = this.rollDice();
      player.boggle = boggle;
      console.log(boggle);
      player.sendMessage(printBoggle(boggle));
    });
    const countdown = setInterval(async () => {
      console.log(`${timer} seconds left`);
      if (timer === 0) {
        clearInterval(countdown);
        this.end();
      }
      timer--;
    }, 1000);
  };

  private end = () => {
    if (this.state !== State.GAME_STARTED) {
      throw new Error("Game is not started");
    }
    this.state = State.GAME_ENDED;
    const sortedPlayers = this.players.sort((a, b) => {
      return sortFunc(this.gameMode!, a.getWordlist(), b.getWordlist());
    });
    sortedPlayers.forEach((player, index) => {
      console.log(
        `Placement ${index}: ${player.playerID}\t${
          this.gameMode?.calculateScore(player.getWordlist())
        }\n`,
      );
    });
  };

  restart = () => {
    if (this.state !== State.GAME_ENDED) {
      throw new Error("Game is not ended");
    }
    this.state = State.GAME_NOT_STARTABLE;
    const newPlayers = this.players;
    this.players = [];
    newPlayers.forEach((player) => {
      this.join(player);
    });
  };

  private rollDice = (): string[][] => {
    if (!this.gameMode) throw new Error("Game mode not selected");
    return rollAndPlaceDice([...this.gameMode.dice]);
  };

  playWord = (word: string, boggle: string[][]): boolean => {
    return this.gameMode!.canPlay(word, boggle, false);
  };

  message = (message: string): void => {
    if (this.state === State.GAME_NOT_STARTED) {
      switch (message) {
        case "1":
          this.start(new Foggle16(), 30);
          break;
        default:
      }
    }
  };
}

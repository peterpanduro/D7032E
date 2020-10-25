import { WebSocket } from "https://deno.land/std@0.74.0/ws/mod.ts";
import { v4 as uuidGen } from "https://deno.land/std@0.74.0/uuid/mod.ts";
import Game, { State } from "./Game.ts";

export default class Player {
  readonly playerID: string;
  readonly socket: WebSocket;
  readonly game: Game;
  private connected = true;
  private wordlist: string[];
  boggle?: string[][];
  name?: string;

  constructor(
    socket: WebSocket,
    game: Game,
    playerID?: string,
  ) {
    this.socket = socket;
    this.game = game;
    let uuid = "";
    if (!playerID) {
      uuid = uuidGen.generate();
    }
    this.playerID = playerID ? playerID : uuid;
    this.wordlist = [];
  }

  getConnected(): boolean {
    return this.connected;
  }

  getWordlist(): string[] {
    return this.wordlist;
  }

  getName(): string {
    return this.name ? this.name : this.playerID;
  }

  resetWordlist(): void {
    this.wordlist = [];
  }

  sendMessage(message: string) {
    if (!this.socket.isClosed) {
      this.socket.send(message as string);
    }
  }

  readMessage(message: string) {
    if (this.game.getState() === State.GAME_NOT_STARTED) {
      this.name = message;
      this.sendMessage("Your name is " + this.name);
    }
    if (this.game.getState() === State.GAME_STARTED) {
      if (!this.game.playWord(message, this.boggle!)) {
        this.sendMessage(message + " can not be played");
        return;
      }
      if (!this.game.gameMode?.verify(message)) {
        this.sendMessage(message + " is not a valid word");
        return;
      }
      if (this.wordlist.includes(message)) {
        this.sendMessage("Your wordlist already contains " + message);
      }
      if (!this.game.gameMode.add(message)) {
        this.sendMessage("The common wordlist already contains " + message);
      }
      this.wordlist.push(message);
    }
  }

  close() {
    this.connected = false;
    if (!this.socket.isClosed) {
      this.sendMessage("CLOSE SOCKET");
      this.socket.close();
    }
  }
}

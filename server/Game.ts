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
	sortByScore,
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
	private players: Array<Player> = [];
	public gameMode?: BoggleGameModeInterface;
	private settings = new Settings();
	private state = State.GAME_NOT_STARTED;
	private playableWords: Set<string> = new Set();

	constructor() {
		this.restart(); // Make sure state is reset when object is created.
	}

	/**********************************************
	 *
	 * Public methods
	 *
	 */

	public getState = () => {
		return this.state;
	};

	public join = (player: Player) => {
		if (this.state === State.GAME_STARTED) {
			throw new Error("Game already in progress");
			// FEATURE: Maybe add to a queue?
		}
		this.players.push(player);
		if (this.players.length > 1) {
			this.state = State.GAME_NOT_STARTED;
		}
		const message =
			"There are " + this.players.length + " players in this game";
		console.log(message);
		this.players.forEach((player) => {
			player.sendMessage(message);
		});
	};

	public playWord = (word: string, boggle: string[][]): boolean => {
		if (this.state !== State.GAME_STARTED) {
			console.log("Cannot play word when game is not started");
			return false;
		}
		return this.gameMode!.canPlay(word, boggle);
	};

	/**
	 * Collect messages from Console/Terminal
	 * @param message
	 */
	public recieveMessage = (message: string): void => {
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
							"You need to provide a number in the format 3[space]number"
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
					this.printPlayableWords();
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
	 * Private methods
	 *
	 */

	private loadPlayableWords = async (
		boggle: string[][],
		gameMode: BoggleGameModeInterface
	): Promise<Set<string>> => {
		this.playableWords = new Set();
		return new Promise((resolve) => {
			resolve(findAllWordsInBoard(boggle, gameMode));
		});
	};

	private start = (gameMode: BoggleGameModeInterface) => {
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
		const boggle = rollAndPlaceDice([...this.gameMode.dice]);
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
		this.loadPlayableWords(boggle, gameMode).then((result) => {
			this.playableWords = result;
		});
	};

	private end = () => {
		if (this.state !== State.GAME_STARTED) {
			console.log("Game is not started");
			return;
		}
		this.state = State.GAME_ENDED;

		this.players = this.players.sort((a, b) => {
			return sortByScore(this.gameMode!, a.getWordlist(), b.getWordlist());
		});
		this.players.forEach((player, index) => {
			player.sendMessage(
				"You ended up in place " +
					(index + 1) +
					" with " +
					this.gameMode?.calculateScore(player.getWordlist()) +
					" points.\n" +
					"You used the words " +
					player.getWordlist()
			);
		});
		this.print();
	};

	private restart = () => {
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
	 * PRINTING
	 *
	 */

	/**
	 * Helper method to print accurate info based on current state
	 * @param state _Optional:_ You can also provide a custom state if you want for some reason
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

	private printPlayableWords = () => {
		if (!this.playableWords) {
			console.log(
				"Can't print all valid words right now. Maybe it is still calculating?"
			);
			return;
		}
		const sorted = [...this.playableWords].sort((a, b) => {
			return b.length - a.length;
		});
		sorted.forEach((word) => {
			console.log(word);
		});
	};

	private printScoreboard = () => {
		this.players.forEach((player, index) => {
			console.log(
				`Placement ${
					index + 1
				}\n${player.getName()}\nScore: ${this.gameMode?.calculateScore(
					player.getWordlist()
				)}\n`
			);
		});
	};

	private printNewGame = () => {
		const menu =
			"**************************************\n" +
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
		const menu =
			"**************************************\n" +
			"* Menu:                              *\n" +
			"* [1] Print scoreboard               *\n" +
			"* [2] Print all words                *\n" +
			"* [3] New game                       *\n" +
			"* [!] Quit                           *\n" +
			"**************************************\n" +
			this.players[0].getName() +
			" was the winner!";
		console.log(menu);
	};

	private printSettings = () => {
		const menu =
			"**************************************\n" +
			"* Settings:\n" +
			`* [1] Generous: ${this.settings.generous}\n` +
			`* [2] Battle Mode: ${this.settings.battle}\n` +
			`* [3] Timer: ${this.settings.timer}\n` +
			"* [4] Save\n" +
			"*****************************\n";
		console.log(menu);
	};
}

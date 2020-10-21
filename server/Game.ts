import Player from "./Player.ts";
import { BoggleGameModeInterface } from "./GameModes/BoggleGameMode.ts";
import { rollAndPlaceDice, sortFunc } from "./GameUtils.ts";

enum State {
	NO_PLAYERS,
	ONE_PLAYER,
	GAME_NOT_STARTED,
	GAME_STARTED,
	GAME_ENDED,
}

export default class Game {
	players: Array<Player> = [];
	gameMode?: BoggleGameModeInterface;
	state = State.NO_PLAYERS;
	private timer: number = 0;

	constructor() {
		// BUG: This should exist in start(), but for some reason clearInterval exits Deno.
		// Therefore it is moved to the constructor to avoid creating setInterval
		// instances everytime a new game starts.
		const id = setInterval((): void => {
			if (this.timer > 0) {
				console.log(`${this.timer} seconds left`);
				this.timer--;
				this.end();
			}
		}, 1000);
	}

	join(player: Player) {
		if (this.state === State.GAME_STARTED) {
			throw new Error("Game already in progress");
			// FEATURE: Maybe add to a queue?
		}
		this.players.push(player);
		if (this.players.length === 1) {
			this.state = State.ONE_PLAYER;
		} else {
			this.state = State.GAME_NOT_STARTED;
		}
	}

	start(gameMode: BoggleGameModeInterface, timer = 90) {
		if (this.state !== State.GAME_NOT_STARTED) {
			throw new Error("Game is not ready for start");
		}
		this.gameMode = gameMode;
		this.timer = timer;
	}

	end() {
		if (this.state !== State.GAME_STARTED) {
			throw new Error("Game is not started");
		}
		console.log("The game is over");
		this.state = State.GAME_ENDED;
		const sortedPlayers = this.players.sort((a, b) => {
			return sortFunc(this.gameMode!, a.getWordlist(), b.getWordlist());
		});
		// TODO: TEST
		sortedPlayers.forEach((player, index) => {
			console.log(
				`Placement ${index}: ${
					player.playerID
				}\t${this.gameMode?.calculateScore(player.getWordlist())}\n`
			);
		});
	}

	rollDice(): string[][] {
		if (!this.gameMode) throw new Error("Game mode not selected");
		return rollAndPlaceDice(this.gameMode.dice);
	}
}

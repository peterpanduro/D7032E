import { WebSocket } from "https://deno.land/std@0.74.0/ws/mod.ts";
import { v4 as uuidGen } from "https://deno.land/std@0.74.0/uuid/mod.ts";
import { BoggleGameModeInterface } from "./GameModes/BoggleGameMode.ts";

export default class Player {
	readonly playerID: string;
	readonly socket: WebSocket;
	readonly game?: BoggleGameModeInterface;
	private connected = true;
	private wordlist: string[];

	constructor(socket: WebSocket, playerID?: string) {
		let uuid = "";
		if (!playerID) {
			uuid = uuidGen.generate();
		}
		this.playerID = playerID ? playerID : uuid;
		this.socket = socket;
		this.wordlist = [];
	}

	getConnected(): boolean {
		return this.connected;
	}

	getWordlist(): string[] {
		return this.wordlist;
	}

	sendMessage(message: string) {
		if (!this.socket.isClosed) {
			this.socket.send(message as string);
		}
	}

	readMessage(message: string) {
		console.log({ event: "readMessage", pid: this.playerID, message });
	}

	close() {
		this.connected = false;
		if (!this.socket.isClosed) {
			this.sendMessage("CLOSE SOCKET");
			this.socket.close();
		}
	}
}

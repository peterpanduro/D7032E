import { serve } from "https://deno.land/std@0.74.0/http/server.ts";
import {
	WebSocket,
	isWebSocketCloseEvent,
	acceptWebSocket,
} from "https://deno.land/std@0.74.0/ws/mod.ts";
import { stdin } from "../common/io.ts";
import Player from "./Player.ts";
import Game from "./Game.ts";

// Right now the Game works as a single global object (almost singleton).
// But it should be possible to transform to a multigame server
// without changing much (if anything) in the Game implementation.
let game: Game;

// One handleWebSocket is created for each connection (player)
const handleWebSocket = async (socket: WebSocket) => {
	// Create a player and join the game
	const player = new Player(socket, game);
	game.join(player);
	// Start listen for socket events
	try {
		for await (const event of socket) {
			if (typeof event === "string") {
				player.readMessage(event);
			} else if (isWebSocketCloseEvent(event)) {
				player.close();
			} else {
				console.error("Unsupported event type");
				player.sendMessage("Unsupported event");
			}
		}
	} catch (error) {
		console.error(error);
		if (!socket.isClosed) {
			await socket.close(1000).catch(console.error);
		}
	}
};

// Start HTTP-server and accept incoming socket connections
const startServer = async () => {
	if (import.meta.main) {
		const port = Deno.args[0] || "2048";
		console.log(`websocket server is running on :${port}`);
		game = new Game();
		for await (const request of serve(`:${port}`)) {
			const { conn, r: bufReader, w: bufWriter, headers } = request;
			acceptWebSocket({
				conn,
				bufReader,
				bufWriter,
				headers,
			})
				.then(handleWebSocket)
				.catch(async (error: any) => {
					console.error(`failed to accept websocket: ${error}`);
					await request.respond({ status: 400 });
				});
		}
	}
};

// Start listening for console input asyncronously
const listenForInput = async () => {
	for await (const input of stdin) {
		game.recieveMessage(input);
	}
};

// Start the server and listen for console input
startServer();
listenForInput();

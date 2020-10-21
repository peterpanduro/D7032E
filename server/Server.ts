import { serve } from "https://deno.land/std@0.74.0/http/server.ts";
import {
	WebSocket,
	isWebSocketCloseEvent,
	acceptWebSocket,
} from "https://deno.land/std@0.74.0/ws/mod.ts";
import Player from "./Player.ts";
import Game from "./Game.ts";
import Boggle16 from "./GameModes/Boggle16.ts";

const handleWebSocket = async (socket: WebSocket) => {
	const player = new Player(socket);
	try {
		for await (const event of socket) {
			if (typeof event === "string") {
				player.readMessage(event);
			} else if (isWebSocketCloseEvent(event)) {
				player.close();
			} else {
				console.error("Unsupported event type");
			}
		}
	} catch (error) {
		console.error(error);
		if (!socket.isClosed) {
			await socket.close(1000).catch(console.error);
		}
	}
};

const startServer = async () => {
	if (import.meta.main) {
		const port = Deno.args[0] || "2048";
		console.log(`websocket server is running on :${port}`);
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

const g = new Game();
g.start(new Boggle16(), 3);

//startServer();

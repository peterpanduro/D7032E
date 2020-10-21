import { stdin } from "../common/io.ts";

// Define socket IP address
const ipAddress = Deno.args[0] || "localhost";
let running = false;

// Socket connection
const socket = new WebSocket(`ws://${ipAddress}:2048`);
socket.onopen = () => {
	running = true;
	console.log("WebSocket ready!");
};
socket.onmessage = (messageEvent) => {
	console.log({ messageEvent });
	const data = messageEvent.data;
	if (data === "CLOSE SOCKET") {
		socket.close();
	}
};
socket.onclose = () => {
	console.log("WebSocket closed!");
	Deno.exit();
};
socket.onerror = (err) => console.error("WebSocket error:", err);

for await (const input of stdin) {
	if (socket.readyState) {
		socket.send(input);
	}
}

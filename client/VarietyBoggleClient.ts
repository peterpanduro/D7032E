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
  const data = messageEvent.data;
  if (data === "CLOSE SOCKET") {
    socket.close();
  }
  console.log(data);
};
socket.onclose = () => {
  console.log("WebSocket closed!");
  Deno.exit();
};
socket.onerror = (error) => {
  console.error("WebSocket error:", error);
  socket.close();
  Deno.exit();
};

for await (const input of stdin) {
  if (socket.readyState) {
    socket.send(input);
  }
}

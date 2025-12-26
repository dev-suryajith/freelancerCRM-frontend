import { io } from "socket.io-client";
// const socketPort="http://localhost:5000"
const socketPort = "https://freelancercrm-socket-io.onrender.com"

const socket = io(socketPort, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

export default socket;

import { Socket } from "socket.io";

export const connectionHandler = (socket: Socket) => {
  console.log(`Socket connected: ${socket.id}`);
};

export const disconnectionHandler = (socket: Socket) => {
  console.log(`Socket disconnected: ${socket.id}`);
};
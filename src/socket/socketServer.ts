import { Server, Socket } from "socket.io";

import { connectionHandler, disconnectionHandler } from "./handlers/connectionHandler";
import { addCoinsHandler, updatePlayerHandler } from "./handlers/playerHandler";
import { getPayoutHandler, getTargetPayoutHandler, updateTotalBetHandler, updateTotalPayoutHandler } from "./handlers/roomHandler";

export const socketServer = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    connectionHandler(socket);

    socket.on("updatePlayer", (data) => updatePlayerHandler(socket, data));
    socket.on("getPayout", (roomNumber) => getPayoutHandler(socket, roomNumber));
    socket.on("getTargetPayout", (roomNumber) => getTargetPayoutHandler(socket, roomNumber));
    socket.on("updateTotalBet", (data) => updateTotalBetHandler(socket, data));
    socket.on("updateTotalPayout", (data) => updateTotalPayoutHandler(socket, data));
    socket.on("addCoins", (data) => addCoinsHandler(socket, data));

    socket.on("disconnect", () => disconnectionHandler(socket));
  });
};
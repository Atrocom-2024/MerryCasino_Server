import { Server, Socket } from "socket.io";

import { connectionHandler, disconnectionHandler } from "./handlers/connectionHandler";
import { addCoinsHandler, updateBetHadnler, updatePlayerHandler } from "./handlers/playerHandler";
import { getPayoutHandler, getTargetPayoutHandler, updateTotalBetHandler, updateTotalPayoutHandler } from "./handlers/roomHandler";

export const socketServer = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    connectionHandler(socket);
 // 소켓에 연결 될 때 해당 룸에 user 카운팅 필요
    socket.on("updatePlayer", (data) => updatePlayerHandler(socket, data));
    socket.on("getPayout", (roomNumber) => getPayoutHandler(socket, roomNumber));
    socket.on("getTargetPayout", (roomNumber) => getTargetPayoutHandler(socket, roomNumber));
    socket.on("updateTotalBet", (data) => updateTotalBetHandler(socket, data));
    socket.on("updateTotalPayout", (data) => updateTotalPayoutHandler(socket, data));
    socket.on("addCoins", (data) => addCoinsHandler(socket, data));
    socket.on("updateBet", (data) => updateBetHadnler(socket, data));

    socket.on("disconnect", () => disconnectionHandler(socket));
  });
};
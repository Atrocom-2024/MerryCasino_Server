import { Server, Socket } from "socket.io";

import { connectionHandler, disconnectionHandler } from "./handlers/connectionHandler";
import { updatePlayerCoinsHandler } from "./handlers/playerHandler";
import { getRoomInfoHandler, joinRoomHandler, updateBetHadnler } from "./handlers/roomHandler";

export const socketServer = (io: Server): void => {
  io.on("connection", (socket: Socket) => {
    connectionHandler(socket);
    // 소켓에 연결 될 때 해당 룸에 user 카운팅 필요

    // test 이벤트
    socket.on("ping", (data) => {
      console.log('Ping received: ', data);
      socket.emit('pong', 'test received');
    });

    // player 관련
    socket.on("updatePlayerCoins", (data) => updatePlayerCoinsHandler(socket, data));
    
    // room 관련
    socket.on("joinRoom", (data) => joinRoomHandler(socket, data));
    socket.on("getRoomInfo", (data) => getRoomInfoHandler(socket, data));
    socket.on("updateBet", (data) => updateBetHadnler(socket, data));

    // 소켓 연결 종료
    socket.on("disconnect", () => disconnectionHandler(socket));
  });
};
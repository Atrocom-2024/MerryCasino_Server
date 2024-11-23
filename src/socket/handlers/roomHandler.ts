import { Socket } from "socket.io";

import { getRoomList } from "../../web/services/roomService";

interface Room {
  resultplusPercent: number;
  targetPayout: number;
  totalBet: number;
  totalPayout: number;
}

const roomList = getRoomList();

export const getPayoutHandler = (socket: Socket, roomNumber: number) => {
  console.log(`Fetching payout for room ${roomNumber}`);

  if (!roomList[roomNumber]) {
    socket.emit("getPayoutResponse", { error: "Room not found" });
    return;
  }

  socket.emit("getPayoutResponse", { resultplusPercent: roomList[roomNumber].resultplusPercent });
};

export const getTargetPayoutHandler = (socket: Socket, roomNumber: number) => {
  console.log(`Fetching target payout for room ${roomNumber}`);

  if (!roomList[roomNumber]) {
    socket.emit("getTargetPayoutResponse", { error: "Room not found" });
    return;
  }

  socket.emit("getTargetPayoutResponse", { targetPayout: roomList[roomNumber].targetPayout });
};

export const updateTotalBetHandler = (socket: Socket, data: { roomNumber: number; betCoin: number }) => {
  console.log(`Updating total bet for room ${data.roomNumber}`);

  if (!roomList[data.roomNumber]) {
    socket.emit("updateTotalBet", { error: "Room not found" });
    return;
  }

  roomList[data.roomNumber].totalBet += data.betCoin;
  socket.emit("updateTotalBet", { success: true, totalBet: roomList[data.roomNumber].totalBet });
};

export const updateTotalPayoutHandler = (socket: Socket, data: { roomNumber: number; payoutCoin: number }) => {
  console.log(`Updating total payout for room ${data.roomNumber}`);

  if (!roomList[data.roomNumber]) {
    socket.emit("updateTotalPayout", { error: "Room not found" });
    return;
  }

  roomList[data.roomNumber].totalPayout += data.payoutCoin;
  socket.emit("updateTotalPayout", { success: true, totalPayout: roomList[data.roomNumber].totalPayout });
};
import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";
import { Room } from "../../models/room";
import { RoomPlayer } from "../../models/roomPlayer";
import { calcPayout } from "../services/roomService";
import { getPlayer, getRoom, getRoomPlayer } from "../../utils/dataLoader";
import { emitError, emitSuccess, handleError } from "./responseHandler";
import { createRoomPlayer } from "../services/roomPlayerService";

export const joinRoomHandler = async (socket: Socket, data: JoinRoomFields) => {
  console.log("[socket] 룸 조인");

  if ((!data.roomId && data.roomId != 0) || !data.userId) {
    emitError(socket, "joinRoomResponse", 400, "Invalid roomId value in request body");
    return;
  }

  try {
    const roomRepository = MyDataSource.getRepository(Room);
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);

    const roomInfo = await getRoom(roomRepository, data.roomId);
    roomInfo.totalUser += 1;
    await roomRepository.save(roomInfo);

    const existingRoomPlayer = await roomPlayerRepository.findOneBy({ userId: data.userId, roomId: data.roomId });

    // 유저가 룸에 처음 접속했을 때
    if (!existingRoomPlayer) {
      // 룸 유저 테이블에 추가
      const savedRoomPlayer = await createRoomPlayer(roomPlayerRepository, data.userId, data.roomId);
      emitSuccess(socket, "joinRoomResponse", {
        status: 200,
        message: `Successfully joined ${data.roomId}.`,
        roomInfo,
        roomPlayerInfo: savedRoomPlayer,
      });
      return;
    }

    emitSuccess(socket, "joinRoomResponse", {
      status: 200,
      message: `Successfully joined ${data.roomId}.`,
      roomInfo,
      roomPlayerInfo: existingRoomPlayer
    });
    return;
  } catch (error) {
    handleError(socket, error, "joinRoomResponse");
    return;
  }
}

export const getRoomInfoHandler = async (socket: Socket, data: GetRoomFields) => {
  console.log("[socket] 룸 정보 요청");

  if (!data.roomId && data.roomId != 0) {
    emitError(socket, "getRoomInfoResponse", 400, "Invalid roomId value in request body");
    return;
  }

  try {
    const roomRepository = MyDataSource.getRepository(Room);
    const roomInfo = await getRoom(roomRepository, data.roomId);

    emitSuccess(socket, "getRoomInfoResponse", {
      status: 200,
      message: `Successfully fetched room ${data.roomId} info.`,
      roomInfo
    });
    return;
  } catch (error) {
    handleError(socket, error, "getRoomInfoResponse");
    return;
  }
}

export const updateBetHadnler = async (socket: Socket, data: UpdateBetFields) => {
  console.log("[socket] 배팅 요청");

  if (!data.userId || !data.roomId || !data.betAmount) {
    emitError(socket, "updateBetResponse", 400, "Invalid userId or coins value in request body");
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const roomRepository = MyDataSource.getRepository(Room);
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);

    const player = await getPlayer(playerRepository, data.userId);
    const roomInfo = await getRoom(roomRepository, data.roomId);
    const roomPlayer = await getRoomPlayer(roomPlayerRepository, data.userId, data.roomId);

    // 배팅 로직
    roomPlayer.betAmount -= data.betAmount;
    const calcField = {
      currentPayout: roomPlayer.currentPayout,
      targetPayout: roomInfo.targetPayout,
      totalBet: roomPlayer.betAmount,
      totalUser: roomInfo.totalUser,
      maxBet: roomInfo.maxBet,
      maxUser: roomInfo.maxUser
    }
    const updatedPayout = calcPayout(calcField);

    player.coins += data.betAmount;
    roomPlayer.currentPayout = updatedPayout;

    console.log(`현재 ${data.roomId}번 방의 payout: ${updatedPayout}`);

    // Save the updated data
    await playerRepository.save(player);
    await roomPlayerRepository.save(roomPlayer);

    emitSuccess(socket, "updateBetResponse", {
      status: 200,
      message: `Successfully updated ${data.betAmount} coins.`,
      updatedCoins: player.coins,
      updatedPayout: updatedPayout
    });
    return;
  } catch (error) {
    handleError(socket, error, "updateBetResponse");
    return;
  }
}

interface JoinRoomFields {
  roomId: number;
  userId: string;
}

interface GetRoomFields {
  roomId: number;
}

interface UpdateBetFields {
  userId: string;
  roomId: number;
  betAmount: number;
}

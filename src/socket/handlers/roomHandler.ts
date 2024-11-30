import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";
import { Room } from "../../models/room";
import { RoomPlayer } from "../../models/roomPlayer";
import { calcPayout } from "../services/roomService";
import { getPlayer, getRoom, getRoomPlayer } from "../../utils/dataLoader";

// TODO: 처음 조인할 때 payout이 제대로 반영되지 않는 문제 해결
export const joinRoomHandler = async (socket: Socket, data: JoinRoomFields) => {
  console.log("[socket] 룸 조인");

  if ((!data.roomId && data.roomId != 0) || !data.userId) {
    socket.emit("joinRoomResponse", {
      status: 400,
      message: "Invalid roomId value in request body",
    });
    return;
  }

  try {
    const roomRepository = MyDataSource.getRepository(Room);
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);

    const roomInfo = await getRoom(roomRepository, data.roomId);
    roomInfo.totalUser += 1;
    await roomRepository.save(roomInfo);

    // 룸 유저 테이블에 추가
    const existingRoomPlayer = await roomPlayerRepository.findOneBy({ userId: data.userId });

    if (!existingRoomPlayer) {
      const newRoomPlayer = new RoomPlayer();
      newRoomPlayer.userId = data.userId;
      newRoomPlayer.roomId = data.roomId;
      await roomPlayerRepository.save(newRoomPlayer); // 저장
    }

    socket.emit("joinRoomResponse", {
      status: 200,
      message: `Successfully joined ${data.roomId}.`,
      roomInfo
    });
  } catch (error) {
    console.error("Error in joinRoomHandler:", error);
    socket.emit("joinRoomResponse", {
      status: 500,
      message: "An error occurred while joining the room.",
    });
  }
}

export const getRoomInfoHandler = async (socket: Socket, data: GetRoomFields) => {
  console.log("[socket] 룸 정보 요청");

  if (!data.roomId && data.roomId != 0) {
    socket.emit("getRoomInfoResponse", {
      status: 400,
      message: "Invalid roomId value in request body",
    });
    return;
  }

  try {
    const roomRepository = MyDataSource.getRepository(Room);
    const roomInfo = await getRoom(roomRepository, data.roomId);

    socket.emit("getRoomInfoResponse", {
      status: 200,
      message: `Successfully fetched room ${data.roomId} info.`,
      roomInfo
    });
  } catch (error) {
    console.error("Error in getRoomInfoHandler:", error);
    socket.emit("getRoomInfoResponse", {
      status: 500,
      message: "An error occurred while fetching room info.",
    });
  }
}

export const updateBetHadnler = async (socket: Socket, data: UpdateBetFields) => {
  console.log("[socket] 배팅 요청");

  if (!data.userId || !data.roomId || !data.betAmount) {
    socket.emit("updateBetResponse", {
      status: 400,
      message: "Invalid userId or coins value in request body",
    });
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const roomRepository = MyDataSource.getRepository(Room);
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);

    const player = await getPlayer(playerRepository, data.userId);
    const roomInfo = await getRoom(roomRepository, data.roomId);
    const roomPlayer = await getRoomPlayer(roomPlayerRepository, data.userId);

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

    socket.emit("updateBetResponse", {
      status: 200,
      message: `Successfully updated ${data.betAmount} coins.`,
      updatedCoins: player.coins,
      updatedPayout: updatedPayout
    });
  } catch (error) {
    console.error("Error in updateBetHandler:", error);
    socket.emit("updateBetResponse", {
      status: 500,
      message: "An error occurred while updating the bet.",
    });
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

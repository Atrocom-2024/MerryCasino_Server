import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";
import { calcPayout } from "../services/roomService";
import { Room } from "../../models/room";

export const joinRoomHandler = async (socket: Socket, data: JoinRoomFields) => {
  console.log("[socket] 룸 조인");

  if (!data.roomId && data.roomId != 0) {
    socket.emit("joinRoomResponse", {
      status: 400,
      message: "Invalid roomId value in request body",
    });
    return;
  }

  try {
    const roomRepository = MyDataSource.getRepository(Room);
    const roomInfo = await roomRepository.findOneBy({ roomId: data.roomId });

    if (!roomInfo) {
      socket.emit("joinRoomResponse", {
        status: 404,
        message: "Room not fount"
      });
      return;
    }

    roomInfo.totalUser += 1;

    // Save the updated player data
    await roomRepository.save(roomInfo);

    socket.emit("joinRoomResponse", {
      status: 200,
      message: `Successfully joined ${data.roomId}.`,
      roomInfo
    });
  } catch (error) {
    console.error("Error fetch room info:", error);
    socket.emit("joinRoomResponse", {
      status: 500,
      message: "An error occurred while join room.",
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
    const roomInfo = await roomRepository.findOneBy({ roomId: data.roomId });

    if (!roomInfo) {
      socket.emit("getRoomInfoResponse", {
        status: 404,
        message: "Room not fount"
      });
      return;
    }

    socket.emit("getRoomInfoResponse", {
      status: 200,
      message: `Successfully fetched ${data.roomId} room info.`,
      roomInfo
    });
  } catch (error) {
    console.error("Error fetch room info:", error);
    socket.emit("getRoomInfoResponse", {
      status: 500,
      message: "An error occurred while fetching room info.",
    });
  }
}

export const updateBetHadnler = async (socket: Socket, data: UpdateBetFields) => {
  console.log("[socket] 배팅 요청");

  if (!data.playerId || !data.roomId || !data.betAmount) {
    socket.emit("updateBetResponse", {
      status: 400,
      message: "Invalid playerId or coins value in request body",
    });
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const player = await playerRepository.findOneBy({ id: data.playerId });

    if (!player) {
      socket.emit("updateBetResponse", {
        status: 404,
        message: "Player not found",
      });
      return;
    }

    player.coins += data.betAmount;
    const updatedPayout = await calcPayout(data.roomId);
    console.log(`현재 ${data.roomId}번 방의 payout: ${updatedPayout}`);

    // Save the updated player data
    await playerRepository.save(player);

    socket.emit("updateBetResponse", {
      status: 200,
      message: `Successfully updated ${data.betAmount} coins to player.`,
      updatedCoins: player.coins,
      updatedPayout: updatedPayout
    });
  } catch (error) {
    console.error("Error update coins to player:", error);
    socket.emit("updateBetResponse", {
      status: 500,
      message: "An error occurred while adding coins to the player.",
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
  playerId: string;
  roomId: number;
  betAmount: number;
}

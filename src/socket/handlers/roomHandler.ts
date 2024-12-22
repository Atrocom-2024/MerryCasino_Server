import { Socket } from "socket.io";

import { emitError, emitSuccess, handleError } from "./responseHandler";
import { increaseUserCountService, roomInfoService } from "../services/roomService";
import { createRoomPlayer, existingRoomPlayer, calcPayoutService } from "../services/roomPlayerService";

export const joinRoomHandler = async (socket: Socket, data: JoinRoomFields) => {
  console.log("[socket] 룸 조인");

  if ((!data.roomId && data.roomId != 0) || !data.userId) {
    emitError(socket, "joinRoomResponse", 400, "Invalid roomId value in request body");
    return;
  }

  try {
    increaseUserCountService(data.roomId);

    // 방에 소켓 추가
    socket.join(`room-${data.roomId.toString()}`);

    const existedRoomPlayer = await existingRoomPlayer(data.userId, data.roomId);

    // 유저가 룸에 처음 접속했을 때
    if (!existingRoomPlayer) {
      // 룸 유저 테이블에 추가
      const savedRoomPlayer = await createRoomPlayer(data.userId, data.roomId);

      // 같은 방의 사용자에게 데이터 전송
      socket.to(`room-${data.roomId.toString()}`).emit("roomPlayerAdd", {
        message: `Player joined the room.`,
      });

      emitSuccess(socket, "joinRoomResponse", {
        status: 200,
        message: `Successfully joined ${data.roomId}.`,
        roomPlayerInfo: savedRoomPlayer,
      });
      return;
    }

    // 같은 방의 사용자에게 데이터 전송
    socket.to(`room-${data.roomId.toString()}`).emit("roomPlayerAdd", {
      message: `Player joined the room.`,
    });

    emitSuccess(socket, "joinRoomResponse", {
      status: 200,
      message: `Successfully joined ${data.roomId}.`,
      roomPlayerInfo: existedRoomPlayer
    });
    return;
  } catch (error) {
    handleError(socket, error, "joinRoomResponse");
    return;
  }
}

export const leaveRoomHandler = async (socket: Socket, data: JoinRoomFields) => {
  console.log("[socket] 룸 나가기");

  if (!data.roomId || !data.userId) {
    emitError(socket, "leaveRoomResponse", 400, "Invalid roomId or userId value in request body");
    return;
  }

  try {
    // 소켓에서 사용자 제거
    socket.leave(`room-${data.roomId.toString()}`);

    emitSuccess(socket, "leaveRoomResponse", {
      status: 200,
      message: `Successfully left room ${data.roomId}.`,
    });
  } catch (error) {
    handleError(socket, error, "leaveRoomResponse");
    return;
  }
};

export const getRoomInfoHandler = async (socket: Socket, data: GetRoomFields) => {
  console.log("[socket] 룸 정보 요청");

  if (!data.roomId && data.roomId != 0) {
    emitError(socket, "getRoomInfoResponse", 400, "Invalid roomId value in request body");
    return;
  }

  try {
    const roomInfo = await roomInfoService(data.roomId);

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
    const { updatedPayout, updatedCoins } = await calcPayoutService(data);

    emitSuccess(socket, "updateBetResponse", {
      status: 200,
      message: `Successfully updated ${data.betAmount} coins.`,
      updatedCoins: updatedCoins,
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


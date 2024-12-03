import { Repository } from "typeorm";

import { RoomPlayer } from "../../models/roomPlayer";
import { calcPayout } from "./roomService";
import { Socket } from "socket.io";
import { MyDataSource } from "../../config/data-source";
import { Room } from "../../models/room";
import { getRoom, getRoomPlayer } from "../../utils/dataLoader";

export const createRoomPlayer = async (roomPlayerRepository: Repository<RoomPlayer>, userId: string, roomId: number) => {
  const newRoomPlayer = new RoomPlayer();
  newRoomPlayer.userId = userId;
  newRoomPlayer.roomId = roomId;
  const savedPlayer = await roomPlayerRepository.save(newRoomPlayer); // 저장
  return savedPlayer;
}

// 모든 사용자에 대해 Payout을 재계산하고 결과를 전송
// export const recalculatePayoutForRoom = async (io: Socket, roomId: number) => {
//   try {
//     const roomRepository = MyDataSource.getRepository(Room);
//     const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);

//     const roomInfo = await getRoom(roomRepository, roomId);
//     if (!roomInfo) {
//       console.error(`Room ${roomId} not found.`);
//       return;
//     }

//     const socketsInRoom = await io.in(`room-${roomId}`).fetchSockets();

//     for (const clientSocket of socketsInRoom) {
//       const roomPlayer = await getRoomPlayer(roomPlayerRepository, clientSocket.data.userId, roomId);

//       if (!roomPlayer) {
//         console.error(`RoomPlayer not found for user ${clientSocket.data.userId}`);
//         continue;
//       }

//       const calcField = {
//         currentPayout: roomPlayer.currentPayout,
//         targetPayout: roomInfo.targetPayout,
//         totalBet: roomPlayer.betAmount,
//         totalUser: roomInfo.totalUser,
//         maxBet: roomInfo.maxBet,
//         maxUser: roomInfo.maxUser,
//       };
//       const updatedPayout = calcPayout(calcField);

//       // 사용자에게 결과 전송
//       clientSocket.emit("payoutUpdate", {
//         message: "Payout recalculated due to new user joining.",
//         updatedPayout,
//       });

//       // DB에 업데이트 저장
//       roomPlayer.currentPayout = updatedPayout;
//       await roomPlayerRepository.save(roomPlayer);
//     }
//   } catch (error) {
//     console.error(`Error recalculating payout for room ${roomId}:`, error);
//   }
// };
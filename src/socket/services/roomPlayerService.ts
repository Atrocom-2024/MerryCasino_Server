import { RoomPlayer } from "../../models/roomPlayer";
import { getPlayer, getRoom, getRoomPlayer } from "../../utils/dataLoader";
import { getPlayerRepository } from "../../repository/playerRepository";
import { getRoomRepository } from "../../repository/roomRepository";
import { getRoomPlayerRepository } from "../../repository/roomPlayerRepository";

export const existingRoomPlayer = async (userId: string, roomId: number) => {
  const roomPlayerRepository = getRoomPlayerRepository();
  const roomPlayer = await roomPlayerRepository.findOneBy({ userId, roomId });

  return roomPlayer;
}

export const createRoomPlayer = async (userId: string, roomId: number) => {
  const roomPlayerRepository = getRoomPlayerRepository();
  
  const newRoomPlayer = new RoomPlayer();
  newRoomPlayer.userId = userId;
  newRoomPlayer.roomId = roomId;
  const savedPlayer = await roomPlayerRepository.save(newRoomPlayer); // 저장
  return savedPlayer;
}

export const calcPayoutService = async (data: UpdateBetFields) => {
  console.log("[socket] Payout 계산 시작");
  
  const playerRepository = getPlayerRepository();
  const roomRepository = getRoomRepository();
  const roomPlayerRepository = getRoomPlayerRepository();

  const [player, roomInfo, roomPlayer] = await Promise.all([
    getPlayer(playerRepository, data.userId),
    getRoom(roomRepository, data.roomId),
    getRoomPlayer(roomPlayerRepository, data.userId, data.roomId)
  ]);

  roomPlayer.betAmount -= data.betAmount;
  const calcField = {
    currentPayout: roomPlayer.currentPayout,
    targetPayout: roomInfo.targetPayout,
    totalBet: roomPlayer.betAmount,
    totalUser: roomInfo.totalUser,
    maxBet: roomInfo.maxBet,
    maxUser: roomInfo.maxUser
  };
  
  const adjustedProb = ((calcField.targetPayout - calcField.currentPayout) / 2);
  const part_A = (adjustedProb * (calcField.totalBet / calcField.maxBet) + adjustedProb * (calcField.totalUser / calcField.maxUser));

  player.coins += data.betAmount;
  roomPlayer.currentPayout = part_A;

  console.log(`현재 ${data.roomId}번 방의 payout: ${part_A}`);

  // Save the updated data
  await Promise.all([playerRepository.save(player), roomPlayerRepository.save(roomPlayer)]);

  return { updatedPayout: part_A, updatedCoins: player.coins };
}

interface UpdateBetFields {
  userId: string;
  roomId: number;
  betAmount: number;
}


// 실시간 유저 Payout 계산 구현중
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

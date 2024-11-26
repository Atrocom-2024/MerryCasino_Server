import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";
import { Room } from "../../models/room";
import { RoomPlayer } from "../../models/roomPlayer";
import { calcPayout } from "../services/roomService";

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

    // 룸 유저 테이블에 추가
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);
    const newRoomPlayer = new RoomPlayer();

    newRoomPlayer.userId = data.userId;
    newRoomPlayer.roomId = data.roomId;

    await roomPlayerRepository.save(newRoomPlayer); // 저장

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
    const roomRepository = MyDataSource.getRepository(Room);
    const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);
    const player = await playerRepository.findOneBy({ id: data.playerId });
    const roomPlayer = await roomPlayerRepository.findOneBy({ userId: data.playerId });
    const roomInfo = await roomRepository.findOneBy({ roomId: data.roomId });


    if (!player || !roomInfo || !roomPlayer) {
      socket.emit("updateBetResponse", {
        status: 404,
        message: "Player or RoomInfo or RoomPlayer is not found",
      });
      return;
    }

    const calcField = {
      currentPayout: roomPlayer.currentPayout,
      targetPayout: roomInfo.targetPayout,
      totalBet: roomInfo.totalBet,
      totalUser: roomInfo.totalUser,
      maxBet: roomInfo.maxBet,
      maxUser: roomInfo.maxUser
    }
    const updatedPayout = await calcPayout(calcField);

    player.coins += data.betAmount;
    roomPlayer.currentPayout = updatedPayout;

    console.log(`현재 ${data.roomId}번 방의 payout: ${updatedPayout}`);

    // Save the updated data
    await playerRepository.save(player);
    await roomPlayerRepository.save(roomPlayer);

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

interface CalcPayoutFields {
  currentPayout: number;
  targetPayout: number;
  totalBet: number;
  totalUser: number;
  maxBet: number;
  maxUser: number;
}

//. 데이터 넣을 때 에러 발생
// Error fetch room info: QueryFailedError: Unknown column 'playerId' in 'field list'
//     at Query.onResult (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\typeorm\src\driver\mysql\MysqlQueryRunner.ts:246:33)
//     at Query.execute (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\commands\command.js:36:14)
//     at PoolConnection.handlePacket (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:481:34)
//     at PacketParser.onPacket (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:97:12)
//     at PacketParser.executeStart (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\packet_parser.js:75:16)
//     at Socket.<anonymous> (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:104:25)
//     at Socket.emit (node:events:518:28)
//     at Socket.emit (node:domain:488:12)
//     at addChunk (node:internal/streams/readable:559:12)
//     at readableAddChunkPushByteMode (node:internal/streams/readable:510:3) {
//   query: 'INSERT INTO `tb_room_player`(`room_user_id`, `user_id`, `room_id`, `current_payout`, `bet_amount`, `update_at`, `playerId`, `roomRoomId`) VALUES (DEFAULT, ?, ?, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)',
//   parameters: [ '0e228682bf20ae2b2e7fdf685db82e7711b31727', 1 ],
//   driverError: Error: Unknown column 'playerId' in 'field list'
//       at Packet.asError (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\packets\packet.js:738:17)
//       at Query.execute (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\commands\command.js:29:26)
//       at PoolConnection.handlePacket (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:481:34)
//       at PacketParser.onPacket (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:97:12)
//       at PacketParser.executeStart (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\packet_parser.js:75:16)
//       at Socket.<anonymous> (C:\Users\bigda\Desktop\MerryCasino_Server\node_modules\mysql2\lib\connection.js:104:25)
//       at Socket.emit (node:events:518:28)
//       at Socket.emit (node:domain:488:12)
//       at addChunk (node:internal/streams/readable:559:12)
//       at readableAddChunkPushByteMode (node:internal/streams/readable:510:3) {
//     code: 'ER_BAD_FIELD_ERROR',
//     errno: 1054,
//     sqlState: '42S22',
//     sqlMessage: "Unknown column 'playerId' in 'field list'",
//     sql: "INSERT INTO `tb_room_player`(`room_user_id`, `user_id`, `room_id`, `current_payout`, `bet_amount`, `update_at`, `playerId`, `roomRoomId`) VALUES (DEFAULT, '0e228682bf20ae2b2e7fdf685db82e7711b31727', 1, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)"
//   },
//   code: 'ER_BAD_FIELD_ERROR',
//   errno: 1054,
//   sqlState: '42S22',
//   sqlMessage: "Unknown column 'playerId' in 'field list'",
//   sql: "INSERT INTO `tb_room_player`(`room_user_id`, `user_id`, `room_id`, `current_payout`, `bet_amount`, `update_at`, `playerId`, `roomRoomId`) VALUES (DEFAULT, '0e228682bf20ae2b2e7fdf685db82e7711b31727', 1, DEFAULT, DEFAULT, DEFAULT, DEFAULT, DEFAULT)"
// }
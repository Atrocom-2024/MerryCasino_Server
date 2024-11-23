import { Server, Socket } from "socket.io";
import { getRoomList } from "../services/roomService";
import { MyDataSource } from "../config/data-source";
import { Player } from "../models/player";

// WebSocket 이벤트 등록
export const socketController = (io: Server): void => {
  const roomList = getRoomList();

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // 플레이어 정보 수정 이벤트
    socket.on("updatePlayer", async (data) => {
      console.log("플레이어 정보 수정 요청 들어옴");

      if (!data.playerId) {
        socket.emit("updatePlayerResponse", {
          status: 400,
          message: "Invalid fields in request body",
        });
        return;
      }

      // 요청 데이터 유효성 검사
      const allowedKeys: (keyof UpdatePlayerFields)[] = ["playerId", "username", "coins", "level", "experience"];
      const invalidKeys = Object.keys(data).filter((key) => !allowedKeys.includes(key as keyof UpdatePlayerFields));
      
      if (invalidKeys.length > 0) {
        socket.emit("updatePlayerResponse", {
          status: 400,
          message: "Invalid fields in request body",
          invalidFields: invalidKeys,
        });
        return;
      }

      try {
        const playerRepository = MyDataSource.getRepository(Player);
        const player = await playerRepository.findOneBy({
          id: data.playerId,
        });

        if (!player) {
          socket.emit("updatePlayerResponse", {
            status: 404,
            message: "Player not found",
          });
          return;
        }

        const updatedFields: Partial<UpdatePlayerFields> = {};

        // 업데이트 로직
        if (data.username) {
          const isUsernameTaken = await playerRepository.findOneBy({ username: data.username });
          if (isUsernameTaken) {
            socket.emit("updatePlayerResponse", {
              status: 400,
              message: "Username is already taken",
            });
            return;
          }
          player.username = data.username;
          updatedFields.username = data.username;
        }

        if (data.coins) {
          player.coins = data.coins;
          updatedFields.coins = data.coins;
        }

        if (data.level) {
          player.level = data.level;
          updatedFields.level = data.level;
        }

        if (data.experience) {
          player.experience = data.experience;
          updatedFields.experience = data.experience;
        }

        // 변경 사항 저장
        await playerRepository.save(player);

        // 결과 클라이언트에 전송
        socket.emit("updatePlayerResponse", {
          status: 200,
          message: "Player updated successfully",
          updatedFields,
        });
      } catch (error) {
        console.error("Error updating player:", error);
        socket.emit("updatePlayerResponse", {
          status: 500,
          message: "An error occurred while updating the player.",
        });
      }
    });

    // 특정 방의 payout 조회
    socket.on("getPayout", (roomNumber) => {
      console.log(`Fetching payout for room ${roomNumber}`);
      
      if (!roomList[roomNumber]) {
        // 에러 응답 전송
        socket.emit("getPayoutResponse", { error: "Room not found" });
        return;
      }
  
      // 성공 응답 전송
      socket.emit("getPayoutResponse", { resultplusPercent: roomList[roomNumber].resultplusPercent });
    });

    // 특정 방의 targetPayout 조회
    socket.on("getTargetPayout", (roomNumber) => {
      console.log(`Fetching target payout for room ${roomNumber}`);
      
      if (!roomList[roomNumber]) {
        // 에러 응답 전송
        socket.emit("getTargetPayoutResponse", { error: "Room not found" });
        return;
      }
  
      // 성공 응답 전송
      socket.emit("getTargetPayoutResponse", { targetPayout: roomList[roomNumber].targetPayout });
    });

    // 특정 방의 totalBet 업데이트
    socket.on("updateTotalBet", (data) => {
      const { roomNumber, betCoin } = data;

      console.log(`Updating total bet for room ${roomNumber}`);
        
      if (!roomList[roomNumber]) {
        socket.emit('updateTotalBet', { error: 'Room not found' });
        return;
      }

      roomList[roomNumber].totalBet += betCoin;
      socket.emit('updateTotalBet', { success: true, totalBet: roomList[roomNumber].totalBet });
    });

    // 특정 방의 totalPayout 업데이트
    socket.on("updateTotalPayout", (data, callback) => {
      console.log(`Updating total payout for room ${data.roomNumber}`);

      const { roomNumber, payoutCoin } = data;

      if (!roomList[roomNumber]) {
        socket.emit('updateTotalPayout', { error: 'Room not found' });
        return;
      }

      roomList[roomNumber].totalPayout += payoutCoin;
      socket.emit('updateTotalPayout', { success: true, totalPayout: roomList[roomNumber].totalPayout });
    });

    // 연결 해제
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};


interface UpdatePlayerFields {
  playerId: string;
  username?: string;
  coins?: number;
  level?: number;
  experience?: number;
};
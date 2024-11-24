import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";
import { calcPayout } from "../services/roomService";

interface PlayerFields {
  playerId: string;
  username?: string;
  coins?: number;
  level?: number;
  experience?: number;
}

interface UpdateBetFields {
  playerId: string;
  roomId: number;
  betAmount: number;
}

export const updateBetHadnler = async (socket: Socket, data: UpdateBetFields) => {
  console.log("배팅 요청 들어옴");

  if (!data.playerId || !data.roomId || !data.betAmount) {
    socket.emit("updateBetResponse", {
      status: 400,
      message: "Invalid playerId or coins value in request body",
    });
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const player = await playerRepository.findOneBy({
      id: data.playerId
    });

    if (!player) {
      socket.emit("updateBetResponse", {
        status: 404,
        message: "Player not found",
      });
      return;
    }


    player.coins += data.betAmount;
    const updatedPayout = await calcPayout(data.roomId);
    console.log(updatedPayout);
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

// 리팩토링 필요 -> 클라이언트 동시에
export const addCoinsHandler = async (socket: Socket, data: PlayerFields) => {
  console.log("플레이어 코인 추가 요청 들어옴");

  if (!data.playerId || typeof data.coins !== "number") {
    socket.emit("addCoinsResponse", {
      status: 400,
      message: "Invalid playerId or coins value in request body",
    });
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const player = await playerRepository.findOneBy({ id: data.playerId });

    if (!player) {
      socket.emit("addCoinsResponse", {
        status: 404,
        message: "Player not found",
      });
      return;
    }

    // Add coins to the player's current coins
    player.coins += data.coins;

    // Save the updated player data
    await playerRepository.save(player);

    socket.emit("addCoinsResponse", {
      status: 200,
      message: `Successfully added ${data.coins} coins to player.`,
      updatedCoins: player.coins,
    });
  } catch (error) {
    console.error("Error adding coins to player:", error);
    socket.emit("addCoinsResponse", {
      status: 500,
      message: "An error occurred while adding coins to the player.",
    });
  }
};

export const updatePlayerHandler = async (socket: Socket, data: PlayerFields) => {
  console.log("플레이어 정보 수정 요청 들어옴");

  if (!data.playerId) {
    socket.emit("updatePlayerResponse", {
      status: 400,
      message: "Invalid fields in request body",
    });
    return;
  }

  const allowedKeys: (keyof PlayerFields)[] = ["playerId", "username", "coins", "level", "experience"];
  const invalidKeys = Object.keys(data).filter((key) => !allowedKeys.includes(key as keyof PlayerFields));

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
    const player = await playerRepository.findOneBy({ id: data.playerId });

    if (!player) {
      socket.emit("updatePlayerResponse", {
        status: 404,
        message: "Player not found",
      });
      return;
    }

    const updatedFields: Partial<PlayerFields> = {};

    if (data.username) {
      const isUsernameTaken = await playerRepository.findOneBy({ userName: data.username });
      if (isUsernameTaken) {
        socket.emit("updatePlayerResponse", {
          status: 400,
          message: "Username is already taken",
        });
        return;
      }
      player.userName = data.username;
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

    await playerRepository.save(player);

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
};
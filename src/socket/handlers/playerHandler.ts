import { Socket } from "socket.io";

import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";

interface PlayerFields {
  playerId: string;
  username?: string;
  coins?: number;
  level?: number;
  experience?: number;
}

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
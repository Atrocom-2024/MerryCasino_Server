import { Socket } from "socket.io";

import { emitError, emitSuccess, handleError } from "./responseHandler";
import { getPlayer } from "../../utils/dataLoader";
import { getPlayerRepository } from "../../repository/playerRepository";
import { MyDataSource } from "../../config/data-source";
import { Player } from "../../models/player";

// 리팩토링 필요
export const updatePlayerCoinsHandler = async (socket: Socket, data: PlayerFields) => {
  console.log("[socket] 플레이어 코인 추가 요청");

  if (!data.playerId || typeof data.coins !== "number") {
    emitError(socket, "updatePlayerCoinsResponse", 400, "Invalid playerId or coins value in request body");
    return;
  }

  try {
    const playerRepository = MyDataSource.getRepository(Player);
    const player = await getPlayer(playerRepository, data.playerId)

    if (!player) {
      emitError(socket, "updatePlayerCoinsResponse", 404, "Player not found");
      return;
    }

    // Add coins to the player's current coins
    player.coins += data.coins;

    // Save the updated player data
    await playerRepository.save(player);

    emitSuccess(socket, "updatePlayerCoinsResponse", {
      status: 200,
      message: `Successfully added ${data.coins} coins to player.`,
      updatedCoins: player.coins,
    });
    return;
  } catch (error) {
    handleError(socket, error, "updatePlayerCoinsResponse");
    return;
  }
};

// export const updatePlayerHandler = async (socket: Socket, data: PlayerFields) => {
//   console.log("플레이어 정보 수정 요청 들어옴");

//   if (!data.playerId) {
//     socket.emit("updatePlayerResponse", {
//       status: 400,
//       message: "Invalid fields in request body",
//     });
//     return;
//   }

//   const allowedKeys: (keyof PlayerFields)[] = ["playerId", "username", "coins", "level", "experience"];
//   const invalidKeys = Object.keys(data).filter((key) => !allowedKeys.includes(key as keyof PlayerFields));

//   if (invalidKeys.length > 0) {
//     socket.emit("updatePlayerResponse", {
//       status: 400,
//       message: "Invalid fields in request body",
//       invalidFields: invalidKeys,
//     });
//     return;
//   }

//   try {
//     const playerRepository = MyDataSource.getRepository(Player);
//     const player = await playerRepository.findOneBy({ id: data.playerId });

//     if (!player) {
//       socket.emit("updatePlayerResponse", {
//         status: 404,
//         message: "Player not found",
//       });
//       return;
//     }

//     const updatedFields: Partial<PlayerFields> = {};

//     if (data.username) {
//       const isUsernameTaken = await playerRepository.findOneBy({ userName: data.username });
//       if (isUsernameTaken) {
//         socket.emit("updatePlayerResponse", {
//           status: 400,
//           message: "Username is already taken",
//         });
//         return;
//       }
//       player.userName = data.username;
//       updatedFields.username = data.username;
//     }

//     if (data.coins) {
//       player.coins = data.coins;
//       updatedFields.coins = data.coins;
//     }

//     if (data.level) {
//       player.level = data.level;
//       updatedFields.level = data.level;
//     }

//     if (data.experience) {
//       player.experience = data.experience;
//       updatedFields.experience = data.experience;
//     }

//     await playerRepository.save(player);

//     socket.emit("updatePlayerResponse", {
//       status: 200,
//       message: "Player updated successfully",
//       updatedFields,
//     });
//   } catch (error) {
//     console.error("Error updating player:", error);
//     socket.emit("updatePlayerResponse", {
//       status: 500,
//       message: "An error occurred while updating the player.",
//     });
//   }
// };

interface PlayerFields {
  playerId: string;
  username?: string;
  coins?: number;
  level?: number;
  experience?: number;
}

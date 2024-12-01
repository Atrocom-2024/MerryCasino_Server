import { Repository } from "typeorm";

import { Room } from "../models/room";
import { Player } from "../models/player";
import { RoomPlayer } from "../models/roomPlayer";

// 공통 데이터 로드 함수
export async function getPlayer(playerRepository: Repository<Player>, userId: string) {
  const player = await playerRepository.findOneBy({ id: userId });
  if (!player) throw new Error("Player not found");
  return player;
}

export async function getRoom(roomRepository: Repository<Room>, roomId: number) {
  const room = await roomRepository.findOneBy({ roomId });
  if (!room) throw new Error("Room not found");
  return room;
}

export async function getRoomPlayer(roomPlayerRepository: Repository<RoomPlayer>, userId: string, roomId: number) {
  const roomPlayer = await roomPlayerRepository.findOneBy({ userId, roomId });
  if (!roomPlayer) throw new Error("RoomPlayer not found");
  return roomPlayer;
}
import { Repository } from "typeorm";

import { RoomPlayer } from "../../models/roomPlayer";

export const createRoomPlayer = async (roomPlayerRepository: Repository<RoomPlayer>, userId: string, roomId: number) => {
  const newRoomPlayer = new RoomPlayer();
  newRoomPlayer.userId = userId;
  newRoomPlayer.roomId = roomId;
  const savedPlayer = await roomPlayerRepository.save(newRoomPlayer); // 저장
  return savedPlayer;
}
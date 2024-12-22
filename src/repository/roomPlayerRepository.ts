import { MyDataSource } from "../config/data-source"
import { RoomPlayer } from "../models/roomPlayer";

export const getRoomPlayerRepository = () => {
  const roomPlayerRepository = MyDataSource.getRepository(RoomPlayer);
  return roomPlayerRepository;
}
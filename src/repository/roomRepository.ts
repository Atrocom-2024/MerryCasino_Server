import { MyDataSource } from "../config/data-source"
import { Room } from "../models/room";

export const getRoomRepository = () => {
  const roomRepository = MyDataSource.getRepository(Room);
  return roomRepository;
}
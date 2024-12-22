import { getRoomRepository } from "../../repository/roomRepository";
import { getRoom } from "../../utils/dataLoader";

export const increaseUserCountService = async (roomId: number) => {
  const roomRepository = getRoomRepository();
  const roomInfo = await getRoom(roomRepository, roomId);

  roomInfo.totalUser += 1;
  await roomRepository.save(roomInfo);

  return;
}

export const roomInfoService = async (roomId: number) => {
  const roomRepository = getRoomRepository();
  const roomInfo = await getRoom(roomRepository, roomId);

  return roomInfo;
}
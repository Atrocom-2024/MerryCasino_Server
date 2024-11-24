import { MyDataSource } from "../../config/data-source";
import { Room } from "../../models/room";

export const calcPayout = async (roomNumber: number) => {
  console.log("Payout 계산됨");

  const roomRepository = MyDataSource.getRepository(Room);
  const room = await roomRepository.findOneBy({
    roomId: roomNumber
  });

  if (!room) return false;

  // 계산에 필요한 변수
  const targetPayout = room.targetPayout;
  const currentPayout = room.currentPayout;
  const totalBet = room.totalBet;
  const totalUser = room.totalUser;
  const maxBet = room.maxBet;
  const maxUser = room.maxUser;

  const adjustedProb = ((targetPayout - currentPayout) / 2);
  const part_A = (adjustedProb * (totalBet / maxBet) + adjustedProb * (totalUser / maxUser));
  
  room.currentPayout = part_A;
  return part_A;
}
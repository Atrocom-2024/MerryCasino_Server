import { MyDataSource } from "../../config/data-source";
import { Room } from "../../models/room";
import { RoomPlayer } from "../../models/roomPlayer";

export const calcPayout = async (data: CalcPayoutFields) => {
  console.log("Payout 계산됨");

  const adjustedProb = ((data.targetPayout - data.currentPayout) / 2);
  const part_A = (adjustedProb * (data.totalBet / data.maxBet) + adjustedProb * (data.totalUser / data.maxUser));

  return part_A;
}

interface CalcPayoutFields {
  currentPayout: number;
  targetPayout: number;
  totalBet: number;
  totalUser: number;
  maxBet: number;
  maxUser: number;
}
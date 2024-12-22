import { MyDataSource } from "../config/data-source"
import { Player } from "../models/player"

export const getPlayerRepository = () => {
  const playerRepository = MyDataSource.getRepository(Player);
  return playerRepository;
}
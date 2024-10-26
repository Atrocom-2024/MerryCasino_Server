import { Request, Response } from 'express';
import { MyDataSource } from '../config/data-source';
import { Player } from '../models/player';

// 플레이어 정보 가져오기
export const getPlayer = async (req: Request, res: Response) => {
  const playerRepository = MyDataSource.getRepository(Player); // Repository 가져오기
  const player = await playerRepository.findOneBy({
    id: parseInt(req.params.id, 10),
  });

  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
};

// 새로운 플레이어 생성
export const createPlayer = async (req: Request, res: Response) => {
  const playerRepository = MyDataSource.getRepository(Player);
  const newPlayer = new Player(); // 새 엔티티 인스턴스 생성
  newPlayer.username = req.body.username;
  newPlayer.coins = req.body.coins || 1000;

  await playerRepository.save(newPlayer); // 저장
  res.status(201).json(newPlayer); // 응답
}
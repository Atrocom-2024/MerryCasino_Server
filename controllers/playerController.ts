import { Request, Response } from 'express';

import { MyDataSource } from '../config/data-source';
import { Player } from '../models/player';
import { generateRandomUsername } from '../utils/randomUtils';
import { isUsernameTaken } from '../services/playerService';

// 플레이어 정보 가져오기
export const getPlayer = async (req: Request, res: Response) => {
  console.log('플레이어 정보 요청 들어옴');
  const playerRepository = MyDataSource.getRepository(Player); // Repository 가져오기
  
  console.log(req.params.player_id);
  const player = await playerRepository.findOneBy({
    id: req.params.player_id,
  });

  if (player) {
    res.json(player);
  } else {
    res.status(404).json({ message: 'Player not found' });
  }
};

// 새로운 플레이어 생성
export const createPlayer = async (req: Request, res: Response) => {
  console.log('플레이어 생성 요청 들어옴');
  console.log(req.body);

  // 중복되지 않는 username을 찾을 때까지 반복
  let username: string;
  do {
    username = generateRandomUsername();
  } while (await isUsernameTaken(username)); // 중복 확인

  const playerRepository = MyDataSource.getRepository(Player);
  const newPlayer = new Player(); // 새 엔티티 인스턴스 생성
  newPlayer.id = req.body.ID;
  newPlayer.username = username;
  newPlayer.coin = req.body.COIN || 0;

  await playerRepository.save(newPlayer); // 저장
  res.status(201).json(newPlayer); // 응답
}

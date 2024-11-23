import { Request, Response } from 'express';

import { MyDataSource } from '../../config/data-source';
import { Player } from '../../models/player';
import { generateRandomUsername } from '../../utils/randomUtils';
import { isUsernameTaken } from '../services/playerService';

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
  newPlayer.id = req.body.id;
  newPlayer.username = username;
  newPlayer.coins = req.body.coins || 0;
  newPlayer.provider = 'guest';

  await playerRepository.save(newPlayer); // 저장
  res.status(201).json(newPlayer); // 응답
  return;
};

// 플레이어 정보 가져오기 -> 보안 설정 필요
export const getPlayer = async (req: Request, res: Response) => {
  console.log('플레이어 정보 요청 들어옴');

  const playerRepository = MyDataSource.getRepository(Player); // Repository 가져오기
  const player = await playerRepository.findOneBy({
    id: req.params.player_id,
  });

  if (!player) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }

  res.json(player);
  return;
};

// 플레이어 정보 수정 -> 보안 설정 필요
export const updatePlayer = async (req: Request, res: Response) => {
  console.log('플레이어 정보 수정 요청 들어옴');

  // 요청 바디에 정의되지 않은 필드가 있는지 확인
  const allowedKeys: (keyof UpdatePlayerFields)[] = ['username', 'coins', 'level', 'experience'];
  const invalidKeys = Object.keys(req.body).filter(key => !allowedKeys.includes(key as keyof UpdatePlayerFields));

  if (invalidKeys.length > 0) {
    res.status(400).json({
      message: 'Invalid fields in request body',
      invalidFields: invalidKeys
    });
    return;
  }

  const playerRepository = MyDataSource.getRepository(Player);
  const player = await playerRepository.findOneBy({
    id: req.params.player_id,
  });

  if (!player) {
    res.status(404).json({ message: 'Player not found' });
    return;
  }

  const updatedFields: Partial<UpdatePlayerFields> = {}; // 변경된 필드를 추적할 객체
  // 요청 바디에 포함된 항목을 선택적으로 업데이트
  if (req.body.username) {
    // username 중복 체크
    if (await isUsernameTaken(req.body.username)) {
      res.status(400).json({ message: 'Username is already taken' });
      return;
    }
    player.username = req.body.username;
    updatedFields.username = req.body.username; // 변경 필드 추가
  }

  if (req.body.coins) {
    player.coins = req.body.coins;
    updatedFields.coins = req.body.coins; // 변경 필드 추가
  }

  if (req.body.level) {
    player.level = req.body.level;
    updatedFields.level = req.body.level; // 변경 필드 추가
  }

  if (req.body.experience) {
    player.experience = req.body.experience;
    updatedFields.experience = req.body.experience; // 변경 필드 추가
  }

  await playerRepository.save(player); // 변경 사항 저장
  res.status(200).json({
    message: 'Player updated successfully',
    updatedFields
  });
  return;
}

interface UpdatePlayerFields {
  username?: string;
  coins?: number;
  level?: number;
  experience?: number;
}
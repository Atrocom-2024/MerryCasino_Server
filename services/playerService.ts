import { MyDataSource } from '../config/data-source';
import { Player } from '../models/player';

// username 중복 여부 확인
export async function isUsernameTaken(username: string): Promise<boolean> {
  const playerRepository = MyDataSource.getRepository(Player);
  const existingPlayer = await playerRepository.findOneBy({ username });
  return !!existingPlayer; // 중복된 유저가 있으면 true, 없으면 false
}
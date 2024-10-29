import { Router } from 'express';
import { getPlayer, createPlayer, updatePlayer } from '../controllers/playerController';

const playerRoutes = Router();

playerRoutes.post('/players', createPlayer); // 플레이어 생성
playerRoutes.get('/players/:player_id', getPlayer); // 플레이어 정보 조회
playerRoutes.patch('/players/:player_id', updatePlayer); // 플레이어 정보 수정

export default playerRoutes;
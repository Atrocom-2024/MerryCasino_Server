import { Router } from 'express';
import { getPlayer, createPlayer } from '../controllers/playerController';

const playerRoutes = Router();

playerRoutes.get('/player/:id', getPlayer); // 플레이어 정보 조회
playerRoutes.post('/players', createPlayer); // 플레이어 생성

export default playerRoutes;
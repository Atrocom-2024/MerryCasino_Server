import 'reflect-metadata';
import express from 'express';

import { MyDataSource } from './config/data-source';
import playerRoutes from './routes/playerRoutes';
import { config } from './config/config';
import { readlocalJson, startRoomUpdates } from './services/roomService';
import roomRoutes from './routes/roomRoutes';

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    // 데이터베이스 연결
    await MyDataSource.initialize();
    console.log('MySQL 데이터베이스 연결 성공');

    // 로컬 JSON 데이터 초기화
    readlocalJson(); // 데이터를 설정하기 위해 호출

    // 방 상태 관리 시작
    startRoomUpdates(); // 서버가 요청을 받기 전에 실행

    // 라우트 설정
    app.use('/api/players', playerRoutes);
    app.use('/api/rooms', roomRoutes);

    // 서버 시작
    app.listen(config.Server_Port, () => {
      console.log(`서버가 포트 ${config.Server_Port}에서 실행 중입니다.`);
    });
  } catch (err) {
    console.log('데이터베이스 연결 오류:', err);
  }
};

startServer();

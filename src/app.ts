import 'reflect-metadata';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import { MyDataSource } from './config/data-source';
import { config } from './config/config';
import healthcheckRoutes from './web/routes/healthcheckRoutes';
import playerRoutes from './web/routes/playerRoutes';
import roomRoutes from './web/routes/roomRoutes';
import { socketServer } from './socket/socketServer';

const app = express();
app.use(express.json());

// HTTP 서버와 Socket.IO 통합
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH']
  }
});

const startServer = async () => {
  try {
    // 데이터베이스 연결
    await MyDataSource.initialize();
    console.log('MySQL 데이터베이스 연결 성공');

    // 라우트 설정
    app.use('/healthcheck', healthcheckRoutes);
    app.use('/api/players', playerRoutes);
    app.use('/api/rooms', roomRoutes);

    // Socket.IO 컨트롤러 설정 - 데이터베이스 초기화 후에 실행
    socketServer(io);

    // 서버 시작
    httpServer.listen(config.Server_Port, () => {
      console.log(`서버가 포트 ${config.Server_Port}에서 실행 중입니다.`);
    });
  } catch (err) {
    console.log('데이터베이스 연결 오류:', err);
  }
};

startServer();

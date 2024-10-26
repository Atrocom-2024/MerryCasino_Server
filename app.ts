import 'reflect-metadata';
import express from 'express';

import { MyDataSource } from './config/data-source';
import playerRoutes from './routes/playerRoutes';
import { config } from './config/config';

const app = express();
app.use(express.json());

const startServer = async () => {
  try {
    // 데이터베이스 연결
    await MyDataSource.initialize();
    console.log('MySQL 데이터베이스 연결 성공');

    // 라우트 설정
    app.use('/api', playerRoutes);

    // 서버 시작
    app.listen(config.Server_Port, () => {
      console.log(`서버가 포트 ${config.Server_Port}에서 실행 중입니다.`);
    });
  } catch (err) {
    console.log('데이터베이스 연결 오류:', err);
  }
};

startServer();

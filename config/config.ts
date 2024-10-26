import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  dbUri: process.env.DB_URI,
}
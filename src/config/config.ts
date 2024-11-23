import dotenv from 'dotenv';

// 환경 변수 로드
dotenv.config();

export const config = {
  Server_Port: parseInt(process.env.SERVER_PORT || '3000'),
  DB_host: process.env.DB_HOST,
  DB_port: parseInt(process.env.DB_PORT || '3306', 10),
  DB_username: process.env.DB_USERNAME,
  DB_password: process.env.DB_PASSWORD,
  DB_database: process.env.DB_DATABASE
}
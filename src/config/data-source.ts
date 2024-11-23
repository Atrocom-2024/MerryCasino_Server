import { DataSource } from 'typeorm';

import { config } from './config';
import { Player } from '../models/player';

export const MyDataSource = new DataSource({
  type: 'mysql',
  host: config.DB_host,
  port: config.DB_port,
  username: config.DB_username,
  password: config.DB_password,
  database: config.DB_database,
  synchronize: true,  // 개발 환경에서만 true. 배포 환경에서는 false로 설정하고 마이그레이션을 사용
  logging: false,
  entities: [Player],  // 엔티티를 배열로 추가
  migrations: [],
  subscribers: [],
});
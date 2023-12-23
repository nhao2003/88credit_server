import path from 'path';
import { DataSource } from 'typeorm';
import AppConfig from '~/constants/configs';
const AppDataSource = new DataSource({
  type: 'postgres',
  host: AppConfig.database.host,
  port: Number(AppConfig.database.port),
  username: AppConfig.database.user,
  password: AppConfig.database.password,
  database: AppConfig.database.name,
  ssl: true,
  dropSchema: false,
  synchronize: true,
  logging: false,
  entities: [
    AppConfig.isProduction
      ? path.join(__dirname, '..', '..', 'dist', 'models/databases/*.js')
      : path.join(__dirname, '..', '..', 'src', 'models/databases/*.ts'),
  ],
  migrations: [],
  subscribers: [],
  cache: true,
});

export { AppDataSource };

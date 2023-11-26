import { DataSource } from 'typeorm';
import { initApp } from './app';
import { Express } from 'express';
const PORT = process.env.PORT || 8000;
export async function startServer(dataSource: DataSource): Promise<Express> {
  await dataSource.initialize();
  return initApp();
}

import { startServer } from './app/server';
import { AppDataSource } from './app/database';
import http from 'http';
import { Express } from 'express';
import { createSocketServer } from './app/socket';

const PORT = process.env.PORT || 8000;
startServer(AppDataSource)
  .then(async (app: Express) => {
    const server = http.createServer(app);
    createSocketServer(server);
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Server failed to start');
    console.log(err);
    process.exit(1);
  });

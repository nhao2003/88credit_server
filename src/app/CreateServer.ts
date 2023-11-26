import express, { Request, Response } from 'express';
import authRoutes from '../routes/auth.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from '../middlewares/error.middleware';

export default function createServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use((req: Request, res: Response, next) => {
    res.header({ 'Access-Control-Allow-Origin': '*' });
    console.log('/***********************/');
    console.log('Request URL:', req.originalUrl);
    console.log('Request Time:', new Date().toLocaleString());
    console.log('Request Type:', req.method);
    console.log('Request Body:', req.body);
    console.log('/***********************/');

    next();
  });

  const version = 'v1';
  app.use(`/api/${version}/auth`, authRoutes);

  // 404
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'fail',
      code: 404,
      message: 'Not found',
    });
  });
  app.use(errorHandler);
}

import express, { Request, Response } from 'express';
import { Express } from 'express';
import authRoutes from '../routes/auth.routes';
import postRoutes from '../routes/post.routes';
import adminRoutes from '../routes/admin.routes';
import loanRequestRoutes from '../routes/loan_request.routes';
import bankRoutes from '../routes/bank.routes';
import mediaRoutes from '../routes/media.routes';
import userRoutes from '../routes/user.routes';
import bodyParser from 'body-parser';
import cors from 'cors';
import { errorHandler } from '../middlewares/error.middleware';
import bankAccountRoutes from '../routes/bank_card.routes';
import contractRoutes from '../routes/contract.routes';
import contractTemplateRoutes from '../routes/contract_template.routes';
import blogRoutes from '../routes/blog.routes';
import reportRoutes from '../routes/report.routes';
import conversationRoutes from '../routes/conversation.routes';
import ServerCodes from '~/constants/server_codes';
export function initApp(): Express {
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
    console.log('Request Params:', req.params);
    console.log('Request Query:', req.query);
    console.log('Request Headers:', req.headers);
    console.log('Request Body:', req.body);
    console.log('/***********************/');

    next();
  });

  const version = 'v1';
  app.use(`/api/${version}/auth`, authRoutes);
  app.use(`/api/${version}/post`, postRoutes);
  app.use(`/api/${version}/loan-request`, loanRequestRoutes);
  app.use(`/api/${version}/bank-card`, bankAccountRoutes);
  app.use(`/api/${version}/contract`, contractRoutes);
  app.use(`/api/${version}/contract-template`, contractTemplateRoutes);
  app.use(`/api/${version}/admin`, adminRoutes);
  app.use(`/api/${version}/blogs`, blogRoutes);
  app.use(`/api/${version}/report`, reportRoutes);
  app.use(`/api/${version}/bank`, bankRoutes);
  app.use(`/api/${version}/media`, mediaRoutes);
  app.use(`/api/${version}/user`, userRoutes);
  app.use('/api/v1/conversations', conversationRoutes);
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      status: 'fail',
      code: ServerCodes.CommomCode.NotFound,
      message: 'Can not find the route' + req.originalUrl + ' on this server',
    });
  });
  app.use(errorHandler);
  return app;
}

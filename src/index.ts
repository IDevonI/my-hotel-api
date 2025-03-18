import express, { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes/index';
import { NotFoundError } from './errors/NotFoundError';
import { logger } from './utils/logger';

const app = express();
logger.info('Express application initialized');

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST']
}));
app.use(helmet());
app.use(express.json());
app.use(morgan('dev', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

app.use(rateLimit(config.rateLimit));
logger.debug('Rate limiting middleware applied');

app.use(routes);
logger.info('API routes registered');

app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError('Resource not found'));
});

app.use(errorHandler as ErrorRequestHandler);

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
});
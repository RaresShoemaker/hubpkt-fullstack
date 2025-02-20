import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookie from 'cookie-parser';
import bodyParser from 'body-parser';

import router from './routes/index';
import { errorHandler } from './middlewares/error';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(cookie());

// PARSE URLENCODED REQUEST BODY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PARSE JSON EXPRESS BODY
app.use(express.json());

app.use('/api', router);

app.use(errorHandler);

app.use(helmet());

export { app };

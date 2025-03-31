import express, {Request, RequestHandler} from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookie from 'cookie-parser';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';

import router from './routes/index';
import { errorHandler } from './middlewares/error';
import { apiKeyAuth } from './middlewares/apiKey';

const app = express();

// Configure CORS based on environment
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [process.env.CLIENT_ORIGIN || 'https://peekcode.dev', /\.peekcode\.dev$/]
  : ['http://localhost:5173'];                        // Development origin

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Add simple application-level rate limiting
// Note: This is a backup - main rate limiting should happen at Nginx
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes',
  skip: (req: Request) => {
    // Skip rate limiting for health checks and static assets
    return req.path === '/health' || !!req.path.match(/\.(js|css|png|jpg|jpeg|gif|ico)$/);
  }
});

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Add security headers
app.use(helmet());

// Cookie parser
app.use(cookie());

// Parse request body
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));

// Parse JSON express body
app.use(express.json({ limit: '1mb' }));

// Add health check endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Apply API key authentication middleware for protected routes
app.use('/api', apiKeyAuth as RequestHandler);

// API routes
app.use('/api', router);

// Error handler
app.use(errorHandler);

export { app };

import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Database
  DATABASE_URL: process.env.DATABASE_URL!,
  
  // Server
  PORT: process.env.PORT || 4001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Authentication
  JWT_SECRET: process.env.JWT_SECRET!,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // File Storage - Filesystem Configuration
  STORAGE_BASE_PATH: process.env.STORAGE_BASE_PATH || '/app/uploads',
  NGINX_BASE_URL: process.env.NGINX_BASE_URL || 'http://localhost:8080',
  
  // File Upload Limits
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB in bytes
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,image/webp,image/svg+xml').split(','),
  
  // Legacy R2 Configuration (keep during migration period, remove after)
  R2_ENDPOINT: process.env.R2_ENDPOINT,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
  
  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  
  // Logging
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

// Validation
const requiredEnvVars = [
  'DATABASE_URL',
  'JWT_SECRET',
  'NGINX_BASE_URL'
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}
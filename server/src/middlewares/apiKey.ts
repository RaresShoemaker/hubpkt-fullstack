import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to verify API key from frontend requests
 */
export const apiKeyAuth = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const expectedApiKey = process.env.API_KEY;
  
  // Skip API key check for certain public endpoints if needed
  if (req.path === '/health' || req.path === '/api/health') {
    return next();
  }
  
  // Validate API key
  if (!apiKey || apiKey !== expectedApiKey) {
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Invalid or missing API key' 
    });
  }

  next();
};
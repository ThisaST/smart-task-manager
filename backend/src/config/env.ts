import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/**
 * Environment variables validation schema
 */
const envSchema = z.object({
  // Server configuration
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.string().default('3001').transform((val) => parseInt(val, 10)).pipe(z.number().min(1).max(65535)),
  
  // Database configuration
  DATABASE_URL: z.string().url('Invalid database URL'),
  
  // API configuration
  API_PREFIX: z.string().default('/api'),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000').transform((val) => parseInt(val, 10)).pipe(z.number().positive()), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.string().default('100').transform((val) => parseInt(val, 10)).pipe(z.number().positive()),
  
  // Security
  JWT_SECRET: z.string().min(32, 'JWT secret must be at least 32 characters').optional(),
  BCRYPT_ROUNDS: z.string().default('12').transform((val) => parseInt(val, 10)).pipe(z.number().min(8).max(15)),
  
  // Redis (optional)
  REDIS_URL: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

/**
 * Parse and validate environment variables
 */
const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      );
      
      console.error('❌ Environment validation failed:');
      errorMessages.forEach(msg => console.error(`  - ${msg}`));
      
      process.exit(1);
    }
    
    throw error;
  }
};

/**
 * Validated environment configuration
 */
export const env = parseEnv();

/**
 * Environment configuration object with typed values
 */
export const config = {
  // Server
  server: {
    port: env.PORT,
    env: env.NODE_ENV,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
  },
  
  // Database
  database: {
    url: env.DATABASE_URL,
  },
  
  // API
  api: {
    prefix: env.API_PREFIX,
    corsOrigin: env.CORS_ORIGIN,
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.RATE_LIMIT_MAX_REQUESTS,
  },
  
  // Security
  security: {
    jwtSecret: env.JWT_SECRET,
    bcryptRounds: env.BCRYPT_ROUNDS,
  },
  
  // Redis
  redis: {
    url: env.REDIS_URL,
  },
  
  // Logging
  logging: {
    level: env.LOG_LEVEL,
  },
} as const;

/**
 * Print configuration summary (excluding sensitive data)
 */
export const printConfig = (): void => {
  console.log('🔧 Application Configuration:');
  console.log(`  Environment: ${config.server.env}`);
  console.log(`  Port: ${config.server.port}`);
  console.log(`  API Prefix: ${config.api.prefix}`);
  console.log(`  CORS Origin: ${config.api.corsOrigin}`);
  console.log(`  Rate Limit: ${config.rateLimit.maxRequests} requests per ${config.rateLimit.windowMs}ms`);
  console.log(`  Log Level: ${config.logging.level}`);
  console.log(`  Database: ${config.database.url.split('@')[1] || 'Connected'}`); // Hide credentials
}; 
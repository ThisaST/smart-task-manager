import { PrismaClient } from '@prisma/client';

/**
 * Database configuration and connection management
 */
class DatabaseConfig {
  private static instance: DatabaseConfig;
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
      errorFormat: 'pretty',
    });

    // Handle process termination gracefully
    process.on('SIGINT', () => this.disconnect());
    process.on('SIGTERM', () => this.disconnect());
    process.on('beforeExit', () => this.disconnect());
  }

  /**
   * Get singleton instance of database configuration
   */
  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  /**
   * Get Prisma client instance
   */
  public getClient(): PrismaClient {
    return this.prisma;
  }

  /**
   * Test database connection
   */
  public async testConnection(): Promise<boolean> {
    try {
      await this.prisma.$connect();
      console.log('✅ Database connection successful');
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      return false;
    }
  }

  /**
   * Disconnect from database
   */
  public async disconnect(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      console.log('🔌 Database disconnected');
    } catch (error) {
      console.error('Error disconnecting from database:', error);
    }
  }

  /**
   * Initialize database (run migrations, check connection)
   */
  public async initialize(): Promise<void> {
    console.log('🔄 Initializing database connection...');
    
    const isConnected = await this.testConnection();
    if (!isConnected) {
      throw new Error('Failed to connect to database');
    }

    // Optionally run health checks here
    await this.runHealthCheck();
    
    console.log('✅ Database initialized successfully');
  }

  /**
   * Run database health check
   */
  private async runHealthCheck(): Promise<void> {
    try {
      // Simple query to test database functionality
      await this.prisma.$queryRaw`SELECT 1`;
      console.log('✅ Database health check passed');
    } catch (error) {
      console.error('❌ Database health check failed:', error);
      throw new Error('Database health check failed');
    }
  }
}

// Export singleton instance
export const database = DatabaseConfig.getInstance();
export default database; 
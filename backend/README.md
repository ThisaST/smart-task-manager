# Task Manager Backend API

A robust RESTful API for task management built with Node.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **Complete CRUD Operations** for tasks
- **Filtering & Sorting** with pagination support
- **Input Validation** using Zod schemas
- **Database Operations** with Prisma ORM
- **Error Handling** with consistent API responses
- **Rate Limiting** and security middleware
- **Task Statistics** and analytics
- **Bulk Operations** for multiple tasks
- **TypeScript** for type safety
- **Comprehensive Testing** with Jest

## 📋 API Endpoints

### Core Task Operations
```
GET    /api/tasks                 # List tasks with filtering/pagination
POST   /api/tasks                 # Create new task
GET    /api/tasks/:id              # Get specific task
PUT    /api/tasks/:id              # Update task
DELETE /api/tasks/:id              # Delete task
PATCH  /api/tasks/:id/complete     # Toggle completion status
```

### Advanced Operations
```
POST   /api/tasks/reorder          # Reorder tasks
GET    /api/tasks/statistics       # Get task analytics
DELETE /api/tasks/bulk             # Bulk delete tasks
PATCH  /api/tasks/bulk/complete    # Bulk update completion
```

### System Endpoints
```
GET    /health                     # Health check
GET    /                          # API information
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/task_manager_dev"

# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration
API_PREFIX=/api
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
JWT_SECRET=your-super-secret-jwt-key-here-make-it-at-least-32-characters-long
BCRYPT_ROUNDS=12

# Logging
LOG_LEVEL=info
```

### 3. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations (if you have a database ready)
npx prisma db push

# Or create a new migration
npx prisma migrate dev --name init
```

### 4. Build and Run
```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test
```

## 🐳 Docker Setup (Recommended)

The easiest way to run the application is using Docker. This approach automatically sets up PostgreSQL and the API with the correct configuration.

### Prerequisites
- Docker
- Docker Compose

### Quick Start with Docker

1. **Clone and navigate to the project**
```bash
git clone <repository-url>
cd task-manager/backend
```

2. **Start in development mode**
```bash
# Start PostgreSQL and API in development mode with hot reload
npm run docker:dev

# Or using docker compose directly
docker compose up postgres api-dev
```

3. **Access the application**
- API: http://localhost:3002
- Database: PostgreSQL on localhost:5433
- Health check: http://localhost:3002/health

### Docker Commands

```bash
# Development with hot reload
npm run docker:dev

# Production mode
npm run docker:prod

# Start only the database
npm run docker:db

# Start database with pgAdmin for database management
npm run docker:pgadmin
# Then access pgAdmin at http://localhost:5050
# Email: admin@taskmanager.com, Password: admin123

# View logs
npm run docker:logs

# Stop all services
npm run docker:down

# Clean up (remove volumes and images)
npm run docker:clean

# Rebuild containers
npm run docker:build
```

### Docker Services

The `docker-compose.yml` includes:

- **postgres**: PostgreSQL 15 database
  - Port: 5433 (external), 5432 (internal)
  - Database: `task_manager_dev`
  - User: `postgres`
  - Password: `postgres`

- **api-dev**: Node.js API (development)
  - Port: 3002 (external), 3001 (internal)
  - Hot reload enabled
  - Automatic database migrations

- **api**: Node.js API (production)
  - Port: 3002 (external), 3001 (internal)
  - Optimized build
  - Use with `--profile production`

- **pgadmin**: Database management UI (optional)
  - Port: 5050
  - Database connection: postgres:5432 (internal) or localhost:5433 (external)
  - Use with `--profile tools`

### Environment Variables in Docker

Environment variables are pre-configured in `docker-compose.yml`. For custom configuration, create a `.env` file or modify the `docker-compose.yml` file.

Default configuration:
- Database: `postgresql://postgres:postgres@postgres:5432/task_manager_dev`
- Port: 3002 (external), 3001 (internal)
- CORS Origin: http://localhost:3000

## 📊 Task Data Model

```typescript
interface Task {
  id: string;              // UUID
  title: string;           // 1-100 characters
  description?: string;    // 0-500 characters (optional)
  dueDate?: Date;         // Due date (optional)
  priority: 1 | 2 | 3;    // Low(1), Medium(2), High(3)
  completed: boolean;      // Completion status
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-updated
  completedAt?: Date;     // Completion timestamp (optional)
  orderIndex: number;     // For manual ordering
}
```

## 🔍 API Usage Examples

### Create Task
```bash
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": 2,
    "dueDate": "2024-12-31T23:59:59Z"
  }'
```

### Get Tasks with Filtering
```bash
# Get completed tasks
curl "http://localhost:3002/api/tasks?status=completed"

# Get high priority tasks
curl "http://localhost:3002/api/tasks?priority=3"

# Search tasks
curl "http://localhost:3002/api/tasks?search=documentation"

# Pagination
curl "http://localhost:3002/api/tasks?page=2&limit=10"

# Sort by due date
curl "http://localhost:3002/api/tasks?sortBy=dueDate&sortOrder=asc"
```

### Update Task
```bash
curl -X PUT http://localhost:3002/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated task title",
    "completed": true
  }'
```

### Toggle Completion
```bash
curl -X PATCH http://localhost:3002/api/tasks/{task-id}/complete
```

### Get Statistics
```bash
curl http://localhost:3002/api/tasks/statistics
```

## 📈 Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully",
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "hasMore": true,
    "totalPages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": ["Detailed error messages"],
  "code": "ERROR_CODE"
}
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## 🏗️ Architecture

### Layer Structure
```
Controllers → Services → Repositories → Database
     ↓           ↓           ↓            ↓
  HTTP Logic  Business    Data Access  PostgreSQL
              Logic
```

### Key Components

- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic and validation
- **Repositories**: Database operations with Prisma
- **Middleware**: Error handling, validation, security
- **Types**: TypeScript definitions and Zod schemas

## 🔒 Security Features

- **Input Validation**: Zod schema validation
- **Rate Limiting**: Configurable request limits
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Input Sanitization**: XSS prevention
- **Error Handling**: No sensitive data exposure

## 🚦 Business Rules

- **High Priority Tasks**: Must have a due date
- **Due Dates**: Must be in the future
- **Completion**: Auto-sets `completedAt` timestamp
- **Order Management**: Automatic task ordering
- **Validation**: Comprehensive input validation

## 📋 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment mode | development |
| `CORS_ORIGIN` | Allowed CORS origin | http://localhost:3000 |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window (ms) | 900000 |

## 🐛 Debugging

### Development Mode
```bash
npm run dev
```

### View Database
```bash
npx prisma studio
```

## 🔧 Troubleshooting

### Common Docker Issues

**Port already in use:**
```bash
# Check what's using the port
lsof -i :3002
lsof -i :5433

# Stop conflicting services
npm run docker:down
```

**Database connection failed:**
```bash
# Ensure PostgreSQL container is running
docker compose ps

# Check database logs
docker compose logs postgres

# Reset database
npm run docker:down
docker volume rm backend_postgres_data
npm run docker:dev
```

**Container build fails:**
```bash
# Clean Docker cache and rebuild
npm run docker:clean
npm run docker:build
```

**Permission denied errors:**
```bash
# Fix file permissions (Linux/macOS)
sudo chown -R $USER:$USER .
```

### Development Issues

**TypeScript compilation errors:**
```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

**Prisma issues:**
```bash
# Regenerate Prisma client
npm run db:generate

# Reset database schema
npm run db:push
```

**Module not found errors:**
```bash
# Clear npm cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Quick Commands (with Makefile)

If you have `make` installed, you can use these shortcuts:
```bash
make help          # Show all available commands
make dev           # Start development environment
make logs          # View container logs
make clean         # Clean up everything
make db-shell      # Access database shell
make shell         # Access API container shell
```

### Getting Help

1. Check container logs: `npm run docker:logs`
2. Verify container status: `docker compose ps`
3. Test API health: `curl http://localhost:3002/health`
4. Access database: Visit http://localhost:5050 (pgAdmin)

# Task Manager Application

A modern, full-stack task management application built with React, TypeScript, Node.js, and PostgreSQL. Features a responsive UI with virtualized task lists, real-time updates, drag-and-drop functionality, and comprehensive task analytics.

## 🌐 Live Demo

**🚀 [Frontend-Only Demo](https://develop.d6kzfjr24jspp.amplifyapp.com)**  
*Note: This is a frontend-only deployment for UI demonstration. Backend functionality is not available in this demo.*

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with dark/light theme support
- **Task Management**: Create, edit, delete, and organize tasks with priorities and due dates
- **Virtualized Lists**: High-performance rendering of large task lists with infinite scrolling
- **Drag & Drop**: Intuitive task reordering with visual feedback
- **Real-time Updates**: Optimistic UI updates with toast notifications
- **Analytics Dashboard**: Task statistics with interactive charts and completion metrics
- **Bulk Operations**: Select and perform actions on multiple tasks
- **Data Generation**: Built-in tools for generating test data
- **API Integration**: RESTful backend with comprehensive error handling

## 🏗️ Architecture

- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS + Shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL with Docker support
- **State Management**: React Query (TanStack Query) for server state
- **Virtualization**: TanStack Virtual for performance optimization
- **Styling**: TailwindCSS with custom component library

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for database)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ThisaST/smart-task-manager
cd smart-task-manager
```

### 2. Backend Setup with Docker (Recommended)

The backend is designed to run with Docker for easy setup and consistent environment:

#### Option A: Full Docker Setup (Database + API)
```bash
cd backend

# Start both database and API in development mode
docker-compose up postgres api-dev -d

# Check logs to ensure everything is running
docker-compose logs -f
```

#### Option B: Database Only + Native API (For Development)
```bash
cd backend

# Start only the PostgreSQL database
docker-compose up postgres -d

# Install dependencies and run API natively
npm install
npm run dev
```

#### Option C: With Database Management UI
```bash
cd backend

# Start database, API, and pgAdmin
docker-compose --profile tools up -d
```

**Services will be available at:**
- **Backend API**: `http://localhost:3002`
- **Database**: `localhost:5433`
- **pgAdmin** (if using Option C): `http://localhost:5050`

**Database Credentials:**
- Database: `task_manager_dev`
- Username: `postgres`
- Password: `postgres`
- Port: `5433` (external), `5432` (internal)

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional)
cp .env.example .env

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Verify Setup

Once both services are running, verify the setup:

```bash
# Test backend API
curl http://localhost:3002/api/health

# Expected response:
# {"success":true,"data":{"status":"healthy","timestamp":"..."}}

# Test database connection
cd backend
docker-compose exec postgres psql -U postgres -d task_manager_dev -c "SELECT NOW();"
```

## 🌐 API Documentation

The backend provides a RESTful API with the following endpoints:

### Core Endpoints
- `GET /api/health` - API health check
- `GET /api/tasks` - Get paginated tasks with filtering
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Toggle completion

### Analytics
- `GET /api/tasks/statistics` - Task statistics for dashboard

### Bulk Operations
- `POST /api/tasks/bulk` - Bulk create tasks
- `DELETE /api/tasks/bulk` - Bulk delete tasks
- `PATCH /api/tasks/bulk/complete` - Bulk toggle completion

**Example API Usage:**
```bash
# Get all tasks
curl "http://localhost:3002/api/tasks?limit=10&page=1"

# Create a task
curl -X POST http://localhost:3002/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","priority":2,"description":"A test task"}'

# Get statistics
curl http://localhost:3002/api/tasks/statistics
```

## 📁 Project Structure

```
task-manager/
├── backend/                 # Node.js backend application
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── services/        # Business logic
│   │   ├── repositories/    # Data access layer
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   ├── prisma/              # Database schema and migrations
│   ├── docker/              # Docker configuration
│   └── package.json
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── modules/         # Feature-specific modules
│   │   │   ├── tasks/       # Task management module
│   │   │   └── dashboard/   # Analytics dashboard module
│   │   ├── shared/          # Shared utilities and services
│   │   ├── pages/           # Page components
│   │   └── store/           # State management
│   └── package.json
└── README.md               # This file
```

## 🔧 Development

### Backend Development

#### Docker-based Development (Recommended)
```bash
cd backend

# Start development environment
docker-compose up postgres api-dev -d

# View logs
docker-compose logs -f api-dev

# Run tests (in container)
docker-compose exec api-dev npm test

# Access Prisma Studio
docker-compose exec api-dev npx prisma studio

# Stop development environment
docker-compose down
```

#### Native Development (Alternative)
```bash
cd backend

# Start database only
docker-compose up postgres -d

# Run API natively
npm install
npm run dev

# Run tests
npm test

# Database operations
npm run db:migrate    # Run pending migrations
npm run db:seed      # Seed database with sample data
npm run db:reset     # Reset database and seed
npm run db:studio    # Open Prisma Studio
```

#### Production Build
```bash
cd backend

# Build for production
npm run build

# Start production stack
docker-compose --profile production up -d
```

### Frontend Development

```bash
cd frontend

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint

# Run type checking
npm run type-check
```

## 🔒 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/task_manager_dev
NODE_ENV=development
PORT=3002
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3002/api
```

## 🐳 Docker Support

The backend is fully containerized with Docker Compose for easy development and deployment.

### Available Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| `postgres` | `task-manager-postgres` | `5433:5432` | PostgreSQL database |
| `api-dev` | `task-manager-api-dev` | `3002:3001` | Development API with hot reload |
| `api` | `task-manager-api` | `3002:3001` | Production API |

### Docker Commands

```bash
cd backend

# Development setup (recommended)
docker-compose up postgres api-dev -d

# Database only
docker-compose up postgres -d

# With database management UI
docker-compose --profile tools up -d

# Production mode
docker-compose --profile production up postgres api -d

# View logs
docker-compose logs -f api-dev
docker-compose logs postgres

# Stop services
docker-compose down

# Rebuild and restart
docker-compose up --build postgres api-dev -d

# View running containers
docker-compose ps
```

### Database Management

**Connect to PostgreSQL directly:**
```bash
# From host machine
psql -h localhost -p 5433 -U postgres -d task_manager_dev

# From Docker container
docker-compose exec postgres psql -U postgres -d task_manager_dev
```

## 🐛 Troubleshooting

### Docker Issues

**Docker not running:**
```bash
# Check Docker status
docker --version
docker-compose --version

# Start Docker daemon (varies by OS)
# macOS: Start Docker Desktop
# Linux: sudo systemctl start docker
```

**Container startup failures:**
```bash
# Check container status
docker-compose ps

# View detailed logs
docker-compose logs postgres
docker-compose logs api-dev

# Restart specific service
docker-compose restart postgres

# Rebuild and restart
docker-compose down
docker-compose up --build postgres api-dev -d
```

**Database connection issues:**
```bash
# Check database health
docker-compose exec postgres pg_isready -U postgres

# Reset database completely
docker-compose down -v  # Remove volumes
docker-compose up postgres -d

# Connect to database manually
docker-compose exec postgres psql -U postgres -d task_manager_dev
```

### Port Conflicts

**Check for port conflicts:**
```bash
# Check if ports are in use
lsof -i :3002  # Backend API
lsof -i :5433  # PostgreSQL
lsof -i :5050  # pgAdmin
lsof -i :3000  # Frontend

# Kill process using port (if needed)
kill -9 $(lsof -t -i:3002)
```

**Change ports if needed:**
- Edit `docker-compose.yml` for backend services
- Update `VITE_API_BASE_URL` in frontend `.env`

### Common Development Issues

**Module not found errors:**
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend  
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Prisma/Database schema issues:**
```bash
cd backend

# Reset Prisma client
docker-compose exec api-dev npx prisma generate

# Reset database schema
docker-compose exec api-dev npx prisma db push --force-reset

# View database in Prisma Studio
docker-compose exec api-dev npx prisma studio
```

**Environment variable issues:**
```bash
# Check if environment file exists
ls -la backend/.env

# Verify environment variables in container
docker-compose exec api-dev env | grep DATABASE_URL
```

-- Task Manager Database Initialization Script
-- This script runs when the PostgreSQL container starts for the first time

-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE task_manager_dev'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'task_manager_dev')\gexec

-- Connect to the database
\c task_manager_dev;

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- You can add any additional database setup here
-- For example, creating additional users, setting permissions, etc.

-- Grant all privileges to the postgres user
GRANT ALL PRIVILEGES ON DATABASE task_manager_dev TO postgres; 
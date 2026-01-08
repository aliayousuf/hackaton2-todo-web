# Database Schema: Task CRUD Operations with Authentication

**Feature**: Task CRUD Operations with Authentication (Phase II)
**Date**: 2026-01-04
**Branch**: 001-task-crud-auth

## Executive Summary

This document defines the database schema for the Task CRUD Operations with Authentication feature. The schema implements user authentication and task management with strict security requirements for data isolation and integrity.

## 1. Entity Definitions

### 1.1 User Entity
- **Table Name**: `users`
- **Purpose**: Stores authenticated user accounts with secure password hashing

**Fields**:
- `id` (UUID, Primary Key, NOT NULL, Default: gen_random_uuid())
  - Unique identifier for each user
  - Immutable once assigned
- `email` (VARCHAR(255), NOT NULL, UNIQUE, INDEX)
  - User's email address for authentication
  - Case-insensitive uniqueness enforced
- `password_hash` (VARCHAR(255), NOT NULL)
  - Bcrypt-hashed password (no plaintext storage)
  - Minimum 8 characters enforced at application level
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, Default: NOW())
  - Account creation timestamp (ISO 8601 format)
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, Default: NOW())
  - Last update timestamp (auto-updated by trigger)

**Constraints**:
- UNIQUE(email)
- CHECK(email matches email format pattern)

**Indexes**:
- Primary Key: id
- Unique Index: email (for fast lookups and uniqueness)

### 1.2 Task Entity
- **Table Name**: `tasks`
- **Purpose**: Stores todo items belonging to specific users with completion tracking

**Fields**:
- `id` (INTEGER, Primary Key, NOT NULL, Auto-increment)
  - Unique identifier for each task
  - Immutable once assigned
- `user_id` (UUID, NOT NULL, FOREIGN KEY → users.id, INDEX)
  - Owner reference (foreign key to users table)
  - Critical for user data isolation
- `title` (VARCHAR(200), NOT NULL)
  - Task title (1-200 characters)
  - Required field for all tasks
- `description` (TEXT, NULL)
  - Optional detailed task description (max 1000 characters)
  - NULL if no description provided
- `completed` (BOOLEAN, NOT NULL, Default: FALSE, INDEX)
  - Completion status (true/false)
  - Indexed for efficient status queries
- `created_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, Default: NOW())
  - Task creation timestamp (ISO 8601 format)
- `updated_at` (TIMESTAMP WITH TIME ZONE, NOT NULL, Default: NOW())
  - Last update timestamp (auto-updated by trigger)

**Constraints**:
- FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
- CHECK(title length between 1 and 200)
- CHECK(description length <= 1000)

**Indexes**:
- Primary Key: id
- Foreign Key Index: user_id (for fast user filtering)
- Index: completed (for status-based queries)
- Composite Index: (user_id, created_at) for efficient user task retrieval with sorting

## 2. Relationships

### 2.1 User → Tasks (One-to-Many)
- **Relationship**: One User owns Many Tasks
- **Implementation**: Foreign key `user_id` in `tasks` table references `users.id`
- **Cascade Behavior**: ON DELETE CASCADE - deleting user removes all their tasks
- **Critical Security Pattern**: ALL task queries must filter by `user_id` to prevent data leakage

## 3. Security Patterns

### 3.1 Critical Data Isolation
- **Pattern**: ALL database queries must filter by authenticated user's user_id
- **Implementation**:
  ```sql
  -- CORRECT: Always filter by user_id
  SELECT * FROM tasks WHERE user_id = $CURRENT_USER_ID;

  -- FORBIDDEN: Could expose other users' data
  SELECT * FROM tasks WHERE completed = true; -- Missing user_id filter
  ```

### 3.2 404 vs 403 Response Pattern
- **Pattern**: Return 404 (Not Found) instead of 403 (Forbidden) when user attempts to access another user's resources
- **Rationale**: Prevents information leakage about resource existence
- **Implementation**: Application layer verifies user_id matches JWT token before returning any data

## 4. SQL Schema Definition

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Indexes for performance and security
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_user_created ON tasks(user_id, created_at);

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Constraint for email format validation
ALTER TABLE users
ADD CONSTRAINT email_format_check
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Constraints for field length validation
ALTER TABLE tasks
ADD CONSTRAINT title_length_check
CHECK (LENGTH(title) BETWEEN 1 AND 200);

ALTER TABLE tasks
ADD CONSTRAINT description_length_check
CHECK (description IS NULL OR LENGTH(description) <= 1000);
```

## 5. Migration Strategy

### 5.1 Alembic Migrations
- **Tool**: Alembic for database schema migrations
- **Pattern**: Version-controlled migration files
- **Strategy**:
  - Generate migrations from model changes
  - Test migrations in development environment
  - Apply to production with rollback capability

### 5.2 Example Migration Commands
```bash
# Generate migration from model changes
alembic revision --autogenerate -m "Add users and tasks tables"

# Apply migrations
alembic upgrade head

# Check current migration status
alembic current

# Rollback if needed
alembic downgrade -1
```

## 6. Performance Considerations

### 6.1 Indexing Strategy
- **Primary Keys**: Automatically indexed
- **Foreign Keys**: user_id in tasks table (critical for user isolation)
- **Frequently Queried Fields**: completed status for filtering
- **Composite Indexes**: (user_id, created_at) for efficient user task retrieval with sorting

### 6.2 Query Optimization
- **Pattern**: Always filter by user_id first in WHERE clauses
- **Example**: `SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC`
- **Avoid**: Queries that don't filter by user_id (security risk and performance issue)

## 7. Data Integrity

### 7.1 Referential Integrity
- **Foreign Key Constraints**: Ensure task.user_id always references valid user
- **Cascade Delete**: Remove tasks when user is deleted
- **NOT NULL Constraints**: Ensure required fields are always present

### 7.2 Validation Constraints
- **Email Format**: Regular expression validation
- **Field Lengths**: Title (1-200), Description (max 1000)
- **Data Types**: Proper type enforcement at database level

## 8. Security Audit Points

### 8.1 Regular Checks
- Verify all queries filter by user_id
- Monitor for unauthorized access attempts
- Review application logs for potential security issues

### 8.2 Penetration Testing
- Test for SQL injection vulnerabilities
- Verify 404 vs 403 responses
- Test user data isolation boundaries
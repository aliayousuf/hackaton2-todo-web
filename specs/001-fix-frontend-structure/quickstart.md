# Quickstart Guide: Frontend Structure and UI Fixes

## Prerequisites
- Node.js 18+
- npm or yarn package manager
- Access to backend API (running on http://localhost:8000 by default)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   # Update NEXT_PUBLIC_API_URL if backend is not on localhost:8000
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   # Application will be available at http://localhost:3000
   ```

## Key Components

### Authentication Flow
- `/auth/login` - User login page
- `/auth/register` - User registration page

### Task Management
- `/dashboard` - Main task management interface
- Components in `/components/tasks/` handle task operations

### State Management
- API calls in `/lib/api.ts`
- Task state managed in dashboard page and passed to components

## Common Issues Fixed
- Import errors resolved with proper module paths
- State conflicts addressed between parent and child components
- UI visibility issues fixed with proper Tailwind classes
- API integration improved for consistent data flow
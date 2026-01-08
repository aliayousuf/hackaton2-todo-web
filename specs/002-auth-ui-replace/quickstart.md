# Quickstart: Card-Based Authentication UI

## Development Setup

### Prerequisites
- Node.js 18+ with npm/yarn/pnpm
- Python 3.13+
- Docker (for local PostgreSQL)
- pnpm (recommended package manager)

### Initial Setup
```bash
# Clone the repository
git clone [repository-url]
cd [repository-name]

# Install backend dependencies
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
uv sync --all-extras

# Install frontend dependencies
cd ../frontend
pnpm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

### Running the Application
```bash
# Method 1: Using docker-compose (recommended)
docker-compose up --build

# Method 2: Separate terminals
# Terminal 1: Start backend
cd backend
uv run uvicorn src.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
pnpm dev
```

## Key Directories for Card-Based Auth Implementation

### Frontend Directories
```
frontend/
├── app/(auth)/          # Authentication pages (login, register)
│   ├── login/page.tsx   # Login page with card-based layout
│   └── register/page.tsx # Register page with card-based layout
├── components/auth/     # Authentication UI components
│   ├── auth-card.tsx    # Reusable auth card component
│   ├── login-form.tsx   # Login form component
│   └── register-form.tsx # Register form component
└── lib/auth.ts          # Authentication utilities
```

### Implementation Files to Update
1. **Login Page**: `frontend/app/(auth)/login/page.tsx`
2. **Register Page**: `frontend/app/(auth)/register/page.tsx`
3. **Auth Card Component**: `frontend/components/auth/auth-card.tsx`
4. **Navigation Component**: Update logout button placement

## Card-Based Auth UI Structure

### Required HTML Structure
```jsx
<div className="min-h-screen flex items-center justify-center bg-blue-500">
  <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
    {/* Auth form content */}
    <form className="flex flex-col space-y-5">
      {/* Form fields */}
    </form>
  </div>
</div>
```

### Required Styling Classes
- **Container**: `min-h-screen flex items-center justify-center bg-blue-500`
- **Card**: `w-full max-w-md bg-white p-8 rounded-xl shadow-lg`
- **Form**: `flex flex-col space-y-5`
- **Input**: `w-full rounded-md border-gray-300 focus:ring-blue-500`
- **Button**: `w-full bg-blue-600 text-white rounded-md`

### Typography Classes
- **Title**: `text-xl font-semibold text-center`
- **Helper text**: `text-sm text-gray-600 text-center`
- **Labels**: `text-sm font-medium`

## Testing the Implementation

### Frontend Tests
```bash
# Run frontend tests
cd frontend
pnpm test
pnpm test:e2e  # End-to-end tests
```

### Key Test Scenarios
1. Verify card layout renders correctly on different screen sizes
2. Test login form functionality with valid/invalid credentials
3. Test register form functionality with valid/invalid inputs
4. Verify logout button appears in navigation
5. Confirm responsive behavior at 375px, 768px, and 1280px

## Deployment

### Environment Variables
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `DATABASE_URL`: PostgreSQL connection string
- `AUTH_SECRET`: Authentication secret for JWT

### Build Commands
```bash
# Build frontend
cd frontend
pnpm build

# Build backend
cd backend
# Backend is typically deployed as a container with uv packaging
```
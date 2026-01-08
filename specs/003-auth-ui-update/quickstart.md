# Quickstart Guide: Authentication UI Split-Screen Layout

## Overview
This guide provides instructions for setting up and running the new split-screen authentication UI. The implementation maintains all existing authentication functionality while providing an improved user experience with a modern two-column layout.

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Python 3.13+ with uv package manager
- Next.js 16+ development environment
- Tailwind CSS configured in the project

## Installation Steps

### 1. Environment Setup
```bash
# Clone the repository
git clone <repository-url>
cd <project-directory>

# Install frontend dependencies
cd frontend
npm install
# or yarn install
# or pnpm install

# Install backend dependencies
cd ../backend
uv sync
```

### 2. Configuration
Ensure the following configurations are in place:

**Frontend (.env.local)**:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Backend (.env)**:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/todo_db
SECRET_KEY=your-secret-key-here
```

### 3. Running the Application
```bash
# Terminal 1: Start the backend
cd backend
uv run dev

# Terminal 2: Start the frontend
cd frontend
npm run dev
# The application will be available at http://localhost:3000
```

## Key Features

### Split-Screen Layout
- **Left Panel**: Deep navy blue background with "Hello! Have a GOOD DAY" text and decorative geometric shapes
- **Right Panel**: Clean white background containing login/register forms
- **Responsive**: Left panel automatically hides on screens smaller than 1024px (lg breakpoint)

### Component Structure
The new UI is implemented using the following components:
- `SplitScreenAuth.tsx`: Main container component
- `LeftPanel.tsx`: Decorative panel with welcome text and shapes
- `RightPanel.tsx`: Form container with authentication UI
- Updated `LoginForm.tsx` and `RegisterForm.tsx` components

### Tailwind CSS Classes Used
- `flex` and `flex-row` for the main layout
- `hidden lg:flex` to hide left panel on mobile
- `bg-navy-900` for deep navy blue background
- `bg-white` for clean white panel
- `rounded-xl` and `shadow-lg` for card styling

## Testing the Authentication Flow

### Login Flow
1. Navigate to `http://localhost:3000/login`
2. Verify the split-screen layout appears correctly
3. On mobile devices, verify only the right panel is visible
4. Enter valid credentials and click "Login"
5. Verify successful authentication and redirection

### Registration Flow
1. Navigate to `http://localhost:3000/register`
2. Verify the split-screen layout appears correctly
3. Enter valid email and password
4. Click "Sign up" and verify account creation

### Responsive Testing
- Resize browser window to test responsive behavior
- Use browser developer tools to simulate mobile devices
- Verify left panel disappears at lg breakpoint (1024px)

## Troubleshooting

### Common Issues
- **Layout not appearing correctly**: Verify Tailwind CSS is properly configured
- **Left panel not hiding on mobile**: Check Tailwind configuration includes lg breakpoint
- **Geometric shapes not displaying**: Verify SVG implementation is correct
- **Authentication not working**: Ensure backend API endpoints are accessible

### Development Commands
```bash
# Run frontend in development mode
npm run dev

# Build frontend for production
npm run build

# Run frontend tests
npm run test

# Check Tailwind CSS configuration
npx tailwindcss -i ./src/input.css -o ./dist/output.css --watch
```

## Next Steps
1. Customize the geometric shapes to match brand guidelines
2. Adjust colors to match company branding
3. Add animations for enhanced user experience
4. Implement accessibility enhancements
5. Add internationalization support if needed
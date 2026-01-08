# Quickstart Guide: Authentication UI Flat Rewrite

## Overview
This guide provides instructions for setting up and running the flattened authentication UI. The implementation maintains all existing authentication functionality while providing an improved user experience with a simplified component structure. The new design features a split-screen layout with a deep navy blue left panel containing "Hello! Have a GOOD DAY" text and decorative geometric shapes, and a clean white right panel containing login/register forms.

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

### Flattened Component Structure
- **SplitScreenAuth.tsx**: Main component containing both left and right panels in one file
- **LoginForm.tsx**: Updated with enhanced styling and spacing
- **RegisterForm.tsx**: Updated with enhanced styling and spacing

### Split-Screen Layout
- **Left Panel**: Deep navy blue background (#0a0a3c) with "Hello! Have a GOOD DAY" text and decorative geometric shapes
- **Right Panel**: Clean white background containing login/register forms
- **Responsive**: Left panel automatically hides on screens smaller than 1024px (lg breakpoint)

### Enhanced Form Styling
- Forms wrapped in div with `w-full max-w-[420px]`
- Headers with `text-4xl font-bold text-slate-900 mb-10`
- Inputs with `border border-slate-200 rounded-xl px-4 py-4 mb-6`
- Buttons with `bg-[#0a0a3c] hover:bg-slate-800 text-white py-5 rounded-xl text-xl font-bold mt-4 transition-all shadow-xl`

### Tailwind CSS Classes Used
- `min-h-screen flex flex-col lg:flex-row overflow-hidden` for main container
- `hidden lg:flex lg:w-1/2 bg-[#0a0a3c] items-center justify-center relative p-12` for left panel
- `w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8 md:p-24` for right panel
- `text-6xl font-bold leading-tight z-10` for branding text
- Various opacity-20 classes for decorative elements

## Testing the Authentication Flow

### Login Flow
1. Navigate to `http://localhost:3000/login`
2. Verify the flattened split-screen layout appears correctly
3. On mobile devices, verify only the right panel is visible
4. Enter valid credentials and click "Login"
5. Verify successful authentication and redirection

### Registration Flow
1. Navigate to `http://localhost:3000/register`
2. Verify the flattened split-screen layout appears correctly
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
- **Geometric shapes not displaying**: Verify absolute positioning is working correctly
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
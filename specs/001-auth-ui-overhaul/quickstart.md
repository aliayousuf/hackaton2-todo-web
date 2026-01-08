# Quickstart Guide: Auth UI Overhaul

## Overview
Quick guide to understand and implement the authentication UI overhaul that addresses visual and accessibility issues.

## Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Understanding of Next.js 16+ App Router
- Familiarity with Tailwind CSS
- TypeScript 5.4+ knowledge

## Running the Application

### 1. Start the Backend Server
```bash
cd backend
uv venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
uv pip install -e .
uvicorn src.main:app --reload --port 8000
```

### 2. Start the Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```

### 3. Access the Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Key Components

### SplitScreenAuth.tsx (Updated)
Location: `frontend/components/auth/SplitScreenAuth.tsx`
- Consolidates LeftPanel and RightPanel functionality
- Implements responsive split-screen layout
- Handles desktop/mobile view transitions
- Includes decorative navy panel with branding

### LoginForm.tsx
Location: `frontend/components/auth/LoginForm.tsx`
- Updated styling for proper contrast and layout
- Password visibility toggle functionality
- Form validation and error handling

### RegisterForm.tsx
Location: `frontend/components/auth/RegisterForm.tsx`
- Updated styling to match LoginForm
- Dual password fields with confirmation
- Consistent styling with login form

### Authentication Pages
- `frontend/app/(auth)/login/page.tsx` - Login page
- `frontend/app/(auth)/register/page.tsx` - Registration page

## Implementation Steps

### 1. Component Consolidation
- Merge LeftPanel and RightPanel logic into SplitScreenAuth.tsx
- Remove redundant component files
- Ensure all functionality remains intact

### 2. Layout Centering
- Apply flex-centering classes to properly center forms
- Update container styling to eliminate top-left positioning
- Maintain responsive behavior across devices

### 3. Contrast Corrections
- Apply `!text-white` to buttons to override CSS conflicts
- Ensure all text meets WCAG 2.1 AA contrast ratios
- Test across different backgrounds and states

### 4. Visual Polish
- Add decorative SVG elements to the navy panel
- Implement proper typography for the branding text
- Ensure desktop users see the complete split-screen design

## Testing the Changes

### Visual Testing
1. Navigate to `/login` and `/register` pages
2. Verify button text is visible (no black-on-black)
3. Confirm forms are centered (not in top-left corner)
4. Check navy panel appears on desktop screens
5. Validate responsive behavior on mobile devices

### Accessibility Testing
1. Test keyboard navigation through forms
2. Verify screen reader compatibility
3. Confirm focus indicators are visible
4. Check contrast ratios meet WCAG 2.1 AA standards

### Cross-Browser Testing
1. Test in Chrome, Firefox, Safari, and Edge
2. Verify layout consistency
3. Confirm interactive elements work properly

## Troubleshooting

### Common Issues
1. **Button text still invisible**: Check that `!text-white` class is applied correctly
2. **Layout still squashed**: Verify flex-centering classes are properly applied
3. **Navy panel missing**: Ensure desktop breakpoint classes are correct
4. **Form not centered**: Check that container has proper flex-centering classes

### Debugging Tips
- Use browser dev tools to inspect computed styles
- Verify Tailwind CSS is properly loaded
- Check for CSS conflicts with globals.css
- Validate responsive breakpoints are working as expected
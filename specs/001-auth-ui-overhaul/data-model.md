# Data Model: Authentication UI Components

## Overview
Data model for the authentication UI components that will be updated during the overhaul process. This includes the structure and properties of the UI components themselves rather than user data entities.

## SplitScreenAuth Component

### Properties
- **children** (ReactNode): Form content to be displayed in the right panel
- **mode** (enum: 'login' | 'register'): Determines which form is being displayed
- **rightPanelConfig** (object): Configuration for the right panel including:
  - title (string): Panel title text
  - buttonText (string): Submit button text
  - footerText (string): Footer descriptive text
  - footerLink (string): Link destination for the footer
  - footerLinkText (string): Text for the footer link

### Visual Elements
- **Left Panel**: Hidden on mobile, visible on desktop (>1024px)
  - Background color: `bg-[#0a0a3c]` (dark navy)
  - Decorative graphic: Circular border element positioned absolutely
  - Branding text: "Hello! Have a GOOD DAY" in large white font
- **Right Panel**: Visible on all screen sizes
  - Background color: White
  - Centered container for form content
  - Responsive padding (p-8 on mobile, md:p-16 on medium+ screens)

## LoginForm Component

### Props Interface
- **onLogin** (function): Callback for login submission with email and password
- **onLoginSuccess** (function): Callback for successful login
- **onError** (function): Callback for error handling

### Internal State
- **email** (string): Current email input value
- **password** (string): Current password input value
- **showPassword** (boolean): Toggle for password visibility
- **formErrors** (object): Error messages for form fields
  - email (string): Email validation error
  - password (string): Password validation error
  - general (string): General form errors

## RegisterForm Component

### Props Interface
- **onRegister** (function): Callback for registration submission with email and password
- **onRegisterSuccess** (function): Callback for successful registration
- **onError** (function): Callback for error handling

### Internal State
- **email** (string): Current email input value
- **password** (string): Current password input value
- **confirmPassword** (string): Confirmation password input value
- **showPassword** (boolean): Toggle for password visibility
- **showConfirmPassword** (boolean): Toggle for confirm password visibility
- **formErrors** (object): Error messages for form fields
  - email (string): Email validation error
  - password (string): Password validation error
  - confirmPassword (string): Confirm password validation error
  - general (string): General form errors

## UI Styling Attributes

### Container Classes
- **Max Width**: `max-w-[420px]` for consistent form width
- **Flex Direction**: `flex-col` for vertical layout
- **Spacing**: Consistent margins and padding for visual rhythm

### Input Field Classes
- **Border**: `border border-gray-200` for subtle borders
- **Rounding**: `rounded-xl` for rounded corners
- **Padding**: `px-5 py-4` for comfortable touch targets
- **Margin**: `mb-6` for consistent spacing
- **Typography**: `text-lg` for readability
- **Focus**: `focus:ring-2 focus:ring-[#0a0a3c]` for focus indication
- **Outline**: `outline-none` to replace default outline
- **Text Color**: `text-slate-900` for dark text
- **Background**: `!bg-white` to override any inherited background

### Button Classes
- **Background**: `bg-[#0a0a3c]` for consistent dark blue
- **Text Color**: `text-white !text-white` to ensure visibility
- **Padding**: `py-5` for comfortable touch target height
- **Rounding**: `rounded-xl` for rounded corners
- **Typography**: `text-xl font-bold` for emphasis
- **Margin**: `mt-4` for top spacing
- **Shadow**: `shadow-2xl` for depth
- **Hover**: `hover:bg-slate-800` for interaction feedback
- **Transition**: `transition-all` for smooth state changes
- **Flex Alignment**: `flex items-center justify-center` for centering content
- **Border**: `border-none` to remove default button border

### Responsive Behavior
- **Desktop**: Split-screen layout with navy panel on left and form on right
- **Mobile**: Single-column layout with form taking full width
- **Breakpoint**: lg (>= 1024px) for showing split-screen layout

## Validation and Accessibility Attributes

### ARIA Labels
- **Input Fields**: Proper labels with htmlFor associations
- **Password Toggle**: Dynamic aria-label based on visibility state
- **Error Messages**: Role="alert" and aria-live="polite" for accessibility

### Focus Management
- **Input Fields**: Outline removed but focus ring added for visibility
- **Buttons**: Clear focus states for keyboard navigation
- **Error Elements**: Proper tab indexing and focus management

## Component Relationships

### Parent-Child Relationships
- **SplitScreenAuth** → Contains → **LoginForm/RegisterForm**
- **LoginForm/RegisterForm** → Contains → Input fields, buttons, error messages
- **Auth Pages** → Contains → **SplitScreenAuth** wrapper

### Data Flow
- **Props**: Configuration and callback functions flow from pages to components
- **State**: Internal state maintained within form components
- **Callbacks**: State changes communicated upward through callback functions
# Data Model: Dashboard UI/UX Overhaul

**Feature**: 006-dashboard-ui-ux-overhaul
**Created**: 2026-01-08
**Purpose**: Define key entities and their relationships for the UI/UX overhaul

## Key Entities

### 1. Task
**Representation**: A todo item with title, description, completion status, and timestamps
**Attributes**:
- id: number (unique identifier)
- user_id: string (UUID as string - identifies owner)
- title: string (task title, 1-200 characters)
- description: string (optional detailed text, max 1000 characters)
- completed: boolean (completion status)
- created_at: string (ISO date string for creation timestamp)
- updated_at: string (ISO date string for last update timestamp)

**Relationships**:
- Belongs to a User (via user_id foreign key)
- Displayed in TaskItem component
- Managed through CreateTaskForm and TaskList components

**UI Styling Attributes**:
- Visual state based on completion status (line-through for completed)
- Timestamp display for created_at and updated_at
- Interactive elements for editing and deletion

### 2. Dashboard Layout
**Representation**: Container structure that organizes sidebar navigation, header, and main content area
**Attributes**:
- viewport control: fixed h-screen overflow-hidden shell
- sidebar/main split: rigid flex layout (sidebar flex-shrink-0, main flex-1 min-w-0)
- scrolling behavior: only task list container is scrollable (overflow-y-auto)

**Relationships**:
- Contains Sidebar component
- Contains Header component
- Contains main content area with TaskList and CreateTaskForm

**UI Styling Attributes**:
- Background color: Slate-50
- Flex-based layout structure
- Overflow control for proper scrolling

### 3. Sidebar
**Representation**: Navigation component that provides access to different dashboard sections
**Attributes**:
- background color: Deep Indigo-950
- navigation items: Tasks, Completed, Profile
- active state: highlighted with border and text color
- logout functionality: positioned at bottom

**Relationships**:
- Part of Dashboard Layout
- Links to different dashboard pages
- Connected to authentication context

**UI Styling Attributes**:
- Background: Indigo-950
- Text: White with high contrast
- Hover states: Purple-tinted background
- Width: Fixed w-64

### 4. Header
**Representation**: Sticky element that aligns with content width and displays user information
**Attributes**:
- positioning: sticky, top-0, z-index
- content: Dashboard title and user info/logout
- alignment: matches content width

**Relationships**:
- Part of Dashboard Layout
- Connected to authentication context for user data
- Positioned above main content

**UI Styling Attributes**:
- Glass-morphism effect with backdrop blur
- Semi-transparent background
- Sticky positioning

### 5. TaskItem
**Representation**: Individual task display with title, description, status, and action buttons
**Attributes**:
- card styling: rounded-2xl, soft shadow
- completion state: visual indicator
- edit/delete functionality: icon buttons
- timestamp display: created/updated dates

**Relationships**:
- Part of TaskList component
- Represents a Task entity
- Connected to API for updates/deletion

**UI Styling Attributes**:
- Rounded-2xl corners
- Shadow-sm base, hover:shadow-md
- Lucide icons for actions
- Refined typography for timestamps

### 6. User
**Representation**: System user with authentication and authorization
**Attributes**:
- id: string (UUID)
- email: string (user identifier)
- authentication: JWT token management
- task ownership: user_id foreign key relationship

**Relationships**:
- Owns multiple Tasks
- Interacts with Dashboard components
- Connected to authentication context

## Component Relationships

```
Dashboard Layout (Parent)
├── Sidebar (Navigation)
│   ├── Navigation Links
│   └── Logout Button
├── Header (User Info)
│   └── User Information
└── Main Content
    ├── TaskList Container
    │   └── Multiple TaskItem Components
    └── CreateTaskForm (Conditional)
```

## UI/UX Attributes Mapping

### Color Palette
- **Workspace Background**: slate-50
- **Sidebar Background**: indigo-950
- **Primary Actions**: gradient from blue-600 to purple-600
- **Text Colors**: white (sidebar), high-contrast (main content)

### Typography
- **Timestamps**: Refined, clearly formatted
- **Task Titles**: Clear hierarchy with completion indicators
- **Navigation**: High contrast for readability

### Interactive Elements
- **Buttons**: Gradient styling with smooth transitions
- **Cards**: Hover effects with shadow transitions
- **Icons**: Lucide icons for consistent visual language

## Data Flow

1. **Backend API** → **Frontend Components** (Task data synchronization)
2. **Authentication Context** → **Header/Sidebar** (User information display)
3. **User Actions** → **API Calls** → **Component Updates** (Task management flow)
4. **Layout Structure** → **Responsive Behavior** (Viewport control and scrolling)

## Styling Dependencies

- **globals.css**: Base color variables and utility classes
- **Tailwind CSS**: Utility classes for layout, colors, and effects
- **Lucide React**: Icon components for visual consistency
- **Next.js App Router**: Component structure and routing
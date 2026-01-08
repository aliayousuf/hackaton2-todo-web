# Data Model: Authentication UI Split-Screen Layout

## Overview
This data model describes the entities and relationships for the split-screen authentication UI. Since this is primarily a UI/UX feature with no changes to the underlying data structures, the model focuses on the UI components and their properties.

## UI Components

### SplitScreenAuth Component
- **Purpose**: Container for the two-column split-screen layout
- **Properties**:
  - layoutType: "split-screen" (fixed value)
  - leftPanelVisibility: boolean (controls responsive behavior)
  - leftPanelContent: LeftPanelContent object
  - rightPanelContent: RightPanelContent object

### LeftPanelContent
- **Purpose**: Data structure for the left panel content
- **Properties**:
  - backgroundColor: string (CSS color value, e.g., "bg-navy-900")
  - welcomeText: string ("Hello! Have a GOOD DAY")
  - geometricShapes: Array<GeometricShape>
  - responsiveHiddenBreakpoint: string ("lg" for Tailwind CSS)

### RightPanelContent
- **Purpose**: Data structure for the right panel content
- **Properties**:
  - backgroundColor: string (CSS color value, e.g., "bg-white")
  - formType: "login" | "register"
  - formTitle: string ("Login" or "Sign up")
  - formFields: Array<FormField>
  - submitButtonText: string ("Login" or "Sign up")
  - footerText: string ("Don't have an account? Create an account")

### FormField
- **Purpose**: Represents individual form input fields
- **Properties**:
  - type: "email" | "password" | "text"
  - label: string ("Email" | "Password")
  - placeholder: string
  - validationRules: Array<ValidationRule>
  - styling: FormFieldStyling

### FormFieldStyling
- **Purpose**: Styling properties for form fields
- **Properties**:
  - borderWidth: string ("border" or specific width)
  - borderColor: string ("border-gray-300")
  - borderRadius: string ("rounded-md")
  - focusRingColor: string ("focus:ring-blue-500")

### GeometricShape
- **Purpose**: Defines decorative geometric shapes in the left panel
- **Properties**:
  - shapeType: "circle" | "arc" | "rectangle" | "polygon"
  - position: { x: number, y: number }
  - size: { width: number, height: number }
  - color: string
  - opacity: number
  - rotation: number (degrees)

### ValidationRule
- **Purpose**: Defines validation requirements for form fields
- **Properties**:
  - ruleType: "required" | "email" | "minLength" | "maxLength" | "pattern"
  - value: string | number | RegExp
  - errorMessage: string

## Relationships
- SplitScreenAuth contains one LeftPanelContent and one RightPanelContent
- RightPanelContent contains multiple FormField elements
- FormField has associated FormFieldStyling
- LeftPanelContent contains multiple GeometricShape elements
- FormField has multiple ValidationRule elements

## Constraints
- Left panel must be hidden on screens smaller than lg breakpoint (1024px)
- Form fields must maintain existing validation and authentication logic
- Styling must follow Tailwind CSS guidelines per project constitution
- Color scheme must match the requested navy blue and white design

## State Transitions
- Panel visibility transitions based on screen size (responsive design)
- Form states (idle, validating, submitting, success, error) remain unchanged from existing implementation
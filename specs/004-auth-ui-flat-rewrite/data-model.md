# Data Model: Authentication UI Flat Rewrite

## Overview
This data model describes the entities and relationships for the flattened authentication UI. Since this is primarily a UI/UX feature with no changes to the underlying data structures, the model focuses on the UI components and their properties.

## UI Components

### SplitScreenAuth Component
- **Purpose**: Container for the two-column split-screen layout with flattened structure
- **Properties**:
  - layoutType: "split-screen" (fixed value)
  - leftPanelVisibility: boolean (controls responsive behavior)
  - mode: "login" | "register" (determines form content)
  - rightPanelConfig: RightPanelConfig object

### RightPanelConfig
- **Purpose**: Configuration for the right panel content
- **Properties**:
  - title: string ("Login" or "Sign up")
  - buttonText: string ("Login" or "Sign up")
  - footerText: string ("Don't have an account? Create an account" or "Already have an account?")
  - footerLink: string ("/register" or "/login")
  - footerLinkText: string ("Sign up" or "Login")

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
  - borderWidth: string ("border")
  - borderColor: string ("border-slate-200")
  - borderRadius: string ("rounded-xl")
  - paddingX: string ("px-4")
  - paddingY: string ("py-4")
  - marginBottom: string ("mb-6")
  - focusRingColor: string ("focus:ring-[#0a0a3c]")

### ValidationRule
- **Purpose**: Defines validation requirements for form fields
- **Properties**:
  - ruleType: "required" | "email" | "minLength" | "maxLength" | "pattern"
  - value: string | number | RegExp
  - errorMessage: string

## Relationships
- SplitScreenAuth contains rightPanelConfig
- RightPanelConfig contains form elements
- Form fields have associated FormFieldStyling
- FormField has multiple ValidationRule elements

## Constraints
- Left panel must be hidden on screens smaller than lg breakpoint (1024px)
- Form fields must maintain existing validation and authentication logic
- Styling must follow Tailwind CSS guidelines per project constitution
- Color scheme must match the requested #0a0a3c and white design
- Button styling must use the specified classes: bg-[#0a0a3c] hover:bg-slate-800 text-white py-5 rounded-xl text-xl font-bold mt-4 transition-all shadow-xl

## State Transitions
- Panel visibility transitions based on screen size (responsive design)
- Form states (idle, validating, submitting, success, error) remain unchanged from existing implementation
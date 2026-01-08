# Data Model: Authentication UI Replacement

## Entities

### Authentication Form Data
- **Email Field**
  - Type: string
  - Validation: email format, required
  - Max length: 254 characters (standard email limit)
  - Constraints: Must be unique for registration

- **Password Field**
  - Type: string
  - Validation: minimum 8 characters, required
  - Constraints: Should meet security requirements (not stored in UI layer)

### UI State
- **Form State**
  - Type: object
  - Properties:
    - email: string (user input)
    - password: string (user input)
    - errors: array of error messages
    - isSubmitting: boolean
    - successMessage: string (optional)

### User Session (Existing)
- **User Session Data** (from existing backend)
  - Type: object
  - Properties:
    - userId: string (unique identifier)
    - email: string (user's email)
    - expiresAt: datetime (session expiration)
    - token: string (JWT token)

## UI Components

### Auth Card Component
- **Props**:
  - title: string (Sign in / Sign up)
  - formType: enum (login | register)
  - onSubmit: function (handles form submission)
  - footerText: string (Don't have an account? Sign up / Already have an account? Login)
  - footerLink: string (URL to switch between auth pages)

### Input Field Component
- **Props**:
  - label: string (Email / Password)
  - type: string (email / password)
  - name: string (email / password)
  - value: string (current input value)
  - onChange: function (handles input changes)
  - error: string (optional error message)

## State Transitions

### Form State Transitions
1. **Initial** → **Validating** (when user submits form)
2. **Validating** → **Submitting** (when validation passes)
3. **Submitting** → **Success** (when auth API returns success)
4. **Submitting** → **Error** (when auth API returns error)
5. **Error** → **Validating** (when user corrects input)

### Authentication Flow States
1. **Unauthenticated** → **Authenticating** (when user starts auth process)
2. **Authenticating** → **Authenticated** (when credentials are valid)
3. **Authenticated** → **Unauthenticated** (when user logs out)
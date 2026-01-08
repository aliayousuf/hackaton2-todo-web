# Data Model: Authentication System

## Overview
Data model for the authentication system including user entity and related authentication data structures.

## User Entity

### Core Properties
- **id** (string): Unique identifier for the user (UUID format)
- **email** (string): User's email address (unique, validated)
- **password_hash** (string): BCrypt hashed password (stored securely)
- **created_at** (string): ISO 8601 timestamp of account creation
- **updated_at** (string): ISO 8601 timestamp of last account update

### Validation Rules
- Email must be in valid email format
- Email must be unique across all users
- Password must meet strength requirements (min 8 characters)
- ID is immutable once assigned
- Created timestamp is set on creation and never updated
- Updated timestamp is updated on any modification

## Authentication Request Models

### User Registration (UserCreate)
- **email** (string): User's email address (required, validated)
- **password** (string): User's password (required, min 8 characters)

#### Validation
- Email format validation using standard email regex
- Password strength validation (min 8 chars)
- Check for existing email before creation
- Sanitize input to prevent injection attacks

### User Login (UserLogin)
- **email** (string): User's email address (required, validated)
- **password** (string): User's password (required)

#### Validation
- Email format validation
- Verify password matches stored hash
- Account status verification (active/inactive)
- Rate limiting considerations

## Authentication Response Models

### Registration Response (UserRegisterResponse)
- **success** (boolean): Indicates if registration was successful
- **message** (string): Descriptive message about the registration
- **user** (object): User object with id, email, created_at, updated_at
  - id (string)
  - email (string)
  - created_at (string)
  - updated_at (string)

### Login Response (UserLoginResponse)
- **success** (boolean): Indicates if login was successful
- **access_token** (string): JWT access token for authentication
- **token_type** (string): Type of token (typically "bearer")
- **user** (object): User object with id, email, created_at, updated_at
  - id (string)
  - email (string)
  - created_at (string)
  - updated_at (string)

## Token Model

### JWT Access Token
- **payload** (object): Contains user identity information
  - sub (string): Subject (user ID)
  - email (string): User's email
  - exp (number): Expiration timestamp
  - iat (number): Issued at timestamp
- **expiration**: 7 days from issue time
- **algorithm**: HS256 (symmetric encryption)
- **security**: HttpOnly cookie storage to prevent XSS attacks

## Session Management
- Sessions are stateless using JWT tokens
- Tokens contain user identity information
- Server validates token signature and expiration
- Refresh tokens not currently implemented (future enhancement)

## Relationships
- User entity serves as the foundation for all authenticated operations
- Tasks and other user-specific data reference User.id as foreign key
- User isolation enforced on all queries through authentication middleware

## Constraints
- Email uniqueness enforced at database level
- Passwords never stored in plain text
- All authentication attempts logged for security monitoring
- Account lockout mechanisms (future enhancement)
- GDPR compliance for user data handling
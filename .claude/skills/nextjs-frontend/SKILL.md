---
name: nextjs-frontend
description: Comprehensive Next.js 16+ frontend development with support for App Router, Server Components, Client Components, API routes, data fetching, and best practices. Use when building modern Next.js applications with React Server Components, handling routing, implementing data fetching strategies, creating API routes, or setting up Next.js project structure.
---

# Next.js 16+ Frontend Development

## Overview

This skill provides comprehensive guidance for building modern Next.js 16+ applications using the App Router architecture. It covers project setup, routing patterns, component architecture (Server vs Client Components), data fetching strategies, API routes, and best practices for creating performant, scalable web applications.

## When to Use This Skill

Use this skill when:
1. Setting up a new Next.js 16+ project with recommended defaults
2. Creating or modifying routes using the App Router
3. Implementing Server Components and Client Components
4. Setting up data fetching with new Next.js 16+ patterns
5. Creating API routes in both App Router and Pages Router
6. Optimizing performance with Next.js 16+ features
7. Handling form submissions with new Form component
8. Implementing caching strategies with cacheLife() and cacheTag()

## Core Capabilities

### 1. Project Setup and Initialization

To create a new Next.js 16+ project with recommended defaults:

```bash
npx create-next-app@latest my-app --yes
cd my-app
npm run dev
```

This creates a project with TypeScript, Tailwind CSS, ESLint, App Router, and other recommended features enabled.

### 2. App Router Structure

The App Router uses the `app` directory for routing and rendering:

```
app/
├── layout.tsx          # Root layout for all pages
├── page.tsx            # Home page route (default)
├── about/
│   └── page.tsx        # About page route
├── products/
│   ├── page.tsx        # Products listing page
│   └── [id]/
│       └── page.tsx    # Dynamic product page
└── api/
    └── route.ts        # API routes
```

Basic page and layout structure:

```typescript
// app/page.tsx
export default function Page() {
  return <h1>Hello, Next.js!</h1>;
}

// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

### 3. Server and Client Components

**Server Components (default)** - Run on the server, can fetch data, smaller bundle size:

```typescript
// app/users/page.tsx
import { getUsers } from '@/lib/data'

export default async function UsersPage() {
  const users = await getUsers()

  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  )
}
```

**Client Components** - Run in the browser, handle interactivity with `"use client"` directive:

```typescript
// app/components/user-card.tsx
'use client'

import { useState } from 'react'

export default function UserCard({ user }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div onClick={() => setIsExpanded(!isExpanded)}>
      <h3>{user.name}</h3>
      {isExpanded && <p>{user.bio}</p>}
    </div>
  )
}
```

### 4. Data Fetching Strategies

**Static Data Fetching** (similar to getStaticProps):
```typescript
export default async function Page() {
  // This request should be cached until manually invalidated
  const staticData = await fetch(`https://api.example.com/data`, {
    cache: 'force-cache'
  })
  // ... render data
}
```

**Dynamic Data Fetching** (similar to getServerSideProps):
```typescript
export default async function Page() {
  // This request should be refetched on every request
  const dynamicData = await fetch(`https://api.example.com/data`, {
    cache: 'no-store'
  })
  // ... render data
}
```

**Revalidated Data Fetching** (with revalidation time):
```typescript
export default async function Page() {
  // This request should be cached with a lifetime of 10 seconds
  const revalidatedData = await fetch(`https://api.example.com/data`, {
    next: { revalidate: 10 },
  })
  // ... render data
}
```

### 5. API Routes

**App Router API Routes** (`app/api/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Handle GET request
  return NextResponse.json({ message: 'Hello from API route' });
}

export async function POST(request: NextRequest) {
  // Handle POST request
  const body = await request.json();
  return NextResponse.json({ success: true, data: body });
}
```

**Dynamic API Routes** (`app/api/posts/[id]/route.ts`):
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const post = await getPost(params.id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}
```

### 6. Form Handling with Next.js 16+ Form Component

Next.js 16+ includes stable support for the Form component for progressive enhancement:

```typescript
'use client'

import { useFormState } from 'react-dom'
import { submitContactForm } from '@/actions/contact'

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactForm, {
    message: '',
    errors: {}
  })

  return (
    <form action={formAction}>
      <input type="text" name="name" required />
      <input type="email" name="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {state.message && <p>{state.message}</p>}
    </form>
  )
}
```

### 7. Caching Strategies

Next.js 16+ provides enhanced caching with cacheLife() and cacheTag() APIs:

```typescript
// Using cacheLife for declarative cache control
export default async function ProductPage({ id }) {
  // Cache for 1 hour
  const product = await fetch(`https://api.example.com/products/${id}`, {
    next: { cacheLife: '1h' }
  });

  return <div>{product.name}</div>;
}

// Using cacheTag for granular cache invalidation
export async function updateProduct(id, data) {
  // Update product in database
  await db.updateProduct(id, data);

  // Invalidate cache with tag
  await revalidateTag(`product-${id}`);
}
```

## Best Practices

1. **Component Composition**: Keep "use client" boundaries as deep as possible to minimize client bundle size
2. **Data Fetching**: Prefer Server Components for data fetching when possible
3. **File Structure**: Organize components in `app/components/` and utilities in `lib/`
4. **Type Safety**: Use TypeScript interfaces for data structures
5. **Performance**: Use streaming and suspense boundaries for better loading states
6. **SEO**: Leverage the enhanced metadata API for comprehensive SEO control

## Resources

This skill includes example resource directories that demonstrate how to organize different types of bundled resources:

### scripts/
Executable code (Python/Bash/etc.) that can be run directly to perform specific operations.

**Appropriate for:** Project setup scripts, build automation, or any executable code that performs automation, data processing, or specific operations.

### references/
Documentation and reference material intended to be loaded into context to inform Claude's process and thinking.

**Appropriate for:** In-depth Next.js documentation, API references, component patterns, or any detailed information that Claude should reference while working.

### assets/
Files not intended to be loaded into context, but rather used within the output Claude produces.

**Appropriate for:** Next.js project templates, boilerplate code, component templates, or any files meant to be copied or used in the final output.

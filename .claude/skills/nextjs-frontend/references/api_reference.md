# Next.js 16+ API Reference

## App Router API

### Data Fetching Methods
- `fetch()` with `cache: 'force-cache'` - Static data fetching (equivalent to getStaticProps)
- `fetch()` with `cache: 'no-store'` - Dynamic data fetching (equivalent to getServerSideProps)
- `fetch()` with `next: { revalidate: N }` - Revalidated data fetching with time-based revalidation

### Component Directives
- `"use client"` - Marks a component as a Client Component to run in the browser
- `"use server"` - Marks a function as a Server Action

### API Route Methods
- `GET` - Retrieve data/resources
- `POST` - Create new data/resources
- `PUT` - Update existing data/resources
- `DELETE` - Remove data/resources
- `PATCH` - Partial updates to data/resources

## File Conventions

### Routing
- `page.tsx` - Defines a route that renders UI
- `layout.tsx` - Defines UI shared across routes
- `loading.tsx` - Loading UI for a route segment
- `error.tsx` - Error UI for a route segment
- `not-found.tsx` - Not found UI for a route segment
- `route.ts` - API endpoints in the App Router

### Dynamic Routes
- `[param]` - Dynamic segment (e.g., `app/posts/[slug]/page.tsx`)
- `[...param]` - Catch-all segment
- `[[...param]]` - Optional catch-all segment

## Caching APIs (Next.js 16+)

### cacheLife()
- `'seconds'` - Cache for seconds
- `'minutes'` - Cache for minutes
- `'hours'` - Cache for hours
- `'days'` - Cache for days
- `'weeks'` - Cache for weeks
- `'max'` - Cache indefinitely

### cacheTag()
- Used for granular cache invalidation
- Works with `revalidateTag()` and `revalidatePath()`

## Server Actions and Mutations

Server actions are asynchronous functions that are defined on the server and can be called from client components:

```typescript
'use server'

import { revalidateTag } from 'next/cache'

export async function updateProduct(formData: FormData) {
  const id = formData.get('id')
  const name = formData.get('name')

  await db.updateProduct(id, { name })

  // Revalidate the cache
  revalidateTag(`product-${id}`)

  return { success: true }
}
```

## Metadata API

Next.js 16+ provides enhanced metadata API for SEO control:

```typescript
export const metadata = {
  title: 'My Page',
  description: 'Description of my page',
  openGraph: {
    title: 'My Page',
    description: 'Description of my page',
    images: ['/image.png'],
  },
}
```

## Image Component

Next.js Image component with optimization:

```typescript
import Image from 'next/image'

export default function MyImage() {
  return (
    <Image
      src="/me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  )
}
```

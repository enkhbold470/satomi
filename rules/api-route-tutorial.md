Next.js 16 in October 2025 has evolved Server-Side Rendering (SSR) mainly through the new App Router with async Server Components, while API Routes remain available primarily from the Pages Router for building custom backend endpoints.

### When and How to Use SSR in Next.js 16 with App Router and TypeScript
- SSR happens by default in async Server Components inside the `app` directory. You fetch data with `fetch()` or direct server-side calls in your page or layout components, and the server streams fully rendered HTML progressively to the client.
- You define pages as async functions inside `app/[route]/page.tsx` and use TypeScript for type safety.
- You don't need `getServerSideProps`; instead, SSR is implicit in server components and controlled via caching options in `fetch()`.
- Example simple SSR async page with TypeScript:
  ```tsx
  // app/products/page.tsx
  export default async function ProductsPage() {
    const res = await fetch('https://api.example.com/products', { cache: 'no-store' });
    const products = await res.json();
    return (
      <div>
        <h1>Products</h1>
        <ul>
          {products.map(p => <li key={p.id}>{p.name}</li>)}
        </ul>
      </div>
    );
  }
  ```

### When to Use API Routes vs. App Router Server Functions
- **API Routes** (`pages/api/*`) are still useful when:
  - You need a backend API endpoint accessible from external clients (mobile apps, third parties).
  - You want real-time features like WebSockets or Server-Sent Events.
  - You need independent REST or GraphQL endpoints or want to use middleware like authentication.
- API Routes are written as handler functions responding to HTTP methods, e.g.:
  ```ts
  // pages/api/hello.ts
  import type { NextApiRequest, NextApiResponse } from 'next';
  export default function handler(req: NextApiRequest, res: NextApiResponse) {
    res.status(200).json({ message: 'Hello from API route' });
  }
  ```
- **App Router Server Functions / Actions** are used for server mutations called from React components, supporting actions like form submissions or CRUD operations internally in the Next.js app without HTTP overhead.
- Mixing philosophy:
  - Use App Router and server functions for SSR pages, server components, and internal mutations.
  - Use API Routes for external API needs or real-time functionality.

### TypeScript Support in Next.js 16
- Built-in TypeScript setup with proper `tsconfig.json` configuration.
- You write `page.tsx`, `layout.tsx`, and `api/*.ts` files with typed props.
- Route definitions in the App Router support dynamic and static typing.
- Examples available in official docs and tooling for type-safe routing, props, and API handlers.

This approach in Next.js 16 provides improved SSR with React 18’s streaming, better caching, and seamless TypeScript usage. API Routes remain important for external APIs and WebSocket features while the App Router streamlines SSR and server-side logic inside the app.[1][2][3][4][5][6]


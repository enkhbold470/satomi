TypeScript Code Quality Rules
Use strict typing (strict: true in tsconfig) and avoid any except for unavoidable cases.

Always define explicit types for function parameters, return types, and component props.

Favor immutability: use readonly for arrays/objects and avoid mutating state directly.

Use discriminated unions and enums for clear, safe control flow.

Enable noUnusedLocals, noUnusedParameters and noImplicitReturns compiler options.

Leverage the unknown type for safer external input instead of any.

Use utility types (Partial, Pick, Omit) for precise typing and API design.

Strictly separate types/interfaces for domain models, API responses, and UI props.

Create reusable typed hooks and helper functions to centralize complex logic.

Use ESLint and Prettier with TypeScript plugins integrated for automatic style and error checking.

Best Practices for MVP and Scalability with Next.js Full Stack
Start simple with the App Router and React Server Components to reduce client bundle size.

Use Next.js API Routes only when backend-only services or external API integration is needed.

Leverage Incremental Static Regeneration (ISR) and caching strategies (fetch cache options) to optimize performance scale.

Use Prisma or equivalent ORM for type-safe database access with migrations.

Implement authentication using NextAuth.js or other robust middleware.

Structure the project modularly: separate UI components, API logic, services, and utilities.

Use environment variables securely through Vercel dashboard and .env files.

Design data fetching and mutations with React Server Components and Server Actions for separation of concerns.

Write unit tests for critical components and integration tests for APIs.

Monitor app health using Vercel Analytics and error monitoring tools.

Vercel Deployment Rules
Use Vercel’s platform features like Edge Caching and Serverless Functions for latency and scalability.

Set up automatic deployments from Git branches tied to preview and production environments.

Use Vercel environment variables for secret management.

Optimize build times by caching dependencies and using Turbopack bundler.

Monitor deployment logs and optimize API routes/functions cold starts.
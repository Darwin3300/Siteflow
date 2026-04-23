# SiteFlow

A production-ready SaaS application for construction site logging and workflow management.

## Features

- Secure user authentication with NextAuth
- Site log submission with automatic categorization
- Dashboard for viewing and managing logs
- Multi-user system with role-based access
- Clean, responsive UI built with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- NextAuth
- Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your environment variables (see .env.example)
4. Set up the database: `npx prisma db push`
5. Run the development server: `npm run dev`

## Environment Variables

Create a `.env.local` file with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/siteflow"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## Deployment

This application is designed to be deployed on Vercel. Make sure to set the environment variables in your Vercel project settings.
# JAGRUTA

JAGRUTA is an AI-powered civic awareness and politician accountability platform.  
It helps citizens find their political representatives, compare politicians, track manifesto promises, view election results, and understand which authority is responsible for local civic issues.

## Project Overview

Citizens often find it difficult to know who represents their area, how their representatives are performing, and whom to contact for civic problems such as roads, water, garbage, drainage, or streetlights.

JAGRUTA solves this by allowing users to enter their pincode and access constituency-based political and civic information in one place.

## Key Features

- Pincode-based representative search
- Interactive Bengaluru map with constituency markers
- Politician profile pages
- AI-generated politician performance summary
- Compare two politicians side by side
- AI-based voting guide
- Problem mapper for civic issues
- Election results with vote share and CSV export
- Manifesto promise tracker
- Constituency report card

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- tRPC React Query
- Zustand
- Framer Motion
- Mapbox
- Recharts

### Backend

- Node.js
- Express.js
- TypeScript
- tRPC
- Prisma ORM

### Database

- PostgreSQL
- Supabase

### AI

- Gemini API

## Project Structure

```txt
JAGRUTA
├── Jagruta-Backend
│   ├── prisma
│   ├── src
│   │   ├── db
│   │   ├── routers
│   │   ├── services
│   │   ├── index.ts
│   │   └── seed.ts
│   └── package.json
│
├── Jagruta-frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── lib
│   │   ├── store
│   │   └── types
│   └── package.json
│
└── README.md

#AI-Powered Product Review Summarization System: 

Overview:
This project is a monorepo application that demonstrates AI-powered review summarization. It fetches product reviews from a PostgreSQL database and uses the Hugging Face Inference API (with Meta's Llama 3.1 model) to generate intelligent summaries highlighting both positive and negative themes.
The application consists of:

Client: A React-based frontend with Tailwind CSS and shadcn/ui components
Server: An Express.js backend with Prisma ORM for database operations
LLM Integration: Hugging Face Inference Client for AI-powered summarization


Features
Core Functionality

✅ Review Display: Fetches and displays product reviews with ratings
✅ AI Summarization: Generates concise summaries of multiple reviews using Llama 3.1
✅ Smart Caching: Stores summaries for 7 days to reduce API calls
✅ Star Ratings: Visual star rating component (0-5 stars)
✅ Loading States: Skeleton loaders for better UX
✅ Error Handling: Graceful error messages for API failures

Technical Features

🔄 Real-time Updates: React Query for efficient data fetching and caching
🎨 Modern UI: Tailwind CSS with shadcn/ui component library
🗄️ Database ORM: Prisma with PostgreSQL via Neon serverless adapter
🔒 Type Safety: Full TypeScript implementation across frontend and backend
🚀 Hot Reload: Development environment with Bun runtime
📦 Monorepo: Workspace-based architecture for code organization


Architecture
High-Level Architecture
┌─────────────────┐      HTTP/REST      ┌─────────────────┐
│   React Client  │ ◄─────────────────► │  Express Server │
│   (Port 5173)   │                     │   (Port 3000)   │
└─────────────────┘                     └────────┬────────┘
                                                 │
                                    ┌────────────┴────────────┐
                                    │                         │
                              ┌─────▼──────┐         ┌───────▼────────┐
                              │  Prisma ORM │         │ Hugging Face   │
                              │            │         │ Inference API  │
                              └─────┬──────┘         │ (Llama 3.1)    │
                                    │                └────────────────┘
                              ┌─────▼──────┐
                              │ PostgreSQL │
                              │  (Neon)    │
                              └────────────┘
Component Breakdown
Frontend (React)

ReviewList: Main component orchestrating review display and summarization
StarRating: Visual rating display component
SkeletonReview: Loading placeholder component
React Query: Manages API state, caching, and mutations
Axios: HTTP client for API communication

Backend (Express)

Controllers: Handle HTTP requests and responses
Services: Business logic layer (review summarization)
Repositories: Data access layer (Prisma queries)
LLM Client: Hugging Face API integration


How It Works
Workflow Pipeline

Review Fetching

   User → ReviewList Component → API Request → Controller → Repository → Prisma → Database

Summarization Process

   User Clicks "Summarize" → Mutation Triggered → Check Cache → 
   If Cached: Return Existing Summary
   If Not: Fetch Reviews → Join Content → Call LLM API → Store Summary → Return to Client

Caching Mechanism

Summaries are stored in the summaries table with a 7-day expiration
On subsequent requests, the system checks if a valid (non-expired) summary exists
If valid, returns cached summary; otherwise generates new one



Key Algorithms
Review Summarization (Server-side)
typescript1. Check if a valid summary exists in database (within 7-day window)
2. If exists, return cached summary
3. If not:
   a. Fetch up to 10 most recent reviews
   b. Join review content with line breaks
   c. Send to LLM with system prompt: "Summarize highlighting key themes"
   d. Store returned summary with 7-day expiration
   e. Return summary to client
```

#### Database Schema Design
- **Products**: Base entity for items
- **Reviews**: One-to-many relationship with products
- **Summaries**: One-to-one relationship with products (upsert pattern)

---

## Technologies Used

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling
- **shadcn/ui** - Component library
- **TanStack Query (React Query)** - Data fetching/caching
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Lucide React** - Icon library
- **React Markdown** - Markdown rendering
- **React Loading Skeleton** - Loading states

### Backend
- **Node.js/Bun** - Runtime environment
- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Primary database
- **@neondatabase/serverless** - Serverless Postgres adapter
- **@huggingface/inference** - AI model integration
- **Zod** - Schema validation
- **DayJS** - Date manipulation

### DevOps & Tooling
- **Bun** - Package manager and runtime
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **lint-staged** - Pre-commit linting
- **Concurrently** - Parallel script execution
- **Dotenv** - Environment variable management

---

## Project Structure
```
.
├── packages/
│   ├── client/                    # React frontend application
│   │   ├── public/               # Static assets
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── reviews/      # Review-related components
│   │   │   │   │   ├── reviewList.tsx        # Main review display & logic
│   │   │   │   │   ├── reviewsApi.ts         # API client functions
│   │   │   │   │   ├── starRating.tsx        # Star rating display
│   │   │   │   │   └── SkeletonReview.tsx    # Loading placeholder
│   │   │   │   └── ui/           # shadcn/ui components
│   │   │   ├── lib/              # Utility functions
│   │   │   ├── App.tsx           # Root component
│   │   │   ├── main.tsx          # Application entry point
│   │   │   └── index.css         # Global styles
│   │   ├── vite.config.ts        # Vite configuration
│   │   ├── package.json          # Frontend dependencies
│   │   └── tsconfig.json         # TypeScript config
│   │
│   └── server/                    # Express backend application
│       ├── controllers/
│       │   └── review.controller.ts    # HTTP request handlers
│       ├── services/
│       │   └── review.service.ts       # Business logic layer
│       ├── repositories/
│       │   ├── review.repository.ts    # Review data access
│       │   └── product.repository.ts   # Product data access
│       ├── llm/
│       │   ├── client.ts               # Hugging Face client
│       │   └── prompts/
│       │       └── summarizingReviews.txt   # LLM system prompt
│       ├── prisma/
│       │   ├── schema.prisma           # Database schema
│       │   └── migrations/             # Database migrations
│       ├── generated/                  # Prisma client output
│       ├── route.ts                    # API route definitions
│       ├── index.ts                    # Server entry point
│       └── package.json                # Backend dependencies
│
├── index.ts                       # Root dev script (runs both servers)
├── package.json                   # Root package.json (workspace config)
├── tsconfig.json                  # Root TypeScript config
├── .prettierrc                    # Prettier configuration
├── .lintstagedrc                  # Lint-staged config
└── .husky/                        # Git hooks
    └── pre-commit                 # Pre-commit hook (runs prettier)

Installation & Setup
Prerequisites

Bun (v1.3.1 or higher) - Install Bun
PostgreSQL database (or Neon account)
Hugging Face API key - Get API key

Step 1: Clone Repository
bashgit clone <repository-url>
cd <project-folder>
Step 2: Install Dependencies
bash# Install root and workspace dependencies
bun install
Step 3: Environment Configuration
Create .env file in packages/server/:
envDATABASE_URL="postgresql://user:password@host:port/database"
HUGGINGFACE_API_KEY="your_huggingface_api_key"
PORT=3000
Step 4: Database Setup
bashcd packages/server

# Generate Prisma Client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# (Optional) Seed database with sample data
bunx prisma db seed
Step 5: Run Development Servers
bash# From root directory - runs both client and server
bun run dev
This command runs:

Client on http://localhost:5173
Server on http://localhost:3000


Usage
Accessing the Application

Navigate to http://localhost:5173 in your browser
The app displays reviews for a hardcoded product (ID: 2)
Click the "✨ Summarize" button to generate an AI summary
Summaries are cached for 7 days

Manual API Testing
bash# Get reviews for product ID 2
curl http://localhost:3000/api/products/2/reviews

# Generate summary for product ID 2
curl -X POST http://localhost:3000/api/products/2/reviews/summarize

API Endpoints
GET /api/products/:id/reviews
Fetches all reviews and existing summary for a product.
Response:
json{
  "summary": "string | null",
  "reviews": [
    {
      "id": 1,
      "author": "John Doe",
      "rating": 5,
      "content": "Great product!",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
POST /api/products/:id/reviews/summarize
Generates AI-powered summary of product reviews.
Response:
json"Customers praise the product's durability and ease of use. Some noted slow shipping times."



Acknowledgements

Hugging Face - For providing the Inference API and Llama 3.1 model
Vercel - For Tailwind CSS and shadcn/ui components
Prisma - For the excellent ORM and database toolkit
Neon - For serverless PostgreSQL infrastructure
Bun - For the fast JavaScript runtime


Built with ❤️ using React, Express, Prisma, and AI

This repository previously specified `builds` in `vercel.json`. That configuration forces Vercel to use the repo config (and ignores the Build & Development Settings in the Project Settings UI).

I removed the `builds` array so you can control build settings from the Vercel Dashboard instead. Below are recommended Project Settings for a monorepo with a static client (`packages/client`) and serverless API (`packages/server`).

Option A — Two Vercel projects (recommended for clarity)

-  Create one Vercel project for the client:

   -  **Root Directory**: `packages/client`
   -  **Framework Preset**: `Vite` or `Other`
   -  **Install Command**: (leave default) or `bun install` / `npm ci` depending on your chosen package manager
   -  **Build Command**: `npm run build` (or `bun run build`)
   -  **Output Directory**: `dist`
   -  **Environment Variables**: add any required envs (e.g., API_BASE_URL). Use `Preview` or `Production` as applicable.

-  Create a second Vercel project for serverless functions (API):
   -  **Root Directory**: `packages/server`
   -  **Framework Preset**: `Other`
   -  **Install Command**: (default) or `bun install` / `npm ci`
   -  **Build Command**: leave blank if no build step is needed; or use your build command if you compile TypeScript to JS before deploy
   -  **Environment Variables**: add your DB / API keys
   -  **Node Version**: set to `22.x` in Project Settings (or via `engines.node` in `package.json`)

Option B — Single Vercel project (use Project Settings to target the client)

-  In the Vercel Project Settings:

   -  **Root Directory**: `packages/client`
   -  **Build Command**: `npm run build`
   -  **Output Directory**: `dist`
   -  **Environment Variables**: add any needed for preview/production

-  For the API you may either:
   -  Deploy the API as a separate project (preferred), or
   -  Keep your `routes` in `vercel.json` (already present) and ensure the server code is reachable by the dashboard build — this is more fragile in a monorepo without explicit `builds`.

Important notes

-  Make sure **Node** is set to `22.x` (Project Settings > General > Node.js Version) or keep `"engines": { "node": "22.x" }` in package.json (already added).
-  Use `vercel pull` locally to sync project settings and environment variables into `.vercel/`.
-  If you use Husky, keep the guarded `prepare` script (it skips install in CI when `.git` is absent). You can also set `HUSKY=0` in Vercel Environment Variables to disable it during builds.

Summary recommendation

-  For predictable behavior and easiest dashboard control: create two Vercel projects — one for the client (`packages/client`) and one for the server (`packages/server`). This gives each project clear Root Directory and Build settings in the UI.

If you want, I can:

-  Create an example `vercel.json` for a two-project setup, or
-  Re-add `builds` with improved configuration (if you prefer repository-controlled builds instead of dashboard settings).

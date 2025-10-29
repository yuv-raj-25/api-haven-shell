# API Haven Shell

API Haven Shell is a lightweight API exploration workspace built with Vite, React, Tailwind CSS, and shadcn/ui components. It provides a split-view layout with a request builder, response preview panel, and collection sidebar so you can prototype and document HTTP workflows quickly.

## Features

- Request workspace with method selection, URL entry, headers/body/auth tabs, and animated transitions
- Response panel with tabbed output, copy-to-clipboard controls, and full-screen viewing for large payloads
- Persistent collections with create/rename/delete workflows and request-level CRUD backed by a REST API
- Settings area that surfaces saved requests alongside profile/preferences placeholders for future expansion
- Dark/light theme support through `next-themes`

## Prerequisites

- Node.js 18+ (recommended to install via [nvm](https://github.com/nvm-sh/nvm))
- npm 9+, pnpm 8+, or Bun 1.1+ (a `bun.lockb` file is included)

## Getting Started

```sh
# Clone the repository
git clone https://github.com/yuv-raj-25/api-haven-shell.git
cd api-haven-shell

# Install dependencies (choose one)
npm install
# or
pnpm install
# or
bun install

# Start the development server (defaults to http://localhost:5173)
npm run dev
# pnpm dev
# bun run dev
```

## Configuration

Create a `.env.local` (or `.env`) file in the project root and point the frontend at your API host:

```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

The same endpoint should expose collection and request routes such as:

- `GET /collections`
- `POST /collections`
- `POST /collections/:collectionId/requests`
- `PATCH /collections/:collectionId/requests/:requestId`
- `DELETE /collections/:collectionId/requests/:requestId`

Feel free to adjust the path structure—just mirror the changes inside `src/api/collections.ts`.

## Usage

1. Launch the dev server and open the app in your browser.
2. Use the sidebar to create, rename, or delete collections and individual requests.
3. Compose requests within the workspace tabs (Params, Headers, Body, Auth), then hit **Save** to persist changes through the backing API.
4. Inspect responses in the response panel; use **Full view** for an expanded payload viewer and **Copy** to capture JSON quickly.
5. Browse the **Settings** page to review saved requests and wire up profile/preferences data as your backend evolves.

> The app expects a REST API (Express, Fastify, Nest, etc.) backed by MongoDB. When the API is unreachable it falls back to sample data so the UI still demos correctly.

## Project Scripts

- `dev` – Runs Vite in development mode with HMR.
- `build` – Produces an optimized production build.
- `preview` – Serves the production build locally for smoke testing.

Scripts are available via npm, pnpm, or Bun according to your chosen package manager.

## Project Structure

```
src/
	components/     # Reusable UI building blocks (navbar, sidebar, response panel, request workspace)
	context/        # React context for collections + persistence hooks
	api/            # Lightweight REST client utilities
	hooks/          # Custom React hooks
	lib/            # Utility helpers
	pages/          # Route-level components
	main.tsx        # Application entry point
```

Feel free to adapt this shell for your own API client by wiring in authentication, persistence, or external API integrations.

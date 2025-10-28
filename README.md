# API Haven Shell

API Haven Shell is a lightweight API exploration workspace built with Vite, React, Tailwind CSS, and shadcn/ui components. It provides a split-view layout with a request builder, response preview panel, and collection sidebar so you can prototype and document HTTP workflows quickly.

## Features

- Request workspace with method selection, URL entry, headers/body/auth tabs, and animated transitions
- Response panel with tabbed output, copy-to-clipboard controls, and full-screen viewing for large payloads
- Sidebar collections mock to showcase request organization patterns
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

## Usage

1. Launch the dev server and open the app in your browser.
2. Use the sidebar to browse the example collections.
3. Compose requests within the workspace tabs (Params, Headers, Body, Auth).
4. Inspect responses in the response panel; use **Full view** for an expanded payload viewer and **Copy** to capture JSON quickly.

> The current implementation uses mock data for request/response flows. Replace the request handlers with real networking logic (e.g., `fetch`, Axios) to connect to live APIs.

## Project Scripts

- `dev` – Runs Vite in development mode with HMR.
- `build` – Produces an optimized production build.
- `preview` – Serves the production build locally for smoke testing.

Scripts are available via npm, pnpm, or Bun according to your chosen package manager.

## Project Structure

```
src/
	components/     # Reusable UI building blocks (navbar, sidebar, response panel, request workspace)
	hooks/          # Custom React hooks
	lib/            # Utility helpers
	pages/          # Route-level components
	main.tsx        # Application entry point
```

Feel free to adapt this shell for your own API client by wiring in authentication, persistence, or external API integrations.

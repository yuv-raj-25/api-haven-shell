# API Haven — Documentation

Welcome to API Haven — a lightweight desktop/web app for creating and testing HTTP APIs, organizing requests into collections, and persisting them (locally or to a backend).

This file documents the project, how to use the app, and the backend API endpoints used by the frontend.

---

## Project overview

API Haven is a React + TypeScript application built with Vite, Tailwind CSS and React Query. It provides:

- Collections: group related requests (GET/POST/PUT/DELETE/etc).
- Requests: store method, URL, headers, query params and body for each request.
- Execution: send requests from the UI using the browser `fetch` API and view formatted responses.
- Persistence: saves requests locally (localStorage) and can persist to a backend (REST/Mongo) when available.
- Desktop builds: packaged installers for macOS (release artifacts included under `release/build`).

## Running the project locally

1. Install dependencies:

```bash
# using npm
npm install

# or using yarn
# yarn install
```

2. Start the dev server:

```bash
npm run dev
```

Open http://localhost:5173 (or the port shown by Vite).

## Quick UI guide

- Navbar: brand takes you to Home. Use the Workspace button to open the request editor. The Docs link opens this documentation.
- Sidebar: create collections (folders) and add requests inside them. Use the `+` to create new request files, and the three-dot menu to rename or delete.
- Request editor (Workspace): choose method, URL, add headers/query params/body, then click `Send` to execute. Click `Save` to persist the request.
- Response panel: shows status, headers and a pretty-printed body when JSON.
- Settings: saved requests are listed; you can delete saved items or open them in the workspace.

## Backend API (REST endpoints)

The frontend expects a REST API with the following endpoints (these are the API shapes used by the client in `src/api/collections.ts`). Your backend may vary, but this is the expected contract:

- GET /collections

  - Response: 200 OK
  - Body: Array of collection objects

- POST /collections

  - Request JSON: { name: string }
  - Response: 201 Created
  - Body: newly created collection object

- DELETE /collections/:collectionId

  - Response: 204 No Content or 200 OK

- POST /collections/:collectionId/requests

  - Request JSON: { name: string, method: string, url: string, headers?: Record<string,string>, params?: Record<string,string>, body?: string }
  - Response: 201 Created
  - Body: created request object

- PUT /collections/:collectionId/requests/:requestId

  - Request JSON: partial or full request payload (method/url/headers/params/body)
  - Response: 200 OK
  - Body: updated request object

- DELETE /collections/:collectionId/requests/:requestId
  - Response: 204 No Content or 200 OK

Example curl: create a collection

```bash
curl -X POST "${VITE_API_BASE_URL:-http://localhost:3000}/collections" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Collection"}'
```

Example curl: create a POST request inside a collection

```bash
curl -X POST "${VITE_API_BASE_URL:-http://localhost:3000}/collections/<collectionId>/requests" \
  -H "Content-Type: application/json" \
  -d '{"name":"Create user","method":"POST","url":"https://jsonplaceholder.typicode.com/users","headers":{"Content-Type":"application/json"},"body":"{\"name\":\"Alice\"}"}'
```

## Executing requests from the app

When you click `Send` in the workspace, the app uses `fetch()` and displays:

- Status code and status text
- Time taken (ms)
- Response headers
- Parsed JSON body if the response Content-Type contains `application/json`, otherwise raw text

If the app cannot reach the configured backend for saving/updating collections, it falls back to local React Query cache and localStorage so you can continue working offline.

## Where things live in the code

- `src/components/Sidebar.tsx` — collection and request list UI
- `src/components/RequestWorkspace.tsx` — request editor and send/save logic
- `src/components/ResponsePanel.tsx` — response viewer
- `src/context/CollectionsProvider.tsx` — central provider with React Query mutations and cache fallbacks
- `src/api/collections.ts` — REST wrappers used by the client
- `src/index.css` — theme variables & colors (light/dark)

## Packaging

A macOS installer is included under `release/build/api-haven-setup-0.0.0.dmg`. For other platforms, build scripts should be added as needed.

## Contributing & extending

- To connect a real Mongo backend, implement the above endpoints and set the `VITE_API_BASE_URL` environment variable in the frontend before building.
- Add more request/response utilities in `src/lib` and tests under a `tests/` folder.

## FAQ / Tips

- Q: How can I save a request locally? A: Click `Save` in the request workspace. Saved requests also appear under Settings.
- Q: How are saved requests persisted? A: The app uses localStorage for snapshots and tries to persist to the backend; when the backend is unavailable it keeps working locally.

---

If you'd like, I can also:

- Render this markdown inside the app at `/docs` as a styled docs page (convert MD to HTML at build time or render with a markdown-to-react component).
- Add more detailed API examples, authentication docs, or screenshots.

Tell me which extras you want and I'll implement them next.

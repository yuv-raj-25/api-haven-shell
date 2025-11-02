# Getting Started

## Install & Run

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:5173 and click "Workspace" in the navbar.

## Create your first collection

1. Open the Sidebar.
2. Click the `+` button next to "Collections" (or the folder icon) and give it a name.
3. Click the collection to focus it and press the `+` inside it to add a request.

## Compose a request

- Select method (GET, POST, PUT, DELETE, etc).
- Enter the request URL.
- Add headers and query params using the UI.
- Add a request body for POST/PUT requests (JSON is supported).
- Click `Send` to run the request and view the response in the Response panel.

> Note: When composing requests with JSON bodies, format your JSON (2-space indent) and validate it before sending.

Use the example below to try a POST request quickly:

```bash
curl -X POST "https://jsonplaceholder.typicode.com/posts" \
	-H "Content-Type: application/json" \
	-d '{"title":"Hello","body":"World","userId":1}'
```

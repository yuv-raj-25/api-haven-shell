# API Reference

This section documents the REST endpoints the frontend expects for collections and requests. Use these endpoints when wiring a backend (for example, a Mongo-backed service).

## Collections

- GET /collections

  - Response: 200 OK
  - Body: Array of collection objects: `{ id, name, requests: [] }`

- POST /collections

  - Request: `{ name: string }`
  - Response: 201 Created
  - Body: created collection object

- DELETE /collections/:collectionId
  - Response: 204 No Content

## Requests

- POST /collections/:collectionId/requests

  - Request JSON: `{ name, method, url, headers?, params?, body? }`
  - Response: 201 Created

- PUT /collections/:collectionId/requests/:requestId

  - Request JSON: partial or full request payload
  - Response: 200 OK

- DELETE /collections/:collectionId/requests/:requestId
  - Response: 204 No Content

### Example (create a POST request)

```bash
curl -X POST "${VITE_API_BASE_URL:-http://localhost:3000}/collections/<collectionId>/requests" \
  -H "Content-Type: application/json" \
  -d '{"name":"Create user","method":"POST","url":"https://jsonplaceholder.typicode.com/users","headers":{"Content-Type":"application/json"},"body":"{\"name\":\"Alice\"}"}'
```

# Examples & Recipes

## POST JSON example

1. Create a new request in a collection.
2. Method: POST
3. URL: `https://jsonplaceholder.typicode.com/posts`
4. Headers: `Content-Type: application/json`
5. Body:

```json
{
  "title": "foo",
  "body": "bar",
  "userId": 1
}
```

Click `Send`. You should see a `201 Created` response with the created object.

## Using Query Parameters

Add key/value pairs in the params UI. The request URL will be built with the query string automatically.

## Saving Requests

Click `Save` to persist the request snapshot locally. Saved requests are visible in Settings and will be reloaded into the workspace when opened.

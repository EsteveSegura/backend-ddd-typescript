# backend-ddd-typescript

A ToDo API repository to explore Domain-Driven Design with TypeScript.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Docker

```bash
docker compose up -d
```

API will be available at `http://localhost:3000`.

## Testing with curl

```bash
# Create a todo
curl -X POST http://localhost:3000/api/v1/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy milk", "description": "From the store"}'

# List all todos
curl http://localhost:3000/api/v1/todos

# Get a single todo (replace <id> with actual id)
curl http://localhost:3000/api/v1/todos/<id>

# Update a todo
curl -X PUT http://localhost:3000/api/v1/todos/<id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy oat milk", "status": "COMPLETED"}'

# Delete a todo
curl -X DELETE http://localhost:3000/api/v1/todos/<id>
```

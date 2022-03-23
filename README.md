# Cache API

## Requirements

- MongoDB
- Node (Tested with version 16.14.2)

## Instruction

1. `nvm use` (Optional)
2. `npm i`
3. `npm run start` or `npm run test`

## Endpoints

| Endpoint         | Method | Purpose                              |
| ---------------- | ------ | ------------------------------------ |
| `/cache/api/`    | GET    | Get all keys for stored caches       |
| `/cache/api/:id` | GET    | Get cache for key `:id`              |
| `/cache/api/:id` | POST   | Create or update cache for key `:id` |
| `/cache/api/:id` | DELETE | Delete cache for key `:id`           |
| `/cache/api/`    | DELETE | Delete all caches                    |

[Postman Collection](./Cache API Collection.postman_collection.json)

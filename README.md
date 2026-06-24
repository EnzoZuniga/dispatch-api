# Dispatch API

Field technician mission dispatch system. RESTful API for managing service missions with status workflow and JWT authentication.

## Architecture

Modular Express application with domain-driven status transitions:

```
src/
  ├── domain/          # Business rules (transition logic)
  ├── modules/         # Feature modules (auth, missions)
  ├── middleware/      # Cross-cutting concerns
  └── errors.ts        # Custom error types
```

Each module follows a layered approach:
- **Types**: Domain entities and DTOs
- **Repository**: Data access abstraction (currently in-memory Map, interface-ready for Prisma)
- **Schemas**: Zod validation schemas
- **Service**: Business logic
- **Routes**: HTTP handlers

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express 4
- **Validation**: Zod
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Testing**: Vitest + Supertest
- **Dev tooling**: tsx for watch mode

## Running Locally

```bash
npm install
cp .env.example .env
npm run dev
```

Server starts on `http://localhost:3000`.

### Seed Credentials

```
Email: admin@dispatch.com
Password: admin123
```

### Example Requests

```bash
# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dispatch.com","password":"admin123"}'

# Create mission (requires token)
curl -X POST http://localhost:3000/missions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Fix AC","description":"Unit not cooling","location":"456 Oak Ave"}'

# Update mission status
curl -X PATCH http://localhost:3000/missions/mission_1/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"assigned"}'
```

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run typecheck     # Type checking
```

## Trade-offs

**In-memory storage**: No database dependency makes this trivial to clone and run. Repository interface allows swapping to Prisma/TypeORM without touching business logic. Production would need persistent storage and likely connection pooling.

**Single-instance state**: Mission data resets on restart. Multiple instances would diverge. Production needs shared state (Redis, PostgreSQL) and consider distributed locking for status transitions.

**JWT without refresh**: Tokens expire in 24h with no refresh mechanism. Simpler for a portfolio piece, but production should implement refresh tokens and token revocation.

**Basic rate limiting**: In-memory rate limiter doesn't persist across restarts and won't work in multi-instance deployments. Production should use Redis-backed limiter.

**No pagination**: `/missions` returns all missions. Fine for demos, breaks at scale. Add cursor-based pagination for production.

**Status machine centralized**: Transition rules live in `domain/transitions.ts`. Easy to reason about and test. For complex workflows, consider a state machine library or event sourcing.

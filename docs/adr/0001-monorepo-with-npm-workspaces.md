# ADR-0001: One monorepo with npm workspaces

- Status: accepted
- Date: 2026-11-13

## Context

AtomPay is about 8 TypeScript services plus shared packages (`money`, `errors`, `logger`,
`idempotency`, `outbox`, …), built by one person. Shared packages change often in the first weeks,
and a change to `money` must be tested against every service that uses it in the same PR.

## Decision

One Git repository. npm workspaces: `packages/*` for shared libraries, `services/*` for deployable
services. One strict `tsconfig.base.json` every workspace extends. One `npm run check` (Prettier,
ESLint with type information, `tsc`, Vitest) that CI runs on every push to `main`/`develop` and on
every PR.

## Alternatives

- **Polyrepo (a repo per service):** each shared package would need publishing and version bumps
  in every consumer. Too slow for one person, and cross-service changes can't be one PR.
- **pnpm workspaces:** stricter (no phantom dependencies) and faster installs, but one more tool to
  learn. npm ships with Node. Can switch later.
- **Nx / Turborepo:** build caching and task graphs pay off at dozens of packages, not at 15.

## Consequences

- One lockfile, one CI, atomic changes across services.
- Services can still be deployed alone: each gets its own Dockerfile and image.
- Risk: services importing each other's code directly. Rule: services may import only from
  `packages/*`, never from another service.
- Risk: phantom dependencies (using a package that only a sibling declared). Each workspace lists
  everything it imports in its own `package.json`.

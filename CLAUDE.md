# AtomPay Gateway

A learning project: a sandbox payment gateway (like Razorpay/Cashfree) as TypeScript
microservices, test mode only. The plan is `docs/PLAN.md`; the learning checklist is
`docs/LEARNING-MAP.md`.

## How to work here

- Build only what the current day in `docs/PLAN.md` lists. If anything is unclear, ask.
- Teach first: Hinglish with Indian real-world examples, then the interview answer in English.
  Build only after the concept is clear.
- Show a plan before building; write tests with the code.
- **Never commit or push.** Akshay does all Git operations himself.
- `npm run check` (format, lint, typecheck, test) must pass.

## Non-negotiables

1. Money is integer paise inside a `Money` value object. Never a JS float.
2. Every write that moves money is idempotent.
3. The browser is never trusted; only a server-to-server answer changes a status.
4. A lost answer is `UNKNOWN`, not `FAILED`.
5. The ledger always balances (debits = credits).
6. A service owns its database; no service reads another's tables.
7. No secrets in code or logs; API keys stored hashed; card numbers never logged.

## Layout

- `packages/*`: shared libraries. `services/*`: deployable services. Services import only from
  `packages/*`.
- `docs/adr/`: decisions. `docs/payments-101/`: domain diagrams. `docs/journal/`: daily notes.

## Git

`main` (deploys) ← `develop` ← `feature/day-NN-<name>`, `fix/*`, `docs/*`, `chore/*`.
Conventional Commits.

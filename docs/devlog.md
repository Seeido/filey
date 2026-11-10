# Devlog

## 28-29 Oct 2026: Planning

- Picked a mini-Dropbox-style file storage service as the showcase project, built layer by layer.
- File storage = API server + metadata in Postgres + bytes in a blob store. Local disk counts as a blob store; S3 comes in layer 2.
- Layer 1 scoped as a walking skeleton: sign up, log in, upload, list, download, delete, folders.
- Designing everything upfront was overwhelming. Designed the overall roadmap and switched to designing each feature before building it.

## 2-4 Nov 2026: Project setup

- Node + TypeScript + Express + Postgres + Drizzle. Migrations through drizzle-kit (generate + migrate), not run automatically on startup.
- Separate test database. Each npm script names its env file. A guard refuses to run tests or test migrations unless `DB_URL` points at `filey_test`.
- `--env-file` doesn't lock `process.env`. drizzle-kit loads `.env` on its own too. Which is why `migrate:test` doesn't throw when PORT isn't available in `.env.test` but is in `.env`. Existing variables aren't overwritten, so `.env.test` still wins.
- `parsePort` is a pure function (value passed, not env key), removed all the env stubbing from its tests. Awkward-to-test code is usually a design hint.
- Split tsconfigs: so tsconfig.json gives me type checking everywhere, but build config only compiles `src`.

## 5 Nov 2026: Logging

- pino for logging. pino-pretty only in the `dev` script via a pipe so the app itself doesn't have to deal with environments.
- `LOG_LEVEL` optional, defaults to `info`, validated against pino's own level names.
- A bug the tests approved: `parseLoggingLevel` lowercased for the check but returned the original. Expected values in tests should be literals, not computed with the same logic as the code.

## 6 Nov 2026: Health endpoint and timeouts

- Split building the app (`app.ts`) from starting it (`index.ts`) so tests can import the app without opening a port.
- Routers don't import the app, `app.ts` mounts them under a prefix. Avoids circular imports.
- `withTimeoutMs`: units belong in function names, clear the timer in `finally`, type the timeout promise as `Promise<never>` so `T` survives the race.

## 8 Nov 2026: Endpoint tests

- Fake timers: the synchronous `advanceTimersByTime` is enough unless a timer is scheduled after a promise resolves.
- Test endpoints with supertest. `vi.mock` for the whole queries module, since apparently spying on ES module exports doesn't work reliably.
- `result.body` is only filled for parsed formats like JSON. A plain-text leak would pass a body check. Assert on `result.text`, and check headers too.

## 10 Nov 2026: Logging HTTP requests

- The base logger (`logger.ts`) doesn't just log but now also redacts sensitive information. Redaction at the base/lowest level makes sure child loggers inherit redaction.
- Redaction tests build their own logger to be able to check the logs and pass log level "info" in case `.env.test` has it set as something else. The log length check makes sure an empty capture can’t pass.
- pino-http is used on top of pino. pino alone can be used to create Express.js middleware for all this but pino-http makes it simpler and accounts for all the edgecases I could miss.
- The request logger (`requestLogger.ts`) also sets headers like `X-Request-Id` since it's a middleware used for all endpoints anyways.
- Have handlers use `req.log` (provided by the requestLogger middleware) to log errors instead of the base logger to automatically include request info as its id, method, url, etc.

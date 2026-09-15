# QA Automation — Claude Code Guide

## Project Overview

Playwright + TypeScript test automation **portfolio** (reference project, not a
product). Targets public demos: JSONPlaceholder (API) and TodoMVC (UI).

31 tests / 7 projects. Baseline: **28 passed, 3 skipped, 0 failed** (~40s).
The 3 skips are `login-tests` — they need a local app on `BASE_URL`.

## Commands

```bash
npm test                     # all
npm run test:ci              # all except @visual — mirrors CI
npm run test:smoke           # reachability only
npm run test:api             # api-tests + user-crud-tests
npm run test:ui              # todo.spec
npm run test:a11y            # axe + keyboard
npm run test:visual          # screenshot baselines (local only)
npm run test:login           # needs BASE_URL app running
npm run test:update-snapshots
npm run typecheck            # tsc --noEmit
npm run report
```

## Architecture

```
fixtures/     todoPage (clears localStorage), adminPage/userPage (storageState)
pages/        BasePage → TodoPage
factories/    userFactory — deterministic + faker builders
utils/        reporter.ts (TestInfo → SummaryReport), appAvailability.ts (probe)
types/        every type in the repo lives here
tests/        api · user-crud · todo · a11y · visual · smoke · login
```

## Test projects (playwright.config.ts)

| Project | Spec | baseURL |
|---|---|---|
| smoke | smoke.spec.ts | jsonplaceholder |
| api-tests | api.spec.ts | jsonplaceholder |
| user-crud-tests | user-crud.spec.ts | jsonplaceholder |
| ui-tests | todo.spec.ts | demo.playwright.dev/todomvc/ |
| a11y-tests | a11y.spec.ts | demo.playwright.dev/todomvc/ |
| visual-tests | visual.spec.ts | demo.playwright.dev/todomvc/ |
| login-tests | login.spec.ts | `BASE_URL` (default :8100) |

Tags: `@smoke` `@regression` `@api` `@ui` `@a11y` `@visual` `@local-app`.

## Key conventions

- All types in `types/index.ts` — never declare a type inside a spec.
- Page Objects extend `BasePage`; fixtures wire them up in `fixtures/index.ts`.
- No `waitForTimeout` — web-first assertions only.
- `login-tests` **skip, not fail**, when no app answers `BASE_URL`
  (`utils/appAvailability.ts` probe, memoised per process).

## Gotchas

- **TodoMVC baseURL needs its trailing slash** (`…/todomvc/`). Without it,
  `page.goto('./')` resolves to the site root and every UI/a11y/visual test
  fails on the wrong page.
- **CI reporter must be `blob`** — `merge-reports` consumes blob output; with
  `html` the shard artifacts are empty and the merge job produces nothing.
- **`channel: 'chrome'` is local-only** (`browserChannel` in the config). CI
  installs chromium only.
- **Visual baselines are win32-only**, so CI runs `--grep-invert @visual`. Linux
  baselines come from the manual `visual-baselines` workflow_dispatch job that
  runs inside the official Playwright container.
- **JSONPlaceholder flakes under parallel load** — seen once in ~10 runs
  (`GET /users/1` non-200, passes on re-run). Third-party rate limit, absorbed
  by CI retries; do not add local retries to mask it.
- `fixtures/cleanup.ts` is a reference pattern, not wired to any spec —
  JSONPlaceholder ignores writes, so there is nothing real to tear down.

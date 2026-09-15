# QA Automation Portfolio

[![Playwright Tests](https://github.com/NNEWNERR/qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/NNEWNERR/qa-automation/actions/workflows/playwright.yml)

Playwright + TypeScript test automation covering **API, UI, accessibility and visual regression**, sharded 4× in GitHub Actions.

Targets are public demo systems so the suite is runnable by anyone:
[JSONPlaceholder](https://jsonplaceholder.typicode.com) (API) and
[TodoMVC](https://demo.playwright.dev/todomvc) (UI).

```bash
npm ci
npx playwright install chromium
npm test          # 28 passed, 3 skipped, ~40s
```

---

## Coverage

31 tests across 7 projects. The **technique** column is why each test exists — not
just what it clicks.

### API — `api.spec.ts`, `user-crud.spec.ts` (10 tests)

| Test | Technique |
|---|---|
| `GET /users/1` matches the `JPUser` shape | Contract / schema assertion — `toMatchObject` + `expect.any()` catches field-type drift, not just a 200 |
| `GET /posts` filterable by `userId` | Equivalence partitioning — one representative user stands in for the class |
| `POST /posts` echoes payload with new id | State transition — request → created resource |
| `GET /users` list + `GET /users/:id` single | Boundary between collection and item endpoints |
| `POST /users` with faker data | Data-driven — randomised input each run surfaces field-length/charset assumptions |
| `PUT /users/:id`, `DELETE /users/:id` | Full CRUD path coverage |
| Route mock returns factory data | Isolation — `page.route()` decouples the test from third-party uptime |
| Stateful mock: DELETE removes item from next GET | State-transition testing against a mock that actually holds state |

### UI — `todo.spec.ts` (5 tests)

| Test | Technique |
|---|---|
| Add todo appears in list | Happy path via Page Object |
| Complete todo reduces active count | State transition + `expect.soft` so one styling assertion doesn't mask the count assertion |
| Delete removes from list | Negative-space assertion (`expectItemHidden`) |
| Filter `Active` hides completed | Decision table: item state × active filter |
| Adding 3 todos shows count 3 | Boundary — single vs. multiple items |

### Accessibility — `a11y.spec.ts` (5 tests)

| Test | Technique |
|---|---|
| Whole page has no WCAG 2.1 A/AA violations | axe-core scan; violations attached to the HTML report as JSON |
| App shell scoped scan | `.include('.todoapp')` — scoping to `.todo-list` would pass vacuously on an empty list |
| First `Tab` lands on a visible control | Keyboard reachability, which axe cannot assert from the DOM alone |
| Todo can be added with the keyboard alone | End-to-end keyboard operability |
| Input exposes an accessible name | Asserts the **computed** accessible name, not a specific attribute |

`color-contrast` is disabled with a comment: the demo has known decorative
contrast issues we cannot fix in a third-party target. Muting one rule with a
stated reason beats muting the scan.

### Visual regression — `visual.spec.ts` (6 tests)

Full-page and component baselines at desktop (1280×720) and mobile (375×667),
plus a masked-header shot demonstrating how to exclude a live counter from the
diff. `animations: 'disabled'` on every component shot.

### Smoke — `smoke.spec.ts` (2 tests)

Pure reachability for both targets. No business assertions — it exists to fail
fast and cheaply when a target is down, so a red run is diagnosable at a glance.

### Auth — `login.spec.ts` (3 tests, skipped by default)

Role-based access (admin / user / guest) against a local Ionic app, using
`storageState` captured once in `global.setup.ts` instead of replaying the login
UI per test. **These skip rather than fail when no app is listening on
`BASE_URL`** — a suite that reports red for a missing optional dependency trains
people to ignore red.

```bash
BASE_URL=http://localhost:8100 npm run test:login
```

---

## Commands

| Command | Runs |
|---|---|
| `npm test` | Everything |
| `npm run test:ci` | Everything except `@visual` (what CI runs) |
| `npm run test:smoke` | Reachability only |
| `npm run test:api` / `test:ui` / `test:a11y` / `test:visual` | One layer |
| `npm run test:regression` | Everything tagged `@regression` |
| `npm run test:update-snapshots` | Regenerate visual baselines |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run report` | Open the last HTML report |

Tags: `@smoke` `@regression` `@api` `@ui` `@a11y` `@visual` `@local-app`.

---

## Architecture

```
pages/        Page Objects — TodoPage extends BasePage
fixtures/     todoPage (localStorage cleared per test), adminPage/userPage (storageState)
factories/    Deterministic + faker-backed test data builders
utils/        reporter.ts (TestInfo → typed SummaryReport), appAvailability.ts
types/        Every type in the repo — none declared inside a spec
tests/        One spec per concern: api · user-crud · todo · a11y · visual · smoke · login
```

Conventions worth calling out:

- **Types live in `types/index.ts` only.** Discriminated unions (`TestResult`)
  mean `if (result.status === 'failed')` narrows `errorMessage` to required — a
  missing error message is a compile error, not a runtime surprise.
- **Fixtures own setup, tests own assertions.** `todoPage` clears `localStorage`
  via `addInitScript` before each test, so tests never bleed state.
- **No `waitForTimeout` anywhere.** Web-first assertions with `expect` timeouts
  handle the waiting.

---

## CI

`.github/workflows/playwright.yml` — 4 parallel shards, blob reports merged into
one HTML report.

```
test (shard 1..4) ──> blob-report-N artifact ──> merge-reports ──> playwright-report
```

Two details that are easy to get wrong:

1. **The CI reporter must be `blob`.** `merge-reports` consumes blob output;
   with the default `html` reporter the uploaded artifacts are empty and the
   merge job silently produces nothing. See `playwright.config.ts`.
2. **`channel: 'chrome'` is dropped on CI.** Locally the suite drives real
   Google Chrome; the runner installs only chromium, so the channel is
   conditional rather than gambling on Chrome being preinstalled.

### Visual tests and CI

Screenshot baselines are **OS-specific** — Playwright suffixes them
(`-win32.png`) because font rasterisation differs between Windows and the Linux
runner. Committed baselines are win32, so CI runs `--grep-invert @visual`.

The migration path is a manual `workflow_dispatch` job (`visual-baselines`) that
runs the visual suite inside `mcr.microsoft.com/playwright:v1.58.2-noble` and
uploads Linux snapshots to be committed as a second baseline set. It never runs
automatically: baselines that regenerate themselves on every push make visual
regression testing meaningless.

### Known flake

JSONPlaceholder occasionally returns a non-200 under parallel load — observed
once in ~10 local runs on `GET /users/1`, not reproducible on re-run. It is a
third-party rate limit, not a defect in the system under test, and CI's
`retries: 2` absorbs it. Recorded here rather than papered over with a local
retry, because a local retry would hide a real regression in the same test.

---

## Decisions

**Why skip instead of fail for `login-tests`?** A test that fails for an
environmental reason and a test that fails for a bug look identical in a report.
Skipping with a message (`No app listening on … — set BASE_URL`) keeps that
distinction visible.

**Why one Playwright project per spec?** Each target needs its own `baseURL` and
headers. Projects make that declarative, let `--project=` select a layer, and
give the shard scheduler independent units to distribute.

**Why `expect.soft` in only one place?** Soft assertions are for gathering
multiple independent facts about one state. Using them everywhere hides which
assertion is the actual gate.

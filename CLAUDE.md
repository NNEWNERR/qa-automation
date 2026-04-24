# QA Automation — Claude Code Guide

## Project Overview

Playwright + TypeScript E2E and API test automation portfolio.
Targets: TodoMVC (UI) and JSONPlaceholder (API).

## Commands

```bash
npm test              # Run all tests (headless)
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run test:smoke    # Smoke tests only
npm run test:headed   # All tests with browser visible
npm run report        # Open HTML report
```

## Environment Variables

| Variable   | Default    | Values                         |
|------------|------------|--------------------------------|
| TEST_ENV   | `staging`  | `local` \| `staging` \| `production` |

## Architecture

```
fixtures/     Custom Playwright fixtures (todoPage)
pages/        Page Object Model classes
  BasePage    Common navigation helpers
  TodoPage    TodoMVC-specific actions
tests/        Test suites
  api.spec    JSONPlaceholder API tests (3 tests)
  todo.spec   TodoMVC UI tests (5 tests)
  smoke.spec  Pure connectivity check (1 test)
types/        Centralised TypeScript types — import from here only
utils/        reporter.ts — converts TestInfo → SummaryReport
```

## Test Projects (playwright.config.ts)

| Project    | File            | baseURL                                  |
|------------|-----------------|------------------------------------------|
| api-tests  | api.spec.ts     | https://jsonplaceholder.typicode.com     |
| ui-tests   | todo.spec.ts    | https://demo.playwright.dev/todomvc      |
| smoke      | smoke.spec.ts   | https://jsonplaceholder.typicode.com     |

## Key Conventions

- All types live in `types/index.ts` — never declare types inside spec files.
- Page Objects extend `BasePage`; fixtures in `fixtures/index.ts` wire them up.
- `todoPage` fixture clears localStorage before each test via `addInitScript`.

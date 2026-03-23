# QA Automation Portfolio

[![Playwright Tests](https://github.com/NNEWNERR/qa-automation/actions/workflows/playwright.yml/badge.svg)](https://github.com/NNEWNERR/qa-automation/actions/workflows/playwright.yml)

## Stack
- **Playwright** + **TypeScript** — E2E and API testing
- **Page Object Model** — maintainable test architecture
- **GitHub Actions** — CI/CD pipeline

## Project structure
```
├── pages/          # Page Objects (BasePage, TodoPage)
├── fixtures/       # Playwright fixture extension
├── tests/          # Test specs (API + UI)
├── types/          # TypeScript interfaces
└── utils/          # Reporter utilities
```

## Tests
| Suite | Count | Target |
|-------|-------|--------|
| API tests  | 3 | JSONPlaceholder API |
| UI tests   | 5 | TodoMVC demo |

## Run locally
```bash
npm ci
npx playwright install chromium
npx playwright test
npx playwright show-report
```
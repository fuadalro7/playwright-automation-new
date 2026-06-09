# Playwright Automation Framework

![CI](https://github.com/<your-username>/playwright-automation/actions/workflows/playwright.yml/badge.svg)

## Project Description

An end-to-end test automation framework built with Playwright and TypeScript. It covers UI testing for [SauceDemo](https://www.saucedemo.com/) and API testing for the [Simple Books API](https://simple-books-api.glitch.me). The framework uses the Page Object Model pattern, data-driven test execution, and runs across Chrome and Firefox.

## Prerequisites

| Tool    | Version |
|---------|---------|
| Node.js | >= 18.x |
| npm     | >= 9.x  |

Verify your versions:

```bash
node -v
npm -v
```

## Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/fuadalro7/playwright-automation-new.git
   cd playwright-automation
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install Playwright browsers:
   ```bash
   npx playwright install --with-deps chromium firefox
   ```

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (UI + API) on all browsers |
| `npm run test:ui` | Run UI tests only |
| `npm run test:api` | Run API tests only |
| `npm run test:headed` | Run all tests in headed (visible) mode |
| `npm run test:chrome` | Run all tests on Chrome only |
| `npm run test:firefox` | Run all tests on Firefox only |

You can also pass Playwright CLI flags directly:

```bash
npx playwright test --project=chrome tests/ui/login.spec.ts
```

## Architecture & Structure

```
playwright-automation/
├── src/
│   ├── pages/             # Page Object classes (LoginPage, ProductsPage, etc.)
│   │   ├── LoginPage.ts
│   │   ├── ProductsPage.ts
│   │   ├── CartPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── index.ts       # Barrel export for all page objects
│   ├── api/
│   │   └── BooksApiClient.ts   # API wrapper for Simple Books API
│   ├── fixtures/
│   │   ├── global-setup.ts     # Logs suite start time to console
│   │   └── global-teardown.ts  # Logs suite end time to console
│   ├── data/
│   │   ├── test-data.json      # UI test data (credentials, checkout info)
│   │   └── api-data.json       # API test data (client name, book ID, etc.)
│   └── utils/
│       └── random.ts           # Random string/email/number generators
├── tests/
│   ├── ui/
│   │   ├── login.spec.ts       # TC_UI_001, TC_UI_002
│   │   ├── products.spec.ts    # TC_UI_003
│   │   └── checkout.spec.ts    # TC_UI_004
│   └── api/
│       └── books-api.spec.ts   # TC_API_001 through TC_API_004
├── reports/                    # Generated test reports (gitignored)
├── .github/workflows/
│   └── playwright.yml          # CI pipeline config
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json
├── package.json
└── .gitignore
```

**Pattern:** Page Object Model (POM). Each page on SauceDemo has a corresponding class that encapsulates its locators and actions. Tests reference these classes rather than interacting with selectors directly. API tests use a client wrapper class for the same reason.

## Test Scenarios

### UI Tests

| TC ID      | Module    | Test Name                              | Description |
|------------|-----------|----------------------------------------|-------------|
| TC_UI_001  | Login     | Valid Login                            | Login with standard_user, verify redirect to Products page |
| TC_UI_002  | Login     | Data-Driven Invalid Login Validation   | 3 scenarios: no username, no password, wrong credentials — each driven from JSON |
| TC_UI_003  | Products  | Verify Products Sorted Z to A          | Sort by Name (Z to A), assert displayed order matches reverse-alpha |
| TC_UI_004  | Checkout  | End-to-End Checkout Flow               | Dynamically add 2 most expensive items, checkout, verify totals and confirmation |

### API Tests

| TC ID       | Module | Test Name            | Description |
|-------------|--------|----------------------|-------------|
| TC_API_001  | Auth   | POST - Create Order  | Register client with dynamic email, create book order, assert 201 + orderId |
| TC_API_002  | Orders | GET - Fetch Order    | Retrieve order by ID, verify bookId and customerName match |
| TC_API_003  | Orders | PATCH - Update Order | Update customerName, verify 204, confirm change via GET |
| TC_API_004  | Orders | DELETE - Remove Order| Delete order, verify 204, confirm 404 on follow-up GET |

## Viewing Reports

After running tests, an HTML report is generated under `reports/html/`. To open it:

```bash
npm run report
```

This starts a local server and opens the report in your browser. The report includes test results, execution times, and screenshots/videos for failed tests.

If you prefer to open it manually, find `reports/html/index.html` and open it in any browser.

## CI/CD

The GitHub Actions workflow (`.github/workflows/playwright.yml`) runs the full test suite under the following conditions:

- **On push to `main`** — any code merged to main triggers the pipeline
- **Daily schedule** — runs at 3:00 AM Amman time (00:00 UTC) every day
- **Manual trigger** — can be run on-demand via `workflow_dispatch`

**What the pipeline does:**
1. Checks out the code
2. Sets up Node.js 20
3. Installs project dependencies
4. Installs Playwright browsers (Chromium + Firefox)
5. Runs the full test suite in headless mode
6. Uploads the HTML report as an artifact (available for 14 days)

To view the report artifact: go to the Actions tab in GitHub → select a run → scroll to "Artifacts" → download `playwright-report`.

## Assumptions

- The Simple Books API base URL (`https://simple-books-api.glitch.me`) is the live endpoint; it may have rate limits or cold-start delays on Glitch.
- Firefox doesn't support `--start-maximized` the same way as Chromium, so a fixed 1920x1080 viewport is used instead.
- API tests run serially (`test.describe.serial`) because TC_API_002–004 depend on the order created in TC_API_001.
- The `reports/` directory is gitignored since reports are generated locally or downloaded from CI artifacts.

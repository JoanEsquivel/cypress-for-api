# Cypress API Testing — Restful Booker

This is an API test suite I built using Cypress to test the [Restful Booker API](https://restful-booker.herokuapp.com). It covers a full CRUD flow: create a booking, read it, update it, and delete it — all chained together in a single test to demonstrate request sequencing.

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20.19.0 (this is the version I'm running)
- [pnpm](https://pnpm.io/) — I'm using pnpm as the package manager

---

## Installation

```bash
git clone <repo-url>
cd cypress-for-api
pnpm install
```

---

## Environment Setup

You'll need a `cypress.env.json` file at the root of the project with the following content:

```json
{
  "username": "",
  "password": ""
}
```

These are the credentials used to authenticate against the Restful Booker API before each test.

---

## Running the Tests

### Headless (no browser UI)

```bash
pnpm cypress run
```

### Interactive (Cypress Test Runner UI)

```bash
pnpm cypress open
```

Once the Cypress app opens, select **E2E Testing**, pick a browser, and run the `bookings.cy.js` spec.

---

## Architecture

### Custom command: `cy.api()`

Instead of repeating `cy.request()` with the same headers and base URL in every test, I created a custom command called `cy.api()` in `cypress/support/commands.js`. It handles the Authorization header automatically by pulling the token from a Cypress alias, and it constructs the full URL using the base URL from `cypress/data/endpoints.json`. This keeps the tests clean and easy to read.

### Externalized data

I keep endpoints and payloads out of the test file itself. `cypress/data/endpoints.json` holds the base URL and route paths, and `cypress/data/payloads.json` holds the request bodies for creating and updating a booking. This makes it easier to update test data without touching the test logic.

### Auth flow

Before each test, I hit the `/auth` endpoint with credentials stored in `cypress.env.json` and save the token using Cypress's alias system (`cy.wrap(token).as('token')`). The `cy.api()` command then picks that up automatically on every request that needs it.

### Test structure

I intentionally chained the CRUD operations inside a single test using `.then()` callbacks to show how requests can be sequenced — passing the `bookingid` from the create step into the read, update, and delete steps. In a real project I'd split these into independent tests, but chaining them here shows the request dependency flow clearly.

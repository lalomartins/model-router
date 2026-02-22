# Router Package Tests

This package includes comprehensive Vitest suites for the model router.

## Running Tests

From the `packages/router` directory:

```bash
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

To generate coverage report:

```bash
npm test -- --coverage
```

## Test Files

- **index.test.js** - Tests for the main router module:
  - BehaviorSubject updates (prompt$, mode$)
  - Model selection logic
  - runPrompt function with adapter integration
  - Adapters object

- **adapters/httpAdapter.test.js** - Tests for HTTP adapter:
  - Observable creation
  - Fetch request creation with correct parameters
  - Error handling
  - Abort controller functionality
  - Request body and header validation

## Coverage

Run `npm test -- --coverage` to generate a coverage report in the `coverage/` directory.

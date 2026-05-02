# CLAUDE.md

NEVER COMMIT TO THE MASTER BRANCH!

## Project Overview

retro.tools is a real-time retrospective board application built with Svelte 5 + Vite. The frontend connects to a Firebase backend (Firestore + Cloud Functions). The dev environment points to a shared cloud-hosted backend by default.

## Tech Stack

- **Frontend**: Svelte 5 (runes syntax), Vite 8, JavaScript (ES modules)
- **Backend**: Firebase Firestore, custom rust backend server and Cloud Functions (separate repos)
- **UI**: SvelteStrap 7 (Bootstrap components for Svelte)
- **Testing**: Cypress 15 (E2E only)
- **Linting**: ESLint + Prettier

## Dev Commands

```bash
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Production build
npm run lint         # Check formatting and lint
npm run lint:fix     # Auto-fix formatting and lint issues
```

## Testing

Tests use Cypress for E2E testing. The dev server **must be running** before executing tests.

```bash
# In one terminal:
npm run dev

# In another terminal:
npx cypress run --spec <spec-path>        # headless
npx cypress open                          # interactive (good for writing new tests)

# Example:
npx cypress run --spec cypress/e2e/Card.cy.js
```

Test files live in `cypress/e2e/` and follow the `*.cy.js` naming convention.

**All new features must include a suitable set of Cypress tests.**

### Test conventions

- **Selectors**: always use `data-name` attributes (e.g. `cy.get("[data-name=card]")`), never CSS classes or text content. Add `data-name` attributes to any new interactive elements.
- **Auth**: call `cy.login()` (defined in `cypress/support/e2e.js`) to establish a session. Most tests need this in `before`/`beforeEach`.
- **Structure**: wrap test suites in `context()`, use `before()` for one-time setup (e.g. creating a board), and `beforeEach()` for navigation before each test.
- **One file per feature**: name the spec after the component it covers (e.g. `Card.cy.js`, `Timer.cy.js`).

## Code Conventions

- **Svelte syntax**: Use Svelte 5 runes syntax (`$state`, `$derived`, `$effect`, `$props`) — not the legacy Options API.
- **Formatting**: Prettier enforces 2-space indent, single quotes, semicolons, trailing commas (ES5). Run `npm run lint:fix` before committing.
- **i18n**: All user-facing strings must use `svelte-i18n`. When adding a new key, add it to **all** language files in `src/lang/` — not just `en.json`. The files are: `en.json`, `de.json`, `es.json`, `ko.json`, `pt_BR.json`, `ru.json`, `tr.json`, `uk.json`.
- **State**: Use Svelte stores (`src/store.js`) for shared state.

## Git Workflow

- Never commit directly to `master` — always work on a feature branch and open a PR.
- Run `npm run lint:fix` and resolve any remaining lint errors before committing.
- When making changes to an existing PR, **commit to the PR branch** rather than creating a new branch.
- Keep commits focused; the CI pipeline runs lint, audit, build, and Cypress on every push.
- Use `[skip ci]` in a commit message to skip CI when appropriate (e.g. docs-only changes).
- To check CI status on a PR, use `gh pr checks <pr-number>` — do not re-read local background task output files, which may be stale from a previous run.

## Project Structure

```
src/
  components/    # Reusable Svelte components
  lang/          # i18n translation files (en.json is the source of truth)
  App.svelte     # Root component
  Board.svelte   # Main board page
  Splash.svelte  # Landing page
  api.js         # Backend API calls
  firestore.js   # Firestore real-time integration
  store.js       # Svelte stores (shared state)
  encryption.js  # Password-based board encryption
cypress/
  e2e/           # Test specs (one file per feature)
  support/       # Custom commands (cy.login, etc.)
  fixtures/      # Static test data
```

## Backend

The dev environment proxies `/boards` and `/auth` requests to a shared cloud-hosted backend — no local backend needed. It's safe to use freely; old data is cleaned up automatically.

To run against a local backend instead, swap the proxy targets in `vite.config.js` (commented-out `localhost:8000` lines are already there).

The backend is split across two separate repos:
- [d0x2f/retro.tools-backend](https://github.com/d0x2f/retro.tools-backend) — main backend, written in Rust
- [d0x2f/retro.tools-cloud-functions](https://github.com/d0x2f/retro.tools-cloud-functions) — Firebase Cloud Functions

## Firestore Behaviour

Key non-obvious facts about how the Firestore Web SDK behaves in this app:

- **`onSnapshot` error callback is for unrecoverable errors only.** It fires for permission denied, auth expiry, and server errors — not for temporary network loss. The SDK handles brief disconnections silently with its own retry loop, so you won't see these errors during normal WiFi hiccups.
- **When the error callback fires, the listener is permanently terminated.** The app will receive no further updates from that subscription without explicitly calling `onSnapshot` again.
- **Firestore has no connection state API.** Unlike Firebase Realtime Database (which exposes `.info/connected`), the Firestore Web SDK provides no way to observe whether the client is currently connected to the server. The browser `offline`/`online` events are the best available proxy.
- **The browser `offline` event has a limited scope.** It fires when the OS-level network interface goes down (WiFi off, cable unplugged). It does NOT fire when the network is up but the server is unreachable (Firebase outage, captive portal, DNS failure). Treat it as "definitely offline" not "definitely online".

## Testing Connectivity

To simulate going offline in Cypress, dispatch the browser event directly — do not use CDP `Network.emulateNetworkConditions`, which throttles the network layer but does not fire the browser `offline` event:

```js
// go offline
cy.window().then((win) => win.dispatchEvent(new Event("offline")));

// go back online
cy.window().then((win) => win.dispatchEvent(new Event("online")));
```

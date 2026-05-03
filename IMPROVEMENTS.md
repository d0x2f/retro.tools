# Codebase Improvements

Identified during code review on 2026-05-02.

---

## Incomplete Svelte 5 Migration

### 1. `run()` from `svelte/legacy` used in 8 files
Should be replaced with `$derived` or `$effect`:

| File | Line | Usage | Replacement |
|---|---|---|---|
| `src/Board.svelte` | 93 | sortedRanks sort | `$derived` |
| `src/components/Rank.svelte` | 49 | columnWidth computation | `$derived` |
| `src/components/Timer.svelte` | 106 | updateInterval call | `$effect` |
| `src/components/Menu.svelte` | 39 | auto-show timer on active | `$effect` |
| `src/components/IceBreaker.svelte` | 43 | CSS class string | `$derived` |
| `src/components/Alert.svelte` | 20 | CSS class string | `$derived` |
| `src/components/Button.svelte` | 24 | CSS class string | `$derived` |
| `src/components/Input.svelte` | 43 | CSS class string | `$derived` |
| `src/components/Textarea.svelte` | 43 | CSS class + autoresize reset | `$derived` / `$effect` |

### 2. `createEventDispatcher` and `on:event` syntax still used throughout
Svelte 5 uses callback props instead. Files still using the legacy pattern:
`Card.svelte`, `Rank.svelte`, `Menu.svelte`, `ReactDrawer.svelte`, `BoardRow.svelte`, `PasswordWall.svelte`, `BoardTable.svelte`, `Votes.svelte`, `IceBreaker.svelte`, `Header.svelte`, `RankOptions.svelte`

### 3. `createBubbler` still used in primitive components
**Files:** `src/components/Button.svelte:4`, `src/components/Input.svelte:4`, `src/components/Textarea.svelte:4`
`createBubbler` is a legacy compat shim. Should be replaced with explicit callback props passed through to the underlying element.

---

## i18n Gap

### 4. Entire "features" section of Splash.svelte is hardcoded English
**File:** `src/Splash.svelte:146–226`
Five feature cards and all their body text are raw English strings not wrapped in `$_()`. Affected content:
- Card titles: "Anonymous", "Simple, Clean & Intuitive", "Free & Open Source", "No Logins!", "End to End Encryption"
- All paragraph text within each card

Every non-English locale sees these in English. Keys should be added to `src/lang/en.json` and translations requested.

---

## Dependencies

### 5. `moment.js` (~300KB) used only for `fromNow()`
**Files:** `src/components/BoardRow.svelte:91`, `src/components/LocaleSelect.svelte:21`, `src/i18n.js:2–19`
The only user-facing use is a single relative timestamp. Can be replaced with the native `Intl.RelativeTimeFormat` API, eliminating a large dependency.

Also: moment locales are imported for `es`, `ko`, `de`, `ru`, `uk` but **not** `pt_BR` or `tr` — so those two locales currently display English relative timestamps.

### 6. Deprecated `event.keyCode`
**Files:** `src/components/Input.svelte:25,33`, `src/components/Textarea.svelte:27,35`
`keyCode` is deprecated. Replace with `event.key === 'Enter'` and `event.key === 'Escape'`.

---

## Performance

### 7. `EncryptedText` double async waterfall per render
**File:** `src/components/EncryptedText.svelte`
Every render awaits `decrypt()` then serially awaits `checkBoardPassword()`. The password check result doesn't change during a session — it could be derived once in a parent and passed as a prop, or memoized in a store.

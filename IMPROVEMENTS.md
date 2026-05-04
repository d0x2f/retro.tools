# Codebase Review: Issues & Improvements

Findings from a comprehensive review of the retro.tools frontend. Covers Svelte components, JS modules, security, i18n, tests, and CI/CD. Each entry includes a file:line reference, description, and recommended fix.

---

## Bugs

### B1 — Memory leak in dark mode media query listener (`src/App.svelte:20–34`)

**Severity: High**

The `change` listener on `prefersDarkScheme` is added as an anonymous arrow function on line 20, but the `onMount` cleanup on line 33 tries to remove `darkModeChangeListener` — a different function reference used for the colorMode subscription. The anonymous media-query listener is never removed, leaking on every unmount.

```js
// Current (line 20): listener added as anonymous function
prefersDarkScheme.addEventListener("change", (e) => { ... });

// Current (line 33): removes the WRONG function
return () => {
  unsubscribeDarkModeChange();
  prefersDarkScheme.removeEventListener("change", darkModeChangeListener); // wrong ref
};
```

**Fix:** Store the handler in a named variable and reference it in both `addEventListener` and `removeEventListener`.

```js
const handleSchemeChange = (e) => { ... };
prefersDarkScheme.addEventListener("change", handleSchemeChange);
return () => {
  unsubscribeDarkModeChange();
  prefersDarkScheme.removeEventListener("change", handleSchemeChange);
};
```

---

### B2 — ClipboardJS instance never stored or destroyed (`src/components/Menu.svelte:42`)

**Severity: High**

`new ClipboardJS("button")` runs at module scope (outside any lifecycle hook), so the instance is created but never stored or `.destroy()`-ed when the component unmounts. The `"button"` selector also matches all buttons in the document, including those not yet mounted.

**Fix:** Move into `onMount`, store the instance, destroy it in the cleanup:

```js
import { onMount } from "svelte";
let clipboard;
onMount(() => {
  clipboard = new ClipboardJS("[data-clipboard-text]");
  return () => clipboard.destroy();
});
```

---

### B3 — Null dereference in drag `accepts` callback (`src/Board.svelte:62`)

**Severity: High**

```js
accepts: (el, target) => {
  return target.dataset.rankId !== $cards.find((c) => c.id === el.dataset.cardId).column;
},
```

If the card is not found in `$cards` (e.g. the store is mid-update), `.column` throws a `TypeError` and crashes the drag handler.

**Fix:** Guard against a missing card:

```js
accepts: (el, target) => {
  const card = $cards.find((c) => c.id === el.dataset.cardId);
  return card != null && target.dataset.rankId !== card.column;
},
```

---

### B4 — Null dereference in drag `drop` handler (`src/Board.svelte:80`)

**Severity: High**

Same pattern as B3. `const card = $cards.find(...)` is used immediately without a null check. If the card is absent, subsequent property access throws.

**Fix:**

```js
drake.on("drop", async (el, target) => {
  const card = $cards.find((c) => c.id === el.dataset.cardId);
  if (!card) return;
  ...
});
```

---

### B5 — `requestJson` doesn't check HTTP status (`src/api.js:16–18`)

**Severity: Medium**

```js
async function requestJson(input, init) {
  return (await fetch(input, init)).json();
}
```

On a 4xx or 5xx response, `.json()` either throws a parse error (if the body isn't JSON) or silently decodes the error body as if it were valid data. Callers have no way to distinguish success from failure.

**Fix:**

```js
async function requestJson(input, init) {
  const response = await fetch(input, init);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}
```

---

### B6 — Missing null guards in `normaliseCard` (`src/firestore.js:115–116`)

**Severity: Medium**

`data.column.id` and `data.owner.id` are accessed directly without checking that `column` or `owner` exist. If a Firestore document is missing either field (due to a partial write, schema migration, or corrupted data), this throws inside the `onSnapshot` callback and breaks all card subscriptions silently.

**Fix:**

```js
column: data.column?.id ?? null,
owner: data.owner?.id === get(uid),
```

---

### B7 — Private Firestore SDK field access (`src/firestore.js:124`)

**Severity: Medium**

```js
document._document.createTime.timestamp.seconds * 1000
```

`_document` is an internal, undocumented Firestore SDK field. It can silently change or disappear on any SDK update. The fallback is also non-obvious.

**Fix:** Use `Date.now()` as the fallback rather than reaching into private internals:

```js
created_at: new Date(data?.created_at?.toMillis() ?? Date.now()),
```

---

### B8 — Race condition in async derived store (`src/store.js:70–76`)

**Severity: Medium**

```js
export const passwordValid = derived(
  [board, password],
  ([$board, $password], set) => {
    checkBoardPassword($board, $password).then(set);
  },
  null,
);
```

If `board` or `password` changes rapidly, multiple async calls can be in-flight simultaneously. Whichever resolves last wins — which may not be the most recent call. This can leave `passwordValid` set to a stale result.

**Fix:** Cancel the previous promise by tracking a generation counter:

```js
export const passwordValid = derived(
  [board, password],
  ([$board, $password], set) => {
    let cancelled = false;
    checkBoardPassword($board, $password).then((v) => { if (!cancelled) set(v); });
    return () => { cancelled = true; };
  },
  null,
);
```

---

## Security

### S1 — Weak encryption: no key derivation, no authentication (`src/encryption.js:1–20`)

**Severity: Critical**

The encryption implementation has two fundamental weaknesses:

1. **No key derivation**: The raw password string is passed directly to `AES.encrypt` as the key. crypto-js uses a non-standard, weak KDF (MD5-based EVP_BytesToKey) rather than PBKDF2/scrypt. This makes brute-force attacks significantly easier.
2. **No authentication**: crypto-js uses AES-CBC, which has no integrity/authenticity guarantee. An attacker who can modify stored ciphertext can do so undetected.

**Fix:** Replace with the Web Crypto API (built into all modern browsers, no dependency needed), using PBKDF2 for key derivation and AES-GCM for authenticated encryption:

```js
export async function encrypt(clearText, password) {
  if (!password) return clearText;
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, hash: "SHA-256", iterations: 200_000 },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"],
  );
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(clearText));
  const out = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  out.set(salt, 0);
  out.set(iv, salt.byteLength);
  out.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);
  return btoa(String.fromCharCode(...out));
}
```

Note: migrating to AES-GCM is a breaking change for existing encrypted boards — a migration path (detecting old crypto-js format vs new) is required.

---

### S2 — Silent decryption failure returns `"?"` (`src/encryption.js:15–19`)

**Severity: Medium**

```js
} catch {
  return "?";
}
```

Callers (e.g. the CSV export in `Menu.svelte`) cannot tell whether `"?"` is the actual decrypted content or a decryption failure. Wrong passwords, corrupted data, and tampering all look identical.

**Fix:** Throw a typed error instead, and let callers handle it:

```js
} catch {
  throw new Error("Decryption failed");
}
```

---

## CI/CD

### C1 — Outdated GitHub Actions versions (`.github/workflows/CICD.yml:14, 47`)

**Severity: Medium**

Uses `actions/checkout@v1` and `actions/setup-node@v1`. Both are several major versions behind (current: v4). v1 uses deprecated Node.js runtimes and has known deprecation warnings that will eventually become errors.

**Fix:** Bump to current versions:

```yaml
- uses: actions/checkout@v4
- uses: actions/setup-node@v4
  with:
    node-version: 22.x
```

---

### C2 — Non-LTS Node.js version (`.github/workflows/CICD.yml:15, 50`)

**Severity: Low**

`node-version: 25.x` is experimental/current, not an LTS release. Using a non-LTS version in CI risks unexpected breakage when minor releases ship.

**Fix:** Use `22.x` (Active LTS) or `20.x` (Maintenance LTS).

---

### C3 — Firefox testing disabled (`.github/workflows/CICD.yml:39–40`)

**Severity: Low**

```yaml
# - firefox
```

The app is only tested on Chrome. Firefox has diverged on several CSS and JS behaviours that Chrome tolerates. Re-enabling Firefox in the matrix would catch cross-browser regressions before they reach users.

---
# lens-desktop

A **template** for the lens family's privacy-first desktop apps (Electron). It
wraps a bundled **Python sidecar** (any family member's `serve` HTTP API) behind a
native UI, sets the heavy ML stack up **on first run** (no system Python), and
uses a **local LLM via Ollama** — so student work never leaves the machine.

> This is a GitHub *template*, not a runtime dependency. Create an app *from* it
> (`Use this template`), then fill the config in `app.config.cjs`. Apps stay
> self-contained and can diverge; the proven patterns (and their fixes) start in
> one place.
>
> First consumers: **assessment-lens desktop**, then **assessment-bench desktop**.

## What it gives you (harvested from the family's proven apps)

| Module | Pattern from | Does |
|---|---|---|
| `electron/sidecar-manager.ts` | document-lens `BackendManager` + talk-buddy | spawn the Python `serve` sidecar, free-port pick, per-session bearer token (kept in main), `/health` poll, phase state machine, auto-restart, graceful→SIGTERM→SIGKILL |
| `electron/first-run.ts` + `scripts/install.sh` + `scripts/install.ps1` | talk-buddy `setup.sh` + `EmbeddedInstallModal` | on first run: build an app-local venv, `pip install` the whole stack (CPU-only torch), download + **SHA-256 verify** models, streamed to a progress modal. Accepts **multiple pip specs**; `install.ps1` is the Windows equivalent talk-buddy lacked. |
| `electron/router-config.ts` | assessment-lens desktop | writes `auto-analyser.yaml` so the bundled `*-analyser` CLIs are routed locally instead of to `localhost:800x`. No-op when the app installs no specialists. |
| `electron/ollama.ts` + `electron/ollama-install.ts` | insight-lens / career-compass + assessment-lens | probe `:11434`, one-click per-OS install with progress, tiered curated models sized to the machine, streaming NDJSON pull |
| `electron/settings.ts` | assessment-lens desktop | tiny JSON settings (chosen model tier, heuristic-cascade gate) |
| `electron-builder.config.js` + `scripts/notarize.js` | all apps (identical) | mac dmg+zip (universal), win nsis, linux AppImage+deb; custom notarize via `NOTARIZE_APPLE_*` |
| `electron/main.ts`, `electron/preload.ts` | career-compass | window (with navigation lockdown), contextIsolation, IPC bridge, sidecar proxy (token stays in main), auto-update |

## Make an app from it

1. `Use this template` → new repo (e.g. `assessment-lens-desktop`).
2. Edit **`app.config.cjs`** — set `appId`, `productName`, the **pip specs** for
   the sidecar (`sidecarPipSpecs`, an array: the member plus any `*-analyser`
   specialists the router must reach), the **serve command**, and the curated
   Ollama tiers.
3. Drop any **bundled models** into `resources/models/` (or list them in
   `app.config.cjs` `models` for first-run download).
4. Build the UI in `src/` against the sidecar via
   `window.lens.api(method, path, body)` — the token is attached in main.
5. `npm install && npm run dev` to develop; `npm run build` to package.

## Develop

```bash
npm install
npm run dev
npm run typecheck
npm test          # vitest unit tests (router-config, plus your own)
npm run build
```

## Status

The reusable modules are kept in step with the family's shipped apps and are
verified here to **typecheck, build, and pass their unit tests**. The highest-risk
piece (per-OS first-run install of the ML stack, esp. `install.ps1` on Windows)
**must still be verified on real machines** before the first app ships. See
[lens-analysers/docs/DESKTOP-APPS-DESIGN.md](https://michael-borck.github.io/lens-analysers/docs/DESKTOP-APPS-DESIGN.html).
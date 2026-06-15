# lens-desktop

A **template** for the lens family's privacy-first desktop apps (Electron). It
wraps a bundled **Python sidecar** (any family member's `serve` HTTP API) behind a
native UI, sets the heavy ML stack up **on first run** (no system Python), and
uses a **local LLM via Ollama** — so student work never leaves the machine.

> This is a GitHub *template*, not a runtime dependency. Create an app *from* it
> (`Use this template`), then fill the `APP_*` config. Apps stay self-contained
> and can diverge; the proven patterns (and their fixes) start in one place.
>
> First consumers: **assessment-lens desktop**, then **assessment-bench desktop**.

## What it gives you (harvested from the family's proven apps)

| Module | Pattern from | Does |
|---|---|---|
| `electron/sidecar-manager.ts` | document-lens `BackendManager` + talk-buddy | spawn the Python `serve` sidecar, free-port pick, per-session bearer token, `/health` poll, phase state machine, auto-restart, graceful→SIGTERM→SIGKILL |
| `electron/first-run.ts` + `scripts/install.sh` + `scripts/install.ps1` | talk-buddy `setup.sh` + `EmbeddedInstallModal` | on first run: build an app-local venv, `pip install` the stack (CPU-only torch), download + **SHA-256 verify** models, streamed to a progress modal. **`install.ps1` is the Windows equivalent talk-buddy lacked.** |
| `electron/ollama.ts` | insight-lens / career-compass `OllamaSetupCard` | probe `:11434`, guide install, curated model list, streaming NDJSON pull |
| `electron/secure-storage.ts` | career-compass | API keys via safeStorage (Keychain/DPAPI/libsecret) + plaintext fallback |
| `electron-builder.yml` + `scripts/notarize.js` | all five apps (identical) | mac dmg+zip (universal), win nsis, linux AppImage+deb; custom notarize via `NOTARIZE_APPLE_*` |
| `electron/main.ts`, `electron/preload.ts` | career-compass | window, contextIsolation, IPC bridge, auto-update wiring |

## Make an app from it

1. `Use this template` → new repo (e.g. `assessment-lens-desktop`).
2. Edit `app.config.ts` — set `APP_ID`, `PRODUCT_NAME`, the **pip spec** for the
   sidecar (e.g. `assessment-lens[serve,analysers,distinctiveness,llm]`), the
   **serve command** (`assessment-lens serve --port {PORT}`), and the curated
   Ollama model.
3. Drop any **bundled models** into `resources/models/` (or list them in
   `app.config.ts` for first-run download).
4. Build the UI in `src/` against the sidecar's HTTP API (the family contract).
5. `npm install && npm run dev` to develop; `npm run build` to package.

## Status

Scaffold — **not yet `npm install`-ed or launched here**. The reusable modules are
written against the documented patterns; the highest-risk piece (per-OS first-run
install of the ML stack, esp. `install.ps1` on Windows) **must be verified on real
machines** before the first app ships. See
[lens-analysers/docs/DESKTOP-APPS-DESIGN.md](https://michael-borck.github.io/lens-analysers/docs/DESKTOP-APPS-DESIGN.html).

// The ONE place an app made from this template customises itself.
// Required by both electron-builder.config.js (build) and the main process
// (runtime), so the two never drift.
//
// Replace the example values below when you `Use this template`.

// One local model, referenced everywhere it matters (Ollama pull + the app's
// default model) so the model the app pulls is the model the engine uses.
// Tiers are examples — edit to suit the app and the hardware it targets.
const OLLAMA_MODELS = {
  small: { id: "qwen3.5:2b", label: "Qwen3.5 · 2B", sizeGB: 1.6, note: "lighter — fine on 8–16 GB machines" },
  large: { id: "qwen3.5:4b", label: "Qwen3.5 · 4B", sizeGB: 2.9, note: "better prose — needs ~16 GB" },
};
const LOCAL_MODEL = OLLAMA_MODELS.small.id;

module.exports = {
  // Identity
  appId: "com.example.lensapp",
  productName: "Lens App",

  // --- Python sidecar (the app's `serve` HTTP API) ---------------------------
  // pip specs installed into the app-local venv on first run. List every spec
  // the engine needs — the member itself plus any `*-analyser` specialists the
  // router (auto-analyser) must reach. Those specialists are written into an
  // `auto-analyser.yaml` beside the sidecar automatically (see writeRouterConfig
  // in main.ts). Pin per app release; bump deliberately.
  sidecarPipSpecs: [
    "assessment-lens[serve,analysers,distinctiveness,llm]==0.5.2",
  ],
  // Console script the installed package exposes; {PORT}/{HOST} are substituted,
  // resolved against the venv's bin/ dir.
  serveCommand: "assessment-lens serve --port {PORT} --host {HOST}",
  // Health endpoint + default port (the sidecar manager probes this).
  healthPath: "/health",
  defaultPort: 8021,
  // The env var the member reads its bearer token from — the family standard is
  // {PREFIX}_AUTH_TOKEN (lens-contract add_auth). Main generates the token per
  // session and keeps it out of the renderer.
  authTokenEnv: "LENS_AUTH_TOKEN",
  // Extra env for the spawned engine. App-specific (e.g. a narration model env
  // var); main merges this into the sidecar's environment.
  sidecarEnv: {},

  // --- Models (fully-offline) ------------------------------------------------
  // Either drop files in resources/models/ (bundled in the installer), or list
  // them here for first-run download with SHA-256 verification. dest is relative
  // to the app-local models dir.
  models: [
    // { url: "https://…/model.bin", sha256: "…", dest: "whisper/ggml-tiny.bin" },
  ],

  // --- Local LLM (Ollama) ----------------------------------------------------
  ollama: {
    models: OLLAMA_MODELS, // curated tiers, offered by machine size
    defaultModel: LOCAL_MODEL,
  },
};
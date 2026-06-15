// The ONE place an app made from this template customises itself.
// Required by both electron-builder.config.js (build) and the main process
// (runtime), so the two never drift.
module.exports = {
  // Identity
  appId: "com.example.lensapp",
  productName: "Lens App",

  // --- Python sidecar (the app's `serve` HTTP API) ---------------------------
  // pip spec installed into the app-local venv on first run. Include the member's
  // [serve] extra (and whatever analyser/feature extras it needs).
  sidecarPipSpec: "assessment-lens[serve,analysers,distinctiveness,llm]",
  // Console script the installed package exposes; {PORT}/{HOST} are substituted,
  // resolved against the venv's bin/ dir. (e.g. `assessment-lens serve ...`)
  serveCommand: "assessment-lens serve --port {PORT} --host {HOST}",
  // Health endpoint + default port (the sidecar manager probes this).
  healthPath: "/health",
  defaultPort: 8021,

  // --- Models (fully-offline) ------------------------------------------------
  // Either drop files in resources/models/ (bundled in the installer), or list
  // them here for first-run download with SHA-256 verification. dest is relative
  // to the app-local models dir.
  models: [
    // { url: "https://…/model.bin", sha256: "…", dest: "whisper/ggml-tiny.bin" },
  ],

  // --- Local LLM (Ollama) ----------------------------------------------------
  ollama: {
    recommendedModel: "llama3.2:3b", // curated default; pulled in-app with progress
    recommendedSizeGB: 2.0,
  },
};

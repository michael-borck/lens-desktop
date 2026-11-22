import { useEffect, useState } from "react";
import type { SidecarStatus } from "../global";
import { EngineStatus } from "./components/EngineStatus";
import { FirstRunModal } from "./components/FirstRunModal";
import { OllamaSetupCard } from "./components/OllamaSetupCard";

/**
 * Template shell. Apps replace `<YourWorkflow />` with their real UI, talking to
 * the sidecar through `window.lens.api(method, path, body)` (main holds the
 * bearer token and proxies the request). The reusable bits — first-run modal,
 * engine status, Ollama setup — come for free.
 */
export function App() {
  const [status, setStatus] = useState<SidecarStatus>({ phase: "not-started", url: "" });
  const [setupPhase, setSetupPhase] = useState<string>("");
  const [heuristics, setHeuristics] = useState(true);
  const [routing, setRouting] = useState(false);

  useEffect(() => {
    window.lens.sidecarStatus().then(setStatus);
    const offStatus = window.lens.onSidecarStatus(setStatus);
    const offPhase = window.lens.onSetupPhase(setSetupPhase);
    void window.lens.config().then((c) => {
      setHeuristics(c.settings?.heuristics !== false);
      setRouting(c.routing);
    });
    return () => {
      offStatus();
      offPhase();
    };
  }, []);

  const installing = setupPhase === "installing" || status.phase === "installing";

  return (
    <main style={{ fontFamily: "system-ui, sans-serif", padding: 24, maxWidth: 880, margin: "0 auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: 20, margin: 0 }}>Lens App</h1>
        <EngineStatus status={status} />
      </header>

      {installing && <FirstRunModal />}

      <section style={{ marginTop: 24 }}>
        <OllamaSetupCard />
      </section>

      <section style={{ marginTop: 24, color: "#555", display: "grid", gap: 10 }}>
        <p style={{ margin: 0 }}>
          Replace this with your workflow. The engine is at{" "}
          <code>{status.url || "(starting…)"}</code> — call it with{" "}
          <code>window.lens.api("GET", "/health")</code> (main attaches the bearer
          token).
        </p>
        {/* The heuristic gate only matters when the app routes through
            auto-analyser (installs `*-analyser` specialists). */}
        {routing && (
          <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 13 }}>
            <input
              type="checkbox"
              checked={heuristics}
              onChange={(e) => {
                const next = e.target.checked;
                setHeuristics(next);
                void window.lens.setHeuristics(next);
              }}
            />
            Detect AI-chat transcripts &amp; reflective journals (heuristic signal passes)
          </label>
        )}
      </section>
    </main>
  );
}
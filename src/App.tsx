import { useEffect, useState } from "react";
import type { SidecarStatus } from "../global";
import { EngineStatus } from "./components/EngineStatus";
import { FirstRunModal } from "./components/FirstRunModal";
import { OllamaSetupCard } from "./components/OllamaSetupCard";

/**
 * Template shell. Apps replace `<YourWorkflow />` with their real UI, talking to
 * the sidecar over HTTP (status.url + bearer status.token). The reusable bits —
 * first-run modal, engine status, Ollama setup — come for free.
 */
export function App() {
  const [status, setStatus] = useState<SidecarStatus>({ phase: "not-started", url: "", token: "" });
  const [setupPhase, setSetupPhase] = useState<string>("");

  useEffect(() => {
    window.lens.sidecarStatus().then(setStatus);
    const offStatus = window.lens.onSidecarStatus(setStatus);
    const offPhase = window.lens.onSetupPhase(setSetupPhase);
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

      <section style={{ marginTop: 24, color: "#555" }}>
        <p>
          Replace this with your workflow. The analysis engine is at{" "}
          <code>{status.url || "(starting…)"}</code> — call it over HTTP with the
          bearer token from <code>window.lens.sidecarStatus()</code>.
        </p>
      </section>
    </main>
  );
}

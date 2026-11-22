import { describe, expect, it } from "vitest";
import { renderRouterConfig, routerMembers } from "./router-config";

const SPECS = [
  "assessment-lens[serve,analysers]==0.5.2",
  "auto-analyser>=0.8.0",
  "document-analyser[embeddings]",
  "video-analyser>=0.13.0",
  "code-analyser",
];

describe("routerMembers", () => {
  it("keeps specialists and drops the engine and the router", () => {
    const members = routerMembers(SPECS);
    expect(members).toContain("document-analyser");
    expect(members).toContain("video-analyser");
    expect(members).toContain("code-analyser");
    expect(members).not.toContain("assessment-lens");
    expect(members).not.toContain("auto-analyser");
  });

  it("parses a versioned spec without leaving a trailing '>'", () => {
    expect(routerMembers(["video-analyser>=0.13.0"])).toEqual(["video-analyser"]);
  });

  it("is empty for an app that installs no specialists", () => {
    expect(routerMembers(["assessment-lens[serve]==0.5.2"])).toEqual([]);
  });
});

describe("renderRouterConfig", () => {
  it("emits a cli entry per member", () => {
    const text = renderRouterConfig(["document-analyser", "code-analyser"], true);
    expect(text).toContain("analysers:");
    expect(text).toContain("  document-analyser: { type: cli, command: document-analyser }");
    expect(text).toContain("  code-analyser: { type: cli, command: code-analyser }");
  });

  it("encodes the heuristic cascade gate", () => {
    expect(renderRouterConfig(["image-analyser"], false)).toContain("enabled: false");
    expect(renderRouterConfig(["image-analyser"], true)).toContain("enabled: true");
  });
});
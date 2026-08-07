export interface ConstellationNode {
  key: string;
  tier: "primary" | "secondary";
  x: number;
  y: number;
}

// Hand-placed rather than force-directed/physics-based on purpose — with
// only 6 category-level nodes, fixed coordinates read as intentional
// design instead of a jittery simulation, and they're far cheaper to
// render (no simulation loop, works identically on every device).
export const CONSTELLATION_VIEWBOX = "0 0 500 300";

export const constellationNodes: ConstellationNode[] = [
  { key: "iterationSpeed", tier: "primary", x: 150, y: 80 },
  { key: "projectGrows", tier: "primary", x: 350, y: 80 },
  { key: "frontend", tier: "secondary", x: 70, y: 220 },
  { key: "backend", tier: "secondary", x: 210, y: 250 },
  { key: "cloud", tier: "secondary", x: 330, y: 250 },
  { key: "tooling", tier: "secondary", x: 440, y: 190 },
];

export const constellationEdges: [string, string][] = [
  ["iterationSpeed", "projectGrows"],
  ["iterationSpeed", "frontend"],
  ["iterationSpeed", "backend"],
  ["projectGrows", "backend"],
  ["projectGrows", "cloud"],
  ["projectGrows", "tooling"],
];

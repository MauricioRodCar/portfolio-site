"use client";

import { useState, type KeyboardEvent } from "react";
import { useTranslations } from "next-intl";
import {
  CONSTELLATION_VIEWBOX,
  constellationEdges,
  constellationNodes,
} from "./constellationLayout";
import { primaryGroups, secondaryGroups } from "./data";

function findTools(key: string): readonly string[] {
  const group = [...primaryGroups, ...secondaryGroups].find(
    (g) => g.key === key
  );
  return group?.tools ?? [];
}

export function StackConstellation() {
  const t = useTranslations("stack");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const activeKey = hoveredKey ?? selectedKey;
  const activeNode = constellationNodes.find((n) => n.key === activeKey);
  const label = activeNode
    ? t(`constellationLabels.${activeNode.key}`)
    : null;

  function handleKeyDown(e: KeyboardEvent<SVGGElement>, key: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setSelectedKey(key);
    }
  }

  const nodeByKey = Object.fromEntries(constellationNodes.map((n) => [n.key, n]));

  return (
    <div>
      <svg
        viewBox={CONSTELLATION_VIEWBOX}
        role="img"
        aria-label={t("constellationAriaLabel")}
        className="w-full"
      >
        <g stroke="var(--border)" strokeWidth={1}>
          {constellationEdges.map(([a, b]) => {
            const na = nodeByKey[a];
            const nb = nodeByKey[b];
            const isActiveEdge = activeKey === a || activeKey === b;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                className="transition-colors duration-200"
                stroke={isActiveEdge ? "var(--accent)" : "var(--border)"}
                strokeOpacity={isActiveEdge ? 0.8 : 0.5}
              />
            );
          })}
        </g>

        {constellationNodes.map((node) => {
          const isPrimary = node.tier === "primary";
          const isActive = activeKey === node.key;
          const radius = isPrimary ? 11 : 8;
          const nodeLabel = t(`constellationLabels.${node.key}`);
          const tools = findTools(node.key).join(" · ");

          return (
            <g
              key={node.key}
              tabIndex={0}
              role="button"
              aria-label={`${nodeLabel}: ${tools}`}
              onMouseEnter={() => setHoveredKey(node.key)}
              onMouseLeave={() => setHoveredKey(null)}
              onFocus={() => setHoveredKey(node.key)}
              onBlur={() => setHoveredKey(null)}
              onClick={() => setSelectedKey(node.key)}
              onKeyDown={(e) => handleKeyDown(e, node.key)}
              className="cursor-pointer outline-none"
            >
              {/* Generous invisible hit area — the visible dot is too small
                  a touch target on its own. */}
              <circle cx={node.x} cy={node.y} r={22} fill="transparent" />
              {isPrimary && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={radius + 6}
                  fill="var(--accent)"
                  opacity={0.15}
                  className="animate-pulse"
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={isActive ? radius + 2 : radius}
                fill={isPrimary ? "var(--accent)" : "var(--background)"}
                stroke="var(--accent)"
                strokeWidth={isPrimary ? 0 : 1.5}
                className="transition-all duration-200"
              />
              <text
                x={node.x}
                y={node.y + radius + 16}
                textAnchor="middle"
                className="select-none font-mono text-[10px] uppercase tracking-wide"
                fill={isActive ? "var(--accent)" : "var(--muted)"}
              >
                {nodeLabel}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 min-h-16 rounded-lg border border-border bg-foreground/[0.03] p-4">
        {activeNode && label ? (
          <>
            <p className="font-mono text-xs font-semibold uppercase tracking-wide text-accent">
              {label}
            </p>
            <p className="mt-1 text-sm text-muted">
              {findTools(activeNode.key).join(" · ")}
            </p>
          </>
        ) : (
          <p className="text-sm text-muted">{t("constellationPrompt")}</p>
        )}
      </div>
    </div>
  );
}

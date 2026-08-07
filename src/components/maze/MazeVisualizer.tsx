"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { useTranslations } from "next-intl";
import { runAStar, pointKey, type Point } from "./astar";

const ROWS = 14;
const COLS = 22;
const START_DEFAULT: Point = { row: 6, col: 2 };
const END_DEFAULT: Point = { row: 7, col: 19 };
// Only re-solve once the visitor stops interacting — firing A* on every
// pointermove during a drag would work fine computationally, but it would
// restart the exploration animation dozens of times a second and read as
// flicker rather than motion.
const RESOLVE_DEBOUNCE_MS = 150;
const STEP_MS = 6;

type DragMode = "wall" | "start" | "end" | null;

function sameCell(a: Point, b: Point) {
  return a.row === b.row && a.col === b.col;
}

export function MazeVisualizer() {
  const t = useTranslations("maze");
  const [walls, setWalls] = useState<Set<string>>(() => new Set());
  const [start, setStart] = useState<Point>(START_DEFAULT);
  const [end, setEnd] = useState<Point>(END_DEFAULT);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [path, setPath] = useState<Set<string>>(new Set());
  const [status, setStatus] = useState<"solving" | "solved" | "unreachable">(
    "solving"
  );

  const dragMode = useRef<DragMode>(null);
  const wallDrawValue = useRef(true);
  const stepTimer = useRef<number | null>(null);
  const debounceTimer = useRef<number | null>(null);

  function solve(s: Point, e: Point, w: Set<string>) {
    if (stepTimer.current) {
      window.clearTimeout(stepTimer.current);
      stepTimer.current = null;
    }
    setVisited(new Set());
    setPath(new Set());
    setStatus("solving");

    const { visitedOrder, path: solvedPath } = runAStar(ROWS, COLS, w, s, e);

    let i = 0;
    const step = () => {
      if (i >= visitedOrder.length) {
        if (solvedPath.length > 0) {
          setPath(new Set(solvedPath.map(pointKey)));
          setStatus("solved");
        } else {
          setStatus("unreachable");
        }
        return;
      }
      // Snapshot the cell by value before queuing the update: React (in dev
      // Strict Mode) can invoke a state updater function more than once to
      // check it's pure, and this closure would otherwise re-read the
      // outer, already-incremented `i` on that second call.
      const cellKey = pointKey(visitedOrder[i]);
      setVisited((prev) => {
        const next = new Set(prev);
        next.add(cellKey);
        return next;
      });
      i++;
      stepTimer.current = window.setTimeout(step, STEP_MS);
    };
    step();
  }

  useEffect(() => {
    if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    debounceTimer.current = window.setTimeout(() => {
      solve(start, end, walls);
    }, RESOLVE_DEBOUNCE_MS);

    return () => {
      if (debounceTimer.current) window.clearTimeout(debounceTimer.current);
    };
  }, [walls, start, end]);

  useEffect(() => {
    return () => {
      if (stepTimer.current) window.clearTimeout(stepTimer.current);
    };
  }, []);

  function toggleWall(p: Point, add: boolean) {
    if (sameCell(p, start) || sameCell(p, end)) return;
    setWalls((prev) => {
      const k = pointKey(p);
      if (add === prev.has(k)) return prev;
      const next = new Set(prev);
      if (add) next.add(k);
      else next.delete(k);
      return next;
    });
  }

  function handleCellAt(p: Point, isPointerDown: boolean) {
    if (isPointerDown) {
      if (sameCell(p, start)) {
        dragMode.current = "start";
        return;
      }
      if (sameCell(p, end)) {
        dragMode.current = "end";
        return;
      }
      dragMode.current = "wall";
      wallDrawValue.current = !walls.has(pointKey(p));
      toggleWall(p, wallDrawValue.current);
      return;
    }

    if (dragMode.current === "wall") {
      toggleWall(p, wallDrawValue.current);
    } else if (dragMode.current === "start") {
      if (!walls.has(pointKey(p)) && !sameCell(p, end)) setStart(p);
    } else if (dragMode.current === "end") {
      if (!walls.has(pointKey(p)) && !sameCell(p, start)) setEnd(p);
    }
  }

  // Cell hit-testing happens at the grid container level (via elementFromPoint)
  // rather than per-cell onPointerEnter handlers: touch input gets implicit
  // pointer capture on whichever element received the initial touchstart, so
  // pointerenter never fires on sibling cells during a touch drag. Manual hit
  // -testing on pointermove works identically for mouse and touch.
  function cellFromEvent(e: PointerEvent<HTMLDivElement>): Point | null {
    const target = document.elementFromPoint(e.clientX, e.clientY);
    const cellEl = target?.closest<HTMLElement>("[data-row]");
    if (!cellEl) return null;
    const row = Number(cellEl.dataset.row);
    const col = Number(cellEl.dataset.col);
    if (Number.isNaN(row) || Number.isNaN(col)) return null;
    return { row, col };
  }

  function handleGridPointerDown(e: PointerEvent<HTMLDivElement>) {
    const p = cellFromEvent(e);
    if (!p) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    handleCellAt(p, true);
  }

  function handleGridPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragMode.current) return;
    const p = cellFromEvent(e);
    if (!p) return;
    handleCellAt(p, false);
  }

  function handlePointerUp() {
    dragMode.current = null;
  }

  function handleReset() {
    setWalls(new Set());
    setStart(START_DEFAULT);
    setEnd(END_DEFAULT);
  }

  const cells: Point[] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      cells.push({ row, col });
    }
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-foreground/[0.03] px-4 py-2">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="h-2.5 w-2.5 rounded-full bg-border" />
          <span className="ml-2 font-mono text-xs text-muted">
            {t("filename")}
          </span>
        </div>
        <button
          onClick={handleReset}
          className="rounded font-mono text-xs uppercase tracking-wide text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {t("resetCta")}
        </button>
      </div>

      <div className="p-4 sm:p-6">
        <div
          role="img"
          aria-label={t("gridAriaLabel")}
          className="grid touch-none select-none gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
          onPointerDown={handleGridPointerDown}
          onPointerMove={handleGridPointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {cells.map((p) => {
            const k = pointKey(p);
            const isStart = sameCell(p, start);
            const isEnd = sameCell(p, end);
            const isWall = walls.has(k);
            const isPath = path.has(k);
            const isVisited = visited.has(k);

            let cellClass = "border border-border/60 bg-transparent";
            if (isWall) cellClass = "bg-border";
            else if (isPath) cellClass = "bg-accent";
            else if (isVisited) cellClass = "bg-accent/25";

            return (
              <div
                key={k}
                data-row={p.row}
                data-col={p.col}
                className={`aspect-square w-full cursor-pointer rounded-[2px] transition-colors duration-150 ${cellClass}`}
              >
                {isStart && (
                  <div className="flex h-full w-full items-center justify-center rounded-[2px] bg-foreground font-mono text-[8px] font-bold text-background sm:text-[10px]">
                    A
                  </div>
                )}
                {isEnd && (
                  <div className="flex h-full w-full items-center justify-center rounded-[2px] bg-foreground font-mono text-[8px] font-bold text-background sm:text-[10px]">
                    B
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-accent/25" />
            {t("legendExplored")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-accent" />
            {t("legendPath")}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2.5 w-2.5 rounded-[2px] bg-border" />
            {t("legendWall")}
          </span>
          <span className="ml-auto text-accent">
            {status === "solving" && t("statusSolving")}
            {status === "solved" && t("statusSolved")}
            {status === "unreachable" && t("statusUnreachable")}
          </span>
        </div>
      </div>
    </div>
  );
}

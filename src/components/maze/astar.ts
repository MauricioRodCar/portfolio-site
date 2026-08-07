export interface Point {
  row: number;
  col: number;
}

export interface AStarResult {
  /** Cells in the order A* expanded them — drives the exploration animation. */
  visitedOrder: Point[];
  /** Shortest path from start to end, inclusive. Empty if unreachable. */
  path: Point[];
}

export function pointKey(p: Point): string {
  return `${p.row}-${p.col}`;
}

function heuristic(a: Point, b: Point): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * A* over a grid with unit edge costs and a Manhattan-distance heuristic.
 * The open set is a plain Map scanned linearly rather than a binary heap —
 * grids here run to a few hundred cells, so this stays well under a
 * millisecond; a heap would be premature optimization for this scale.
 */
export function runAStar(
  rows: number,
  cols: number,
  walls: Set<string>,
  start: Point,
  end: Point
): AStarResult {
  const startKey = pointKey(start);
  const endKey = pointKey(end);

  const open = new Map<string, { point: Point; g: number; f: number }>();
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>();
  const closed = new Set<string>();
  const visitedOrder: Point[] = [];

  gScore.set(startKey, 0);
  open.set(startKey, { point: start, g: 0, f: heuristic(start, end) });

  while (open.size > 0) {
    let currentKey = "";
    let current: { point: Point; g: number; f: number } | null = null;
    for (const [k, entry] of open) {
      if (!current || entry.f < current.f) {
        currentKey = k;
        current = entry;
      }
    }
    if (!current) break;
    open.delete(currentKey);

    if (closed.has(currentKey)) continue;
    closed.add(currentKey);
    visitedOrder.push(current.point);

    if (currentKey === endKey) {
      const path: Point[] = [current.point];
      let k = currentKey;
      while (cameFrom.has(k)) {
        k = cameFrom.get(k)!;
        const [row, col] = k.split("-").map(Number);
        path.unshift({ row, col });
      }
      return { visitedOrder, path };
    }

    const { point, g } = current;
    const neighbors: Point[] = [
      { row: point.row - 1, col: point.col },
      { row: point.row + 1, col: point.col },
      { row: point.row, col: point.col - 1 },
      { row: point.row, col: point.col + 1 },
    ];

    for (const n of neighbors) {
      if (n.row < 0 || n.row >= rows || n.col < 0 || n.col >= cols) continue;
      const nk = pointKey(n);
      if (walls.has(nk) || closed.has(nk)) continue;

      const tentativeG = g + 1;
      if (tentativeG < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, currentKey);
        gScore.set(nk, tentativeG);
        open.set(nk, { point: n, g: tentativeG, f: tentativeG + heuristic(n, end) });
      }
    }
  }

  return { visitedOrder, path: [] };
}

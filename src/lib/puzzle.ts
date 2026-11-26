export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
export function shuffledIndices(n: number): number[] {
  const base = Array.from({ length: n }, (_, i) => i);
  if (n < 2) return base;
  let a = shuffle(base);
  while (a.every((v, i) => v === i)) a = shuffle(base);
  return a;
}
export const isSolved = (a: number[]) => a.every((v, i) => v === i);

/** Edge tabs for a jigsaw: h[r][c] is the bottom edge of row r, v[r][c] the right edge of col c. 1 = tab out, -1 = blank. */
export function makeEdges(cols: number, rows: number) {
  const rnd = () => (Math.random() < 0.5 ? 1 : -1);
  const h = Array.from({ length: rows - 1 }, () => Array.from({ length: cols }, rnd));
  const v = Array.from({ length: rows }, () => Array.from({ length: cols - 1 }, rnd));
  return { h, v };
}

/** SVG path of a piece in its own box, origin at the piece's top-left corner (tabs may go negative). */
export function piecePath(c: number, r: number, w: number, hgt: number, e: ReturnType<typeof makeEdges>, cols: number, rows: number) {
  const top = r === 0 ? 0 : -e.h[r - 1]![c]!;
  const bottom = r === rows - 1 ? 0 : e.h[r]![c]!;
  const left = c === 0 ? 0 : -e.v[r]![c - 1]!;
  const right = c === cols - 1 ? 0 : e.v[r]![c]!;
  const edge = (x0: number, y0: number, dx: number, dy: number, len: number, dir: number) => {
    // dx,dy: unit along edge; normal = outward (rotate -90 of along for clockwise path)
    const nx = dy, ny = -dx;
    const p = (a: number, b: number) => `${x0 + dx * a * len + nx * b * len},${y0 + dy * a * len + ny * b * len}`;
    if (!dir) return `L${p(1, 0)}`;
    const d = dir * 0.22;
    return `L${p(0.36, 0)} C${p(0.4, 0)} ${p(0.3, d * 0.6)} ${p(0.38, d)} C${p(0.44, d * 1.3)} ${p(0.56, d * 1.3)} ${p(0.62, d)} C${p(0.7, d * 0.6)} ${p(0.6, 0)} ${p(0.64, 0)} L${p(1, 0)}`;
  };
  return `M0,0 ${edge(0, 0, 1, 0, w, top)} ${edge(w, 0, 0, 1, hgt, right)} ${edge(w, hgt, -1, 0, w, bottom)} ${edge(0, hgt, 0, -1, hgt, left)} Z`;
}

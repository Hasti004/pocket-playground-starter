import { useRef, useState } from "react";
import { isSolved, shuffledIndices } from "@/lib/puzzle";
import { fit, useBox } from "./useBox";

type Props = { img: string; cols: number; rows: number; rotate?: boolean; onMove: (moves: number, solved: boolean) => void };

export function GridSwap({ img, cols, rows, rotate, onMove }: Props) {
  const n = cols * rows;
  const [ref, box] = useBox<HTMLDivElement>();
  const [order, setOrder] = useState(() => shuffledIndices(n));
  const [rot, setRot] = useState(() => Array.from({ length: n }, () => (rotate ? 1 + Math.floor(Math.random() * 3) : 0)));
  const [sel, setSel] = useState<number | null>(null);
  const [drag, setDrag] = useState<{ i: number; dx: number; dy: number } | null>(null);
  const start = useRef<{ x: number; y: number; i: number; moved: boolean } | null>(null);
  const moves = useRef(0);
  const solvedNow = (o: number[], r: number[]) => isSolved(o) && r.every((v) => v % 4 === 0);
  const board = fit(box.w, box.h, 2 / 3);

  const commit = (o: number[], r: number[]) => { setOrder(o); setRot(r); moves.current++; onMove(moves.current, solvedNow(o, r)); };
  const swap = (a: number, b: number) => {
    const o = [...order], r = [...rot];
    [o[a], o[b]] = [o[b]!, o[a]!]; [r[a], r[b]] = [r[b]!, r[a]!];
    commit(o, r);
  };

  const down = (e: React.PointerEvent, i: number) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    start.current = { x: e.clientX, y: e.clientY, i, moved: false };
  };
  const move = (e: React.PointerEvent) => {
    const s = start.current; if (!s) return;
    const dx = e.clientX - s.x, dy = e.clientY - s.y;
    if (!s.moved && Math.hypot(dx, dy) > 8) s.moved = true;
    if (s.moved) setDrag({ i: s.i, dx: cols === 1 ? 0 : dx, dy });
  };
  const up = (e: React.PointerEvent) => {
    const s = start.current; start.current = null; setDrag(null);
    if (!s) return;
    if (s.moved) {
      const el = document.elementsFromPoint(e.clientX, e.clientY).find((x) => (x as HTMLElement).dataset?.idx && Number((x as HTMLElement).dataset.idx) !== s.i) as HTMLElement | undefined;
      if (el) swap(s.i, Number(el.dataset.idx));
      return;
    }
    if (rotate) { const r = [...rot]; r[s.i] = r[s.i]! + 1; commit([...order], r); return; }
    if (sel === null) setSel(s.i);
    else { if (sel !== s.i) swap(sel, s.i); setSel(null); }
  };

  return (
    <div ref={ref} className="no-touch flex h-full w-full items-center justify-center">
      <div className="tray grid gap-[3px]" style={{ width: board.w, height: board.h, gridTemplateColumns: `repeat(${cols},1fr)`, gridTemplateRows: `repeat(${rows},1fr)` }}>
        {order.map((v, i) => {
          const d = drag?.i === i ? drag : null;
          const r = rot[i]! * 90;
          return (
            <div key={i} data-idx={i}
              className={`tile ${sel === i ? "tile-selected" : ""} ${d ? "tile-drag" : ""} ${isSolved(order) && solvedNow(order, rot) ? "tile-done" : ""}`}
              onPointerDown={(e) => down(e, i)} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: `${cols * 100}% ${rows * 100}%`,
                backgroundPosition: `${cols > 1 ? ((v % cols) / (cols - 1)) * 100 : 0}% ${rows > 1 ? (Math.floor(v / cols) / (rows - 1)) * 100 : 0}%`,
                transform: d ? `translate(${d.dx}px,${d.dy}px) scale(1.06) rotate(${r}deg)` : `rotate(${r}deg)`,
              }} />
          );
        })}
      </div>
    </div>
  );
}

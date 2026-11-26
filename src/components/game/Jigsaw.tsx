import { useEffect, useMemo, useRef, useState } from "react";
import { makeEdges, piecePath, shuffle } from "@/lib/puzzle";
import { fit, useBox } from "./useBox";

type P = { id: number; x: number; y: number; placed: boolean; z: number };
const ASPECT = 2 / 3;

export function Jigsaw({ img, cols, rows, onProgress }: { img: string; cols: number; rows: number; onProgress: (placed: number, total: number) => void }) {
  const [ref, box] = useBox<HTMLDivElement>();
  const edges = useMemo(() => makeEdges(cols, rows), [cols, rows]);
  const board = fit(box.w, box.h * 0.66, ASPECT);
  const bx = (box.w - board.w) / 2;
  const pw = board.w / cols, ph = board.h / rows;
  const pad = Math.min(pw, ph) * 0.3;
  const ready = box.w > 0;
  const [pieces, setPieces] = useState<P[] | null>(null);
  const zTop = useRef(1);
  const drag = useRef<{ id: number; ox: number; oy: number } | null>(null);

  // Positions are stored as fractions of the play area so resizing keeps layout.
  useEffect(() => {
    if (pieces || !ready) return;
    const order = shuffle(Array.from({ length: cols * rows }, (_, i) => i));
    const trayTop = board.h + 12;
    const tw = box.w - pw, th = Math.max(box.h - trayTop - ph, 1);
    setPieces(order.map((id, k) => ({ id, placed: false, z: 0, x: (((k * 0.618) % 1) * tw) / box.w, y: (trayTop + Math.random() * th) / box.h })));
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps
  const list = pieces;

  const placedCount = list?.filter((p) => p.placed).length ?? 0;

  const down = (e: React.PointerEvent, p: P) => {
    if (p.placed) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    const r = ref.current!.getBoundingClientRect();
    drag.current = { id: p.id, ox: e.clientX - r.left - p.x * box.w, oy: e.clientY - r.top - p.y * box.h };
    zTop.current++;
    setPieces((ps) => ps!.map((q) => (q.id === p.id ? { ...q, z: zTop.current } : q)));
  };
  const move = (e: React.PointerEvent) => {
    const d = drag.current; if (!d) return;
    const r = ref.current!.getBoundingClientRect();
    const x = (e.clientX - r.left - d.ox) / box.w, y = (e.clientY - r.top - d.oy) / box.h;
    setPieces((ps) => ps!.map((q) => (q.id === d.id ? { ...q, x, y } : q)));
  };
  const up = () => {
    const d = drag.current; if (!d) return; drag.current = null;
    setPieces((ps) => {
      const next = ps!.map((q) => {
        if (q.id !== d.id) return q;
        const tx = (bx + (q.id % cols) * pw) / box.w, ty = (Math.floor(q.id / cols) * ph) / box.h;
        const near = Math.hypot((q.x - tx) * box.w, (q.y - ty) * box.h) < Math.min(pw, ph) * 0.35;
        return near ? { ...q, x: tx, y: ty, placed: true, z: 0 } : q;
      });
      onProgress(next.filter((p) => p.placed).length, next.length);
      return next;
    });
  };

  return (
    <div ref={ref} className="no-touch relative h-full w-full" onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      {ready && (
        <>
          <div className="board-frame absolute" style={{ left: bx, top: 0, width: board.w, height: board.h }}>
            <img src={img} alt="" className="ghost-img" />
          </div>
          {list?.map((p) => {
            const c = p.id % cols, r = Math.floor(p.id / cols);
            const d = piecePath(c, r, pw, ph, edges, cols, rows);
            return (
              <svg key={p.id} className={p.placed ? "piece piece-placed" : "piece"} width={pw + pad * 2} height={ph + pad * 2}
                viewBox={`${-pad} ${-pad} ${pw + pad * 2} ${ph + pad * 2}`}
                style={{ left: p.x * box.w - pad, top: p.y * box.h - pad, zIndex: p.placed ? 1 : 10 + p.z }}
                onPointerDown={(e) => down(e, p)}>
                <defs><clipPath id={`cp${p.id}`}><path d={d} /></clipPath></defs>
                <g clipPath={`url(#cp${p.id})`}>
                  <image href={img} x={-c * pw} y={-r * ph} width={board.w} height={board.h} preserveAspectRatio="xMidYMid slice" />
                </g>
                <path d={d} className="piece-edge" />
              </svg>
            );
          })}
          <span className="sr-only">{placedCount}</span>
        </>
      )}
    </div>
  );
}

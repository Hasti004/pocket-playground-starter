import { useMemo, useRef, useState } from "react";
import { shuffle } from "@/lib/puzzle";
import { fit, useBox } from "./useBox";

type Item = { key: string; src: string; idx: number; real: boolean };

export function Missing({ img, decoy, cols, rows, missing, onProgress }: { img: string; decoy: string; cols: number; rows: number; missing: number; onProgress: (n: number, total: number) => void }) {
  const n = cols * rows;
  const holes = useMemo(() => shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, missing), [n, missing]);
  const tray = useMemo<Item[]>(() => {
    const decoys = shuffle(Array.from({ length: n }, (_, i) => i)).slice(0, Math.max(1, Math.ceil(missing / 2)));
    return shuffle([
      ...holes.map((i) => ({ key: `r${i}`, src: img, idx: i, real: true })),
      ...decoys.map((i) => ({ key: `d${i}`, src: decoy, idx: i, real: false })),
    ]);
  }, [holes, img, decoy, n, missing]);
  const [filled, setFilled] = useState<number[]>([]);
  const [wrong, setWrong] = useState<string | null>(null);
  const [drag, setDrag] = useState<{ key: string; x: number; y: number } | null>(null);
  const start = useRef<{ x: number; y: number } | null>(null);
  const [ref, box] = useBox<HTMLDivElement>();
  const board = fit(box.w, box.h * 0.72, 2 / 3);
  const tw = board.w / cols, th = board.h / rows;

  const bg = (src: string, idx: number) => ({
    backgroundImage: `url(${src})`, backgroundSize: `${cols * 100}% ${rows * 100}%`,
    backgroundPosition: `${((idx % cols) / (cols - 1)) * 100}% ${(Math.floor(idx / cols) / (rows - 1)) * 100}%`,
  });

  const up = (e: React.PointerEvent, it: Item) => {
    start.current = null; setDrag(null);
    const hole = document.elementsFromPoint(e.clientX, e.clientY).find((x) => (x as HTMLElement).dataset?.hole) as HTMLElement | undefined;
    if (!hole) return;
    if (it.real && Number(hole.dataset.hole) === it.idx) {
      const next = [...filled, it.idx]; setFilled(next); onProgress(next.length, holes.length);
    } else { setWrong(it.key); setTimeout(() => setWrong(null), 500); }
  };

  return (
    <div ref={ref} className="no-touch flex h-full w-full flex-col items-center gap-3">
      <div className="tray grid shrink-0 gap-[2px]" style={{ width: board.w, height: board.h, gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {Array.from({ length: n }, (_, i) => holes.includes(i) && !filled.includes(i)
          ? <div key={i} data-hole={i} className="hole">?</div>
          : <div key={i} className={`tile ${filled.includes(i) ? "tile-done" : ""}`} style={bg(img, i)} />)}
      </div>
      <div className="parchment flex min-h-0 flex-1 flex-wrap content-center items-center justify-center gap-2 self-stretch p-2">
        {tray.filter((it) => !(it.real && filled.includes(it.idx))).map((it) => (
          <div key={it.key} className={`tile tray-tile ${wrong === it.key ? "shake" : ""} ${drag?.key === it.key ? "tile-drag" : ""}`}
            style={{ ...bg(it.src, it.idx), width: tw * 0.8, height: th * 0.8, transform: drag?.key === it.key ? `translate(${drag.x}px,${drag.y}px) scale(1.1)` : undefined }}
            onPointerDown={(e) => { (e.target as Element).setPointerCapture(e.pointerId); start.current = { x: e.clientX, y: e.clientY }; }}
            onPointerMove={(e) => start.current && setDrag({ key: it.key, x: e.clientX - start.current.x, y: e.clientY - start.current.y })}
            onPointerUp={(e) => up(e, it)} onPointerCancel={() => { start.current = null; setDrag(null); }} />
        ))}
      </div>
    </div>
  );
}

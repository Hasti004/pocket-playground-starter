import { useEffect, useRef, useState } from "react";
export function useBox<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [box, setBox] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => e && setBox({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, box] as const;
}
/** Fit an aspect (w/h) inside a box. */
export const fit = (bw: number, bh: number, aspect: number) => (bw / bh > aspect ? { w: bh * aspect, h: bh } : { w: bw, h: bw / aspect });

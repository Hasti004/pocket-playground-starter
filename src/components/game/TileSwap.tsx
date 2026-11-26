import { useMemo, useState } from "react";
import { t, type Lang } from "@/lib/i18n";

function shuffled(n: number) {
  const a = Array.from({ length: n }, (_, i) => i);
  do {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j]!, a[i]!];
    }
  } while (a.every((v, i) => v === i));
  return a;
}

export function TileSwap({ img, lang, onBack }: { img: string; lang: Lang; onBack: () => void }) {
  const size = 3;
  const n = size * size;
  const [tiles, setTiles] = useState(() => shuffled(n));
  const [sel, setSel] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const won = useMemo(() => tiles.every((v, i) => v === i), [tiles]);

  const tap = (i: number) => {
    if (won) return;
    if (sel === null) return setSel(i);
    if (sel !== i) {
      const next = [...tiles];
      [next[sel], next[i]] = [next[i]!, next[sel]!];
      setTiles(next);
      setMoves((m) => m + 1);
    }
    setSel(null);
  };
  const reset = () => { setTiles(shuffled(n)); setMoves(0); setSel(null); };

  return (
    <div className="flex h-full flex-col gap-4 p-5">
      <header className="flex items-center justify-between">
        <button className="btn-wood" onClick={onBack}>← {t.back[lang]}</button>
        <div className="signboard text-lg">{lang === "gu" ? "ટાઇલ અદલાબદલી" : "Tile Swap"}</div>
      </header>
      <div className="parchment flex justify-between px-5 py-3 text-lg font-bold text-earth">
        <span>{t.moves[lang]}: {moves}</span>
        <span className="text-sm opacity-80">{t.tapTwo[lang]}</span>
      </div>
      <div className="tray relative mx-auto aspect-[2/3] w-full max-w-[min(100%,60vh)]">
        <div className="grid h-full w-full gap-1" style={{ gridTemplateColumns: `repeat(${size},1fr)` }}>
          {tiles.map((v, i) => (
            <button
              key={i}
              onClick={() => tap(i)}
              aria-label={`piece ${i + 1}`}
              className={`tile ${sel === i ? "tile-selected" : ""}`}
              style={{
                backgroundImage: `url(${img})`,
                backgroundSize: `${size * 100}% ${size * 100}%`,
                backgroundPosition: `${((v % size) / (size - 1)) * 100}% ${(Math.floor(v / size) / (size - 1)) * 100}%`,
              }}
            />
          ))}
        </div>
        {peek && <img src={img} alt="" className="absolute inset-0 h-full w-full rounded-xl object-cover" />}
        {won && (
          <div className="celebrate absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-xl">
            <div className="text-6xl">🦁</div>
            <p className="font-display text-3xl text-ivory">{t.won[lang]}</p>
            <button className="btn-gold" onClick={reset}>{t.playAgain[lang]}</button>
          </div>
        )}
      </div>
      <footer className="mt-auto grid grid-cols-2 gap-3">
        <button className="btn-leaf" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)}>👁 {t.hint[lang]}</button>
        <button className="btn-terra" onClick={reset}>🔀 {t.shuffle[lang]}</button>
      </footer>
    </div>
  );
}

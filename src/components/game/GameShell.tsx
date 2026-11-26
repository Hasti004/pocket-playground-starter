import { useEffect, useState, type ReactNode } from "react";
import { t, type Lang, type Game } from "@/lib/i18n";
import type { Scene } from "@/lib/scenes";

type Props = {
  game: Game; scene: Scene; lang: Lang; moves?: number; progress?: string; done: boolean;
  onBack: () => void; onRestart: () => void; onNext: () => void; children: ReactNode;
};

export function GameShell({ game, scene, lang, moves, progress, done, onBack, onRestart, onNext, children }: Props) {
  const [secs, setSecs] = useState(0);
  const [peek, setPeek] = useState(false);
  useEffect(() => { setSecs(0); }, [scene.id, onRestart]);
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [done]);
  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="paper screen-in flex h-full flex-col">
      <header className="flex items-center gap-3 px-[4cqw] pt-[4cqw]">
        <button className="btn-wood" onClick={onBack} aria-label={t.back[lang]}>←</button>
        <div className="signboard flex-1 truncate text-center">{game.icon} {game.name[lang]}</div>
      </header>
      <div className="stat-bar mx-[4cqw] mt-3">
        <span>⏱ {mm}</span>
        {moves !== undefined && <span>👣 {t.moves[lang]} {moves}</span>}
        {progress && <span>🧩 {progress}</span>}
      </div>
      <div className="relative min-h-0 flex-1 px-[4cqw] py-3">
        {children}
        {peek && <img src={scene.img} alt="" className="peek-img" />}
      </div>
      <footer className="grid grid-cols-2 gap-3 px-[4cqw] pb-[4cqw]">
        <button className="btn-leaf" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} onPointerCancel={() => setPeek(false)}>
          👁 {t.hint[lang]} <span className="text-xs opacity-80">({t.hold[lang]})</span>
        </button>
        <button className="btn-terra" onClick={onRestart}>↻ {t.restart[lang]}</button>
      </footer>
      {done && (
        <div className="celebrate">
          {Array.from({ length: 18 }, (_, i) => (
            <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${(i % 6) * 0.25}s` }}>{["🍃", "⭐", "🌼", "🦋"][i % 4]}</span>
          ))}
          <div className="celebrate-card">
            <img src={scene.img} alt={scene[lang]} className="h-[28cqh] w-full rounded-2xl object-cover" />
            <p className="font-display text-3xl text-forest">🦁 {t.won[lang]}</p>
            <p className="text-earth">⏱ {mm}{moves !== undefined ? ` · 👣 ${moves}` : ""}</p>
            <div className="fact"><b>{t.didYouKnow[lang]}</b><br />{lang === "gu" ? scene.factGu : scene.factEn}</div>
            <div className="grid w-full grid-cols-2 gap-3">
              <button className="btn-leaf" onClick={onRestart}>↻ {t.playAgain[lang]}</button>
              <button className="btn-gold" onClick={onNext}>{t.next[lang]} →</button>
            </div>
            <button className="text-earth underline" onClick={onBack}>{t.menu[lang]}</button>
          </div>
        </div>
      )}
    </div>
  );
}

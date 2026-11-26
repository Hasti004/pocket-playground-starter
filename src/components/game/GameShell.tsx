import { useEffect, useState, type ReactNode } from "react";
import { ArrowLeft, Clock3, Eye, Footprints, RotateCcw, Settings2, SlidersHorizontal, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { t, type Lang, type Game } from "@/lib/i18n";
import type { Scene } from "@/lib/scenes";
import { VictoryModal } from "./VictoryModal";

type Props = {
  game: Game; scene: Scene; lang: Lang; moves?: number; progress?: string; done: boolean; muted: boolean; round: number;
  onBack: () => void; onRestart: () => void; onNext: () => void; onSwap: () => void; onSettings: () => void; children: ReactNode;
};

export function GameShell({ game, scene, lang, moves, progress, done, muted, round, onBack, onRestart, onNext, onSwap, onSettings, children }: Props) {
  const [secs, setSecs] = useState(0);
  const [peek, setPeek] = useState(false);
  useEffect(() => { setSecs(0); setPeek(false); }, [scene.id, round]);
  useEffect(() => {
    if (done) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [done, round]);
  const mm = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  const swapLabel = lang === "gu" ? "ચિત્ર અને સ્તર" : "Picture & level";
  return <div className="game-screen screen-in">
    <header className="screen-header">
      <Button variant="glass" size="kiosk" className="icon-control" onClick={onBack} aria-label={t.back[lang]} title={t.back[lang]}><ArrowLeft /></Button>
      <div className="game-heading"><span>{game.name[lang]}</span><small>{scene[lang]}</small></div>
      <Button variant="glass" size="kiosk" className="icon-control" onClick={onSettings} aria-label={lang === "gu" ? "પસંદગી" : "Settings"} title="Settings"><Settings2 /></Button>
    </header>
    <div className="game-stats"><span><Clock3 />{mm}</span>{moves !== undefined && <span><Footprints />{moves} <small>{t.moves[lang]}</small></span>}{progress && <span><Puzzle />{progress}</span>}</div>
    <div className="play-area">{children}{peek && <img src={scene.img} alt={scene[lang]} className="peek-img" />}</div>
    <footer className="dock-wrap"><div className="game-dock">
      <Button variant="quiet" size="kiosk" className="dock-command" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} onPointerCancel={() => setPeek(false)} onKeyDown={(event) => { if (event.key === " " || event.key === "Enter") setPeek(true); }} onKeyUp={() => setPeek(false)} onBlur={() => setPeek(false)} title={t.hold[lang]}><Eye /><span>{t.hint[lang]}</span></Button>
      <Button variant="quiet" size="kiosk" className="dock-command" onClick={onSwap} title={swapLabel}><SlidersHorizontal /><span>{lang === "gu" ? "બદલો" : "Change"}</span></Button>
      <Button variant="quiet" size="kiosk" className="dock-command" onClick={onRestart} title={t.restart[lang]}><RotateCcw /><span>{t.restart[lang]}</span></Button>
    </div></footer>
    <VictoryModal done={done} scene={scene} lang={lang} time={mm} muted={muted} onBack={onBack} onRestart={onRestart} onNext={onNext} {...(moves !== undefined ? { moves } : {})} />
  </div>;
}

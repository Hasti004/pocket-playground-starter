import { useEffect } from "react";
import { ArrowRight, RotateCcw, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KioskModal } from "./KioskModal";
import { playFeedback } from "@/lib/audio";
import { t, type Lang } from "@/lib/i18n";
import type { Scene } from "@/lib/scenes";

export function VictoryModal({ done, scene, lang, time, moves, muted, onBack, onRestart, onNext }: {
  done: boolean; scene: Scene; lang: Lang; time: string; moves?: number; muted: boolean;
  onBack: () => void; onRestart: () => void; onNext: () => void;
}) {
  useEffect(() => { if (done) playFeedback(muted, "win"); }, [done, muted]);
  return <KioskModal open={done} onOpenChange={(open) => { if (!open) onBack(); }} title={lang === "gu" ? "સાહસ પૂર્ણ!" : "Adventure complete"} closeLabel={t.menu[lang]} showcase>
    <div className="ribbons" aria-hidden="true">{Array.from({ length: 16 }, (_, i) => <i key={i} style={{ left: `${(i * 31) % 100}%`, animationDelay: `${(i % 5) * .18}s` }} />)}</div>
    <img className="victory-image" src={scene.img} alt={scene[lang]} />
    <div className="victory-body">
      <div className="victory-stars" aria-hidden="true"><Star /><Star /><Star /></div>
      <h2>{t.won[lang]}</h2>
      <p className="victory-stats">{time}{moves !== undefined ? ` · ${moves} ${t.moves[lang]}` : ""}</p>
      <div className="wildlife-fact"><span><Sparkles />{t.didYouKnow[lang]}</span><p>{lang === "gu" ? scene.factGu : scene.factEn}</p></div>
      <Button variant="gold" size="kiosk" className="primary-command" onClick={onNext}>{t.next[lang]}<ArrowRight /></Button>
      <Button variant="quiet" size="kiosk" onClick={onRestart}><RotateCcw />{t.playAgain[lang]}</Button>
    </div>
  </KioskModal>;
}
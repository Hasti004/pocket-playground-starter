import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Settings2, TreePine, Puzzle, Sparkles, LockKeyhole, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { games, levels, t, type Game, type Lang } from "@/lib/i18n";
import { scenes } from "@/lib/scenes";
import { idlePhase } from "@/lib/idle";
import { playFeedback } from "@/lib/audio";
import { piecePath } from "@/lib/puzzle";
import { GameShell } from "@/components/game/GameShell";
import { Jigsaw } from "@/components/game/Jigsaw";
import { GridSwap } from "@/components/game/GridSwap";
import { Missing } from "@/components/game/Missing";
import { KioskModal } from "@/components/game/KioskModal";
import { LanguagePicker, QuickSettings } from "@/components/game/QuickSettings";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "ગીરની પઝલ | Gir Puzzle — Gujarat Tourism" },
    { name: "description", content: "Explore Gir's wildlife through bilingual picture puzzles, a cinematic touchscreen experience for families." },
    { property: "og:title", content: "Gir Puzzle — Explore the wild" },
    { property: "og:description", content: "A playful journey into Gir Forest. Wildlife puzzles in Gujarati and English." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: App,
});

type Screen = { s: "welcome" } | { s: "hub" } | { s: "play"; game: Game; scene: number; level: number };
const readyGames = games.filter((game) => game.kind);
const upcomingGames = games.filter((game) => !game.kind);

function App() {
  const [screen, setScreen] = useState<Screen>({ s: "welcome" });
  const [lang, setLang] = useState<Lang>("gu");
  const [muted, setMuted] = useState(false);
  const [settings, setSettings] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const activity = useRef(0);
  const keepPlaying = useCallback(() => { activity.current = Date.now(); setRemaining(null); }, []);
  useEffect(() => {
    activity.current = Date.now();
    const update = () => {
      const phase = idlePhase(Date.now() - activity.current);
      if (phase.reset) { setScreen({ s: "welcome" }); setSettings(false); activity.current = Date.now(); setRemaining(null); }
      else setRemaining(phase.remaining);
    };
    const timer = setInterval(update, 1000);
    window.addEventListener("pointerdown", keepPlaying);
    window.addEventListener("pointermove", keepPlaying);
    window.addEventListener("keydown", keepPlaying);
    return () => { clearInterval(timer); window.removeEventListener("pointerdown", keepPlaying); window.removeEventListener("pointermove", keepPlaying); window.removeEventListener("keydown", keepPlaying); };
  }, [keepPlaying]);
  const lion = scenes[0];
  if (!lion) return null;
  return <div className="kiosk-stage">
    <main id="kiosk-frame" className="kiosk-frame" lang={lang} onClickCapture={() => playFeedback(muted)}>
      <div className="app-bg"><img src={lion.img} alt="" /></div>
      {screen.s === "welcome" && <Welcome lang={lang} setLang={setLang} muted={muted} setMuted={setMuted} onSettings={() => setSettings(true)} onStart={() => setScreen({ s: "hub" })} />}
      {screen.s === "hub" && <Hub lang={lang} onSettings={() => setSettings(true)} onBack={() => setScreen({ s: "welcome" })} onPick={(game) => setScreen({ s: "play", game, scene: 0, level: 0 })} />}
      {screen.s === "play" && <Play key={`${screen.game.id}-${screen.scene}-${screen.level}`} lang={lang} muted={muted} {...screen} onSettings={() => setSettings(true)} onBack={() => setScreen({ s: "hub" })} onNext={() => setScreen({ ...screen, scene: (screen.scene + 1) % scenes.length })} onChange={(scene, level) => setScreen({ ...screen, scene, level })} />}
      <QuickSettings open={settings} onOpenChange={setSettings} lang={lang} setLang={setLang} muted={muted} setMuted={setMuted} onHome={() => setScreen({ s: "welcome" })} />
      {remaining !== null && screen.s !== "welcome" && <div className="idle-banner" role="alert"><span>{lang === "gu" ? `${remaining} સેકન્ડમાં શરૂઆત પર…` : `Returning to welcome in ${remaining}s`}</span><Button variant="gold" size="kiosk" onClick={keepPlaying}>{lang === "gu" ? "રમતા રહો" : "Keep playing"}</Button></div>}
    </main>
  </div>;
}

function Welcome({ lang, setLang, muted, setMuted, onSettings, onStart }: { lang: Lang; setLang: (lang: Lang) => void; muted: boolean; setMuted: (muted: boolean) => void; onSettings: () => void; onStart: () => void }) {
  const lion = scenes[0];
  if (!lion) return null;
  const teaserEdges: Parameters<typeof piecePath>[4] = { h: [[1, -1, 1], [-1, 1, -1]], v: [[1, -1], [-1, 1], [1, -1]] };
  return <div className="welcome-screen screen-in">
    <header className="welcome-header"><div className="tourism-mark"><TreePine /><span>GUJARAT<br /><b>TOURISM</b></span></div><div className="header-actions">
      <Button variant="glass" size="kiosk" className="icon-control" onClick={() => setMuted(!muted)} aria-label={lang === "gu" ? (muted ? "અવાજ ચાલુ કરો" : "અવાજ બંધ કરો") : (muted ? "Unmute sounds" : "Mute sounds")} title={lang === "gu" ? "અવાજ" : "Sounds"}>{muted ? <VolumeX /> : <Volume2 />}</Button>
      <Button variant="glass" size="kiosk" className="icon-control" onClick={onSettings} aria-label={lang === "gu" ? "પસંદગી" : "Settings"} title="Settings"><Settings2 /></Button>
    </div></header>
    <div className="teaser-scene" aria-hidden="true">
      <img className="teaser-landscape" src={lion.img} alt="" />
      <div className="teaser-puzzle">{Array.from({ length: 9 }, (_, i) => {
        const c = i % 3, r = Math.floor(i / 3);
        const path = piecePath(c, r, 100, 100, teaserEdges, 3, 3);
        return <svg key={i} className={`teaser-piece teaser-piece-${i}`} viewBox="-30 -30 160 160" style={{ left: `${c * 100 / 3 - 10}%`, top: `${r * 100 / 3 - 10}%` }}>
          <defs><clipPath id={`teaser-clip-${i}`}><path d={path} /></clipPath></defs>
          <g clipPath={`url(#teaser-clip-${i})`}><image href={lion.img} x={-c * 100} y={-r * 100} width="300" height="300" preserveAspectRatio="xMidYMid slice" /></g>
          <path d={path} className="piece-edge" />
        </svg>;
      })}</div>
      <div className="teaser-caption"><span className="live-dot" />{lang === "gu" ? "ગીરમાં એક નવું સાહસ" : "A little adventure in Gir"}<Sparkles /></div>
    </div>
    <section className="welcome-content">
      <div className="location-label"><span />SASAN GIR, INDIA<span /></div>
      <h1>{t.title.gu}</h1><h2>Gir Puzzle<span className="title-dot">.</span></h2>
      <p>{lang === "gu" ? "થોડું રમો. ઘણું શોધો." : "A little play. A wild discovery."}</p>
      <LanguagePicker lang={lang} setLang={setLang} />
      <Button variant="gold" size="kiosk" className="primary-command welcome-start" onClick={onStart}><Puzzle />{lang === "gu" ? "સાહસ શરૂ કરો" : "Let’s explore"}<ArrowRight /></Button>
      <div className="welcome-footnote"><TreePine /><span>{lang === "gu" ? "ગીરનું વન્યજીવન · એક ચિત્ર, એક સાહસ" : "Gir wildlife · One picture, one adventure"}</span></div>
    </section>
  </div>;
}

function Hub({ lang, onBack, onSettings, onPick }: { lang: Lang; onBack: () => void; onSettings: () => void; onPick: (game: Game) => void }) {
  const [tab, setTab] = useState<"ready" | "upcoming">("ready");
  const [featured, setFeatured] = useState(0);
  const shelf = useRef<HTMLDivElement>(null);
  const game = readyGames[featured];
  const scene = scenes[featured % scenes.length];
  if (!game || !scene) return null;
  const gu = lang === "gu";
  return <div className="hub-screen screen-in">
    <header className="screen-header"><Button variant="glass" size="kiosk" className="icon-control" onClick={onBack} aria-label={t.back[lang]} title={t.back[lang]}><ArrowLeft /></Button><div className="hub-brand">Gir Puzzle<span>EXPLORE & PLAY</span></div><Button variant="glass" size="kiosk" className="icon-control" onClick={onSettings} aria-label={gu ? "પસંદગી" : "Settings"} title="Settings"><Settings2 /></Button></header>
    <div className="hub-scroll">
      <div className="hub-intro"><span className="eyebrow">{gu ? "તમારું આગલું સાહસ" : "YOUR NEXT ADVENTURE"}</span><h1>{gu ? "જંગલની શોધમાં." : "Into the wild."}</h1></div>
      <div className="hub-tabs" role="tablist" aria-label={gu ? "રમતો" : "Games"}><Button variant="quiet" size="kiosk" role="tab" aria-selected={tab === "ready"} aria-controls="ready-panel" id="ready-tab" onClick={() => setTab("ready")}>{gu ? "રમવા માટે તૈયાર" : "Ready to play"}<span>05</span></Button><Button variant="quiet" size="kiosk" role="tab" aria-selected={tab === "upcoming"} aria-controls="upcoming-panel" id="upcoming-tab" onClick={() => setTab("upcoming")}>{gu ? "ટૂંક સમયમાં" : "Coming next"}<span>09</span></Button></div>
      {tab === "ready" ? <div id="ready-panel" role="tabpanel" aria-labelledby="ready-tab">
        <section className="featured-game">
          <img key={scene.id} src={scene.img} alt={scene[lang]} />
          <div className="featured-veil" />
          <div className="featured-top"><span className="featured-badge"><Puzzle />{gu ? "ચિત્ર સાહસ" : "PICTURE ADVENTURES"}</span><span className="featured-number">0{featured + 1} / 05</span></div>
          <div className="featured-copy"><h2>{game.name[lang]}</h2><p>{game.desc[lang]}</p><Button variant="gold" size="kiosk" onClick={() => onPick(game)}>{gu ? "હવે રમો" : "Play now"}<ArrowRight /></Button></div>
          <div className="featured-arrows"><Button variant="glass" size="kiosk" className="icon-control" aria-label="Previous featured game" title="Previous game" onClick={() => setFeatured((featured + readyGames.length - 1) % readyGames.length)}><ChevronLeft /></Button><Button variant="glass" size="kiosk" className="icon-control" aria-label="Next featured game" title="Next game" onClick={() => setFeatured((featured + 1) % readyGames.length)}><ChevronRight /></Button></div>
        </section>
        <div className="shelf-heading"><h2>{gu ? "વધુ શોધો" : "More to discover"}</h2><div><Button variant="quiet" size="kiosk" className="icon-control" aria-label="Scroll games left" title="Previous games" onClick={() => shelf.current?.scrollBy({ left: -165, behavior: "smooth" })}><ChevronLeft /></Button><Button variant="quiet" size="kiosk" className="icon-control" aria-label="Scroll games right" title="More games" onClick={() => shelf.current?.scrollBy({ left: 165, behavior: "smooth" })}><ChevronRight /></Button></div></div>
        <div ref={shelf} className="game-shelf">{readyGames.map((g, i) => <Button key={g.id} variant="quiet" size="kiosk" className="shelf-game" onClick={() => onPick(g)}><div className="shelf-art"><img src={scenes[(i + 1) % scenes.length]?.img} alt="" /><span>0{g.id}</span><ArrowRight /></div><span className="shelf-name">{g.name[lang]}</span><span className="shelf-description">{g.desc[lang]}</span></Button>)}</div>
      </div> : <div id="upcoming-panel" className="upcoming-grid" role="tabpanel" aria-labelledby="upcoming-tab">{upcomingGames.map((g) => <div className="upcoming-game" key={g.id}><div><span aria-hidden="true">{g.icon}</span><LockKeyhole /></div><small>NO. {String(g.id).padStart(2, "0")}</small><h2>{g.name[lang]}</h2><p>{g.desc[lang]}</p><span className="upcoming-label">{t.soon[lang]}</span></div>)}</div>}
      <div className="hub-footer"><TreePine />GUJARAT TOURISM <span>·</span> SASAN GIR</div>
    </div>
  </div>;
}

function PictureDrawer({ open, setOpen, lang, game, scene, level, onChange }: { open: boolean; setOpen: (open: boolean) => void; lang: Lang; game: Game; scene: number; level: number; onChange: (scene: number, level: number) => void }) {
  const [pickedScene, setPickedScene] = useState(scene);
  const [pickedLevel, setPickedLevel] = useState(level);
  useEffect(() => { if (open) { setPickedScene(scene); setPickedLevel(level); } }, [open, scene, level]);
  if (!game.kind) return null;
  return <KioskModal open={open} onOpenChange={setOpen} title={lang === "gu" ? "એક નવું સાહસ" : "A fresh adventure"} closeLabel={lang === "gu" ? "બંધ કરો" : "Close picture drawer"}>
    <h3 className="drawer-label">{t.picture[lang]}</h3><div className="picture-options">{scenes.map((s, i) => <Button key={s.id} variant="quiet" size="kiosk" className="picture-option" aria-pressed={pickedScene === i} onClick={() => setPickedScene(i)}><img src={s.img} alt="" /><span>{s[lang]}</span></Button>)}</div>
    <h3 className="drawer-label">{t.level[lang]}{game.kind === "jigsaw" ? ` · ${t.pieces[lang]}` : ""}</h3><div className="level-options">{levels[game.kind].map((l, i) => <Button key={i} variant="glass" size="kiosk" aria-pressed={pickedLevel === i} onClick={() => setPickedLevel(i)}>{l.label[lang]}</Button>)}</div>
    <Button variant="gold" size="kiosk" className="primary-command" onClick={() => { setOpen(false); onChange(pickedScene, pickedLevel); }}>{lang === "gu" ? "રમો!" : "Let’s play"}<ArrowRight /></Button>
  </KioskModal>;
}

function Play({ lang, muted, game, scene, level, onBack, onNext, onSettings, onChange }: { lang: Lang; muted: boolean; game: Game; scene: number; level: number; onBack: () => void; onNext: () => void; onSettings: () => void; onChange: (scene: number, level: number) => void }) {
  const [round, setRound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [prog, setProg] = useState<[number, number] | null>(null);
  const [done, setDone] = useState(false);
  const [solved, setSolved] = useState(false);
  const [swap, setSwap] = useState(false);
  const restart = useCallback(() => { setRound((r) => r + 1); setMoves(0); setProg(null); setDone(false); setSolved(false); }, []);
  useEffect(() => { if (!solved) return; const timer = setTimeout(() => setDone(true), 450); return () => clearTimeout(timer); }, [solved]);
  const sc = scenes[scene];
  const k = game.kind;
  const lv = k ? levels[k][level] : undefined;
  if (!sc || !k || !lv) return null;
  const total = k === "missing" ? lv.extra ?? 2 : lv.cols * lv.rows;
  const decoy = scenes[(scene + 1) % scenes.length] ?? sc;
  const onProgress = (n: number, total: number) => { setProg([n, total]); setSolved(n === total); };
  const onMove = (m: number, complete: boolean) => { setMoves(m); setSolved(complete); };
  return <><GameShell game={game} scene={sc} lang={lang} done={done} muted={muted} round={round} onBack={onBack} onRestart={restart} onNext={onNext} onSwap={() => setSwap(true)} onSettings={onSettings} {...(k === "jigsaw" || k === "missing" ? { progress: `${prog?.[0] ?? 0}/${total}` } : { moves })}>
    <div key={round} className="h-full">
      {k === "jigsaw" && <Jigsaw img={sc.img} cols={lv.cols} rows={lv.rows} onProgress={onProgress} />}
      {(k === "swap" || k === "strip") && <GridSwap img={sc.img} cols={lv.cols} rows={lv.rows} onMove={onMove} />}
      {k === "rotate" && <GridSwap img={sc.img} cols={lv.cols} rows={lv.rows} rotate onMove={onMove} />}
      {k === "missing" && <Missing img={sc.img} decoy={decoy.img} cols={lv.cols} rows={lv.rows} missing={total} onProgress={onProgress} />}
    </div>
  </GameShell><PictureDrawer open={swap} setOpen={setSwap} lang={lang} game={game} scene={scene} level={level} onChange={(newScene, newLevel) => { if (newScene === scene && newLevel === level) restart(); else onChange(newScene, newLevel); }} /></>;
}

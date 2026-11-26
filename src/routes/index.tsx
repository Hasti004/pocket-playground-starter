import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { games, levels, t, type Game, type Lang } from "@/lib/i18n";
import { scenes } from "@/lib/scenes";
import { GameShell } from "@/components/game/GameShell";
import { Jigsaw } from "@/components/game/Jigsaw";
import { GridSwap } from "@/components/game/GridSwap";
import { Missing } from "@/components/game/Missing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ગીરની પઝલ | Gir Puzzle — Gujarat Tourism" },
      { name: "description", content: "Interactive wildlife puzzles from Gir Forest for kids and families." },
      { property: "og:title", content: "Gir Puzzle — Gujarat Tourism" },
      { property: "og:description", content: "Interactive wildlife puzzles from Gir Forest." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: App,
});

type Screen = { s: "welcome" } | { s: "hub" } | { s: "setup"; game: Game } | { s: "play"; game: Game; scene: number; level: number };
const IDLE_MS = 120_000;

function App() {
  const [screen, setScreen] = useState<Screen>({ s: "welcome" });
  const [lang, setLang] = useState<Lang>("gu");

  useEffect(() => {
    let id = setTimeout(() => setScreen({ s: "welcome" }), IDLE_MS);
    const reset = () => { clearTimeout(id); id = setTimeout(() => setScreen({ s: "welcome" }), IDLE_MS); };
    const noMenu = (e: Event) => e.preventDefault();
    window.addEventListener("pointerdown", reset);
    window.addEventListener("contextmenu", noMenu);
    return () => { clearTimeout(id); window.removeEventListener("pointerdown", reset); window.removeEventListener("contextmenu", noMenu); };
  }, []);

  return (
    <div className="kiosk-stage">
      <main className="kiosk-frame" lang={lang}>
        <div className="app-bg" style={{ backgroundImage: `url(${scenes[0]!.img})` }} />
        {screen.s === "welcome" && <Welcome lang={lang} setLang={setLang} onStart={() => setScreen({ s: "hub" })} />}
        {screen.s === "hub" && <Hub lang={lang} setLang={setLang} onBack={() => setScreen({ s: "welcome" })} onPick={(game) => setScreen({ s: "setup", game })} />}
        {screen.s === "setup" && <Setup lang={lang} game={screen.game} onBack={() => setScreen({ s: "hub" })} onPlay={(scene, level) => setScreen({ s: "play", game: screen.game, scene, level })} />}
        {screen.s === "play" && (
          <Play key={`${screen.scene}-${screen.level}`} lang={lang} {...screen}
            onBack={() => setScreen({ s: "setup", game: screen.game })}
            onNext={() => setScreen({ ...screen, scene: (screen.scene + 1) % scenes.length })} />
        )}
      </main>
    </div>
  );
}

function LangToggle({ lang, setLang, light }: { lang: Lang; setLang: (l: Lang) => void; light?: boolean }) {
  return (
    <div className={light ? "flex gap-2" : "lang-switch"}>
      {(["gu", "en"] as const).map((l) => (
        <button key={l} onClick={() => setLang(l)} className={`${light ? "chip" : "chip-dark"} ${lang === l ? "chip-on" : ""}`}>
          {l === "gu" ? "ગુજરાતી" : "English"}
        </button>
      ))}
    </div>
  );
}

function Welcome({ lang, setLang, onStart }: { lang: Lang; setLang: (l: Lang) => void; onStart: () => void }) {
  return (
    <div className="relative flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && onStart()}>
      <img src={scenes[0]!.img} alt="Asiatic lion in Gir Forest" className="ken-burns pointer-events-none absolute inset-0 h-full w-full object-cover" />
      <div className="welcome-veil pointer-events-none absolute inset-0" />
      {[["22%", "8%", 0], ["34%", "72%", -4], ["48%", "30%", -7]].map(([top, left, d], i) => (
        <span key={i} className="butterfly pointer-events-none" style={{ top: top as string, left: left as string, animationDelay: `${d}s` }}>🦋</span>
      ))}
      {[0, 1, 2, 3, 4].map((i) => <span key={i} className="leaf pointer-events-none" style={{ left: `${10 + i * 20}%`, animationDelay: `${i * 2.3}s` }}>🍂</span>)}
      <div className="rise relative z-10 flex flex-col items-center pt-[10cqh] text-center">
        <p className="glass rounded-full px-4 py-1.5 text-[2.6cqw] font-bold tracking-[0.25em] text-ivory uppercase">Gujarat Tourism · Sasan Gir</p>
        <h1 className="font-gu mt-[2cqh] text-[18cqw] font-bold leading-none tracking-tight text-ivory drop-title">{t.title.gu}</h1>
        <h2 className="font-display text-[7cqw] font-bold tracking-tight text-gold drop-title">Gir Puzzle</h2>
        <p className="mt-[1.5cqh] max-w-[80%] text-[4.5cqw] text-ivory drop-title">{t.tagline[lang]}</p>
      </div>
      <div className="rise relative z-10 mt-auto flex flex-col items-center gap-[3cqh] pb-[9cqh]" style={{ animationDelay: ".3s" }}>
        <LangToggle lang={lang} setLang={setLang} light />
        <button className="btn-gold btn-xl pulse" onClick={onStart}>🐾 {t.start[lang]}</button>
      </div>
    </div>
  );
}

function Hub({ lang, setLang, onBack, onPick }: { lang: Lang; setLang: (l: Lang) => void; onBack: () => void; onPick: (g: Game) => void }) {
  return (
    <div className="paper screen-in flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 p-[4cqw]">
        <button className="btn-wood" onClick={onBack} aria-label={t.back[lang]}>←</button>
        <div className="signboard">{t.chooseGame[lang]}</div>
        <LangToggle lang={lang} setLang={setLang} />
      </header>
      <div className="scroll-y flex-1 px-[4cqw] pb-8">
        {[0, 1, 2].map((c) => (
          <section key={c} className="mb-6">
            <h3 className="chapter">{t.cats[lang][c]}</h3>
            <div className="grid grid-cols-2 gap-[3cqw]">
              {games.filter((g) => g.cat === c).map((g, i) => (
                <button key={g.id} onClick={g.kind ? () => onPick(g) : undefined} className={g.kind ? "game-card" : "game-card game-card-locked"} style={{ animationDelay: `${i * 60}ms` }}>
                  {g.kind ? (
                    <div className="card-art" style={{ backgroundImage: `url(${scenes[g.id % scenes.length]!.img})` }}><span>{g.icon}</span></div>
                  ) : (
                    <div className="card-art card-art-empty"><span>{g.icon}</span></div>
                  )}
                  <span className="text-[2.4cqw] font-bold tracking-[0.2em] text-gold">NO. {String(g.id).padStart(2, "0")}</span>
                  <span className="font-display text-[4.2cqw] font-bold leading-tight tracking-tight text-ivory">{g.name[lang]}</span>
                  <span className="text-[3cqw] leading-snug text-ivory/70">{g.kind ? g.desc[lang] : t.soon[lang]}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

function Setup({ lang, game, onBack, onPlay }: { lang: Lang; game: Game; onBack: () => void; onPlay: (scene: number, level: number) => void }) {
  const [scene, setScene] = useState(0);
  const [level, setLevel] = useState(game.kind === "jigsaw" ? 2 : 0);
  const lvls = levels[game.kind!];
  return (
    <div className="paper screen-in flex h-full flex-col gap-[2.5cqh] p-[4cqw]">
      <header className="flex items-center gap-3">
        <button className="btn-wood" onClick={onBack} aria-label={t.back[lang]}>←</button>
        <div className="signboard flex-1 text-center">{game.icon} {game.name[lang]}</div>
      </header>
      <div className="parchment px-5 py-4 text-center text-[3.8cqw] leading-relaxed text-ivory/90">{game.how[lang]}</div>
      <div>
        <h3 className="chapter">{t.picture[lang]}</h3>
        <div className="grid grid-cols-4 gap-[2cqw]">
          {scenes.map((s, i) => (
            <button key={s.id} onClick={() => setScene(i)} className={`pick-img ${scene === i ? "pick-on" : ""}`}>
              <img src={s.img} alt={s[lang]} loading="lazy" />
              <span>{s[lang]}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="min-h-0">
        <h3 className="chapter">{t.level[lang]}{game.kind === "jigsaw" ? ` (${t.pieces[lang]})` : ""}</h3>
        <div className="flex flex-wrap gap-2">
          {lvls.map((l, i) => (
            <button key={i} onClick={() => setLevel(i)} className={`level-chip ${level === i ? "level-on" : ""}`}>{l.label[lang]}</button>
          ))}
        </div>
      </div>
      <img src={scenes[scene]!.img} alt="" className="preview-img min-h-0 flex-1" />
      <button className="btn-gold btn-xl" onClick={() => onPlay(scene, level)}>▶ {t.play[lang]}</button>
    </div>
  );
}

function Play({ lang, game, scene, level, onBack, onNext }: { lang: Lang; game: Game; scene: number; level: number; onBack: () => void; onNext: () => void }) {
  const [round, setRound] = useState(0);
  const [moves, setMoves] = useState(0);
  const [prog, setProg] = useState<[number, number] | null>(null);
  const [done, setDone] = useState(false);
  const sc = scenes[scene]!;
  const lv = levels[game.kind!][level]!;
  const restart = useCallback(() => { setRound((r) => r + 1); setMoves(0); setProg(null); setDone(false); }, []);
  const onProgress = (n: number, total: number) => { setProg([n, total]); if (n === total) setTimeout(() => setDone(true), 400); };
  const onMove = (m: number, solved: boolean) => { setMoves(m); if (solved) setTimeout(() => setDone(true), 500); };
  const k = game.kind!;
  const total = k === "missing" ? lv.extra! : lv.cols * lv.rows;

  return (
    <GameShell game={game} scene={sc} lang={lang} done={done} onBack={onBack} onRestart={restart} onNext={onNext}
      {...(k === "jigsaw" || k === "missing" ? { progress: `${prog?.[0] ?? 0}/${total}` } : { moves })}>
      <div key={round} className="h-full">
        {k === "jigsaw" && <Jigsaw img={sc.img} cols={lv.cols} rows={lv.rows} onProgress={onProgress} />}
        {(k === "swap" || k === "strip") && <GridSwap img={sc.img} cols={lv.cols} rows={lv.rows} onMove={onMove} />}
        {k === "rotate" && <GridSwap img={sc.img} cols={lv.cols} rows={lv.rows} rotate onMove={onMove} />}
        {k === "missing" && <Missing img={sc.img} decoy={scenes[(scene + 1) % scenes.length]!.img} cols={lv.cols} rows={lv.rows} missing={lv.extra!} onProgress={onProgress} />}
      </div>
    </GameShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import gir from "@/assets/gir.png.asset.json";
import { games, t, type Lang } from "@/lib/i18n";
import { TileSwap } from "@/components/game/TileSwap";

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

type Screen = "welcome" | "hub" | "game";
const IDLE_MS = 90_000;

function App() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [lang, setLang] = useState<Lang>("gu");

  // Kiosk: return to attract screen when idle
  useEffect(() => {
    let id = setTimeout(() => setScreen("welcome"), IDLE_MS);
    const reset = () => { clearTimeout(id); id = setTimeout(() => setScreen("welcome"), IDLE_MS); };
    window.addEventListener("pointerdown", reset);
    return () => { clearTimeout(id); window.removeEventListener("pointerdown", reset); };
  }, []);

  return (
    <div className="kiosk-stage">
      <main className="kiosk-frame" lang={lang}>
        {screen === "welcome" && <Welcome lang={lang} setLang={setLang} onStart={() => setScreen("hub")} />}
        {screen === "hub" && <Hub lang={lang} onBack={() => setScreen("welcome")} onPlay={() => setScreen("game")} />}
        {screen === "game" && <TileSwap img={gir.url} lang={lang} onBack={() => setScreen("hub")} />}
      </main>
    </div>
  );
}

function Welcome({ lang, setLang, onStart }: { lang: Lang; setLang: (l: Lang) => void; onStart: () => void }) {
  return (
    <div className="relative flex h-full flex-col">
      <img src={gir.url} alt="Asiatic lion in Gir Forest" className="ken-burns absolute inset-0 h-full w-full object-cover" />
      <div className="welcome-veil absolute inset-0" />
      <span className="butterfly" style={{ top: "22%", left: "10%" }}>🦋</span>
      <span className="butterfly delay" style={{ top: "35%", left: "70%" }}>🦋</span>
      <div className="relative z-10 flex flex-col items-center pt-[8%] text-center">
        <p className="text-sm font-bold tracking-[0.3em] text-ivory uppercase">Gujarat Tourism · Sasan Gir</p>
        <h1 className="font-gu mt-3 text-[clamp(3rem,14cqw,7rem)] leading-none text-ivory drop-title">{t.title.gu}</h1>
        <h2 className="font-display text-[clamp(1.6rem,7cqw,3.5rem)] text-gold drop-title">Gir Puzzle</h2>
        <p className="mt-3 max-w-[80%] text-lg text-ivory drop-title">{t.tagline[lang]}</p>
      </div>
      <div className="relative z-10 mt-auto flex flex-col items-center gap-5 pb-[10%]">
        <div className="flex gap-3">
          {(["gu", "en"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)} className={lang === l ? "chip chip-on" : "chip"}>
              {l === "gu" ? "ગુજરાતી" : "English"}
            </button>
          ))}
        </div>
        <button className="btn-gold pulse text-2xl" onClick={onStart}>🐾 {t.start[lang]}</button>
      </div>
    </div>
  );
}

function Hub({ lang, onBack, onPlay }: { lang: Lang; onBack: () => void; onPlay: () => void }) {
  return (
    <div className="paper flex h-full flex-col">
      <header className="flex items-center justify-between gap-3 p-5">
        <button className="btn-wood" onClick={onBack}>← {t.back[lang]}</button>
        <div className="signboard">{t.chooseGame[lang]}</div>
      </header>
      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-8">
        {[0, 1, 2].map((c) => (
          <section key={c} className="mb-6">
            <h3 className="font-display mb-3 text-xl text-forest">{t.cats[lang][c]}</h3>
            <div className="grid grid-cols-2 gap-3 [@container(min-width:700px)]:grid-cols-3">
              {games.filter((g) => g.cat === c).map((g) => (
                <button key={g.id} onClick={g.playable ? onPlay : undefined} className={g.playable ? "game-card" : "game-card game-card-locked"}>
                  <span className="text-5xl">{g.icon}</span>
                  <span className="text-xs font-bold text-terra">#{String(g.id).padStart(2, "0")}</span>
                  <span className="font-bold leading-tight text-earth">{g[lang]}</span>
                  {!g.playable && <span className="text-xs text-olive">{t.soon[lang]}</span>}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

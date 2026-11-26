import { Home, Volume2, VolumeX, Languages, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KioskModal } from "./KioskModal";
import type { Lang } from "@/lib/i18n";

export function LanguagePicker({ lang, setLang }: { lang: Lang; setLang: (lang: Lang) => void }) {
  return <div className="language-segment" role="group" aria-label="Language / ભાષા">
    <Button variant="quiet" size="kiosk" aria-pressed={lang === "gu"} onClick={() => setLang("gu")}>ગુજરાતી</Button>
    <Button variant="quiet" size="kiosk" aria-pressed={lang === "en"} onClick={() => setLang("en")}>English</Button>
  </div>;
}

export function QuickSettings({ open, onOpenChange, lang, setLang, muted, setMuted, onHome }: {
  open: boolean; onOpenChange: (open: boolean) => void; lang: Lang; setLang: (lang: Lang) => void;
  muted: boolean; setMuted: (muted: boolean) => void; onHome: () => void;
}) {
  const gu = lang === "gu";
  return <KioskModal open={open} onOpenChange={onOpenChange} title={gu ? "તમારી પસંદગી" : "Make it yours"} closeLabel={gu ? "બંધ કરો" : "Close settings"}>
    <div className="settings-row"><span><Languages />{gu ? "ભાષા" : "Language"}</span></div>
    <LanguagePicker lang={lang} setLang={setLang} />
    <div className="settings-row sound-row"><span>{muted ? <VolumeX /> : <Volume2 />}{gu ? "રમતનો અવાજ" : "Game sounds"}</span>
      <Button variant="glass" size="kiosk" role="switch" aria-checked={!muted} aria-label={gu ? "રમતનો અવાજ" : "Game sounds"} className="sound-switch" onClick={() => setMuted(!muted)}><span /><span className="sr-only">{muted ? "Off" : "On"}</span></Button>
    </div>
    <Button variant="glass" size="kiosk" className="home-command" onClick={() => { onHome(); onOpenChange(false); }}><Home />{gu ? "શરૂઆત પર જાઓ" : "Back to welcome"}<ArrowUpRight /></Button>
    <div className="drawer-brand">GUJARAT TOURISM <span>•</span> SASAN GIR</div>
  </KioskModal>;
}
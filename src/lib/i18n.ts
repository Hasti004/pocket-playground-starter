export type Lang = "gu" | "en";
export type L = { gu: string; en: string };
export const t = {
  title: { gu: "ગીરની પઝલ", en: "Gir Puzzle" },
  tagline: { gu: "વન્યજીવનને જાણો, રમતાં રમતાં શીખો.", en: "Discover the wild. Solve the adventure." },
  start: { gu: "શરૂ કરો", en: "Start Exploring" },
  chooseGame: { gu: "રમત પસંદ કરો", en: "Choose a Game" },
  soon: { gu: "ટૂંક સમયમાં", en: "Coming soon" },
  back: { gu: "પાછા", en: "Back" },
  play: { gu: "રમો!", en: "Let's Play!" },
  picture: { gu: "ચિત્ર પસંદ કરો", en: "Pick a picture" },
  level: { gu: "સ્તર પસંદ કરો", en: "Pick a level" },
  pieces: { gu: "ટુકડા", en: "pieces" },
  moves: { gu: "ચાલ", en: "Moves" },
  time: { gu: "સમય", en: "Time" },
  restart: { gu: "ફરી", en: "Restart" },
  hint: { gu: "ઝલક", en: "Peek" },
  hold: { gu: "દબાવી રાખો", en: "hold" },
  won: { gu: "શાબાશ, સંશોધક!", en: "Well done, explorer!" },
  playAgain: { gu: "ફરી રમો", en: "Play again" },
  next: { gu: "આગળનું ચિત્ર", en: "Next picture" },
  menu: { gu: "રમતો", en: "Games" },
  didYouKnow: { gu: "શું તમે જાણો છો?", en: "Did you know?" },
  cats: {
    gu: ["ચિત્ર સાહસ", "વન્યજીવ શોધ", "સર્જનાત્મક પડકાર"],
    en: ["Picture Adventures", "Wildlife Discoveries", "Creative Challenges"],
  },
} as const;

export type GameKind = "jigsaw" | "swap" | "strip" | "rotate" | "missing";
export type Game = { id: number; cat: 0 | 1 | 2; icon: string; name: L; desc: L; how: L; kind?: GameKind };

export const games: Game[] = [
  { id: 1, cat: 0, icon: "🧩", kind: "jigsaw", name: { en: "Classic Jigsaw", gu: "જીગ્સૉ પઝલ" }, desc: { en: "Drag real jigsaw pieces", gu: "સાચા ટુકડા ખેંચો" }, how: { en: "Drag each piece onto the board. It snaps when close!", gu: "દરેક ટુકડો બોર્ડ પર ખેંચો. નજીક આવતાં જ ચોંટી જશે!" } },
  { id: 2, cat: 0, icon: "🔀", kind: "swap", name: { en: "Tile Swap", gu: "ટાઇલ અદલાબદલી" }, desc: { en: "Swap tiles to fix the picture", gu: "ટાઇલ બદલી ચિત્ર બનાવો" }, how: { en: "Drag a tile onto another — or tap two — to swap them.", gu: "એક ટાઇલ બીજી પર ખેંચો — અથવા બે ટેપ કરો." } },
  { id: 3, cat: 0, icon: "📏", kind: "strip", name: { en: "Strip Puzzle", gu: "પટ્ટી પઝલ" }, desc: { en: "Put the strips in order", gu: "પટ્ટીઓ ક્રમમાં મૂકો" }, how: { en: "Drag the strips up and down into the right order.", gu: "પટ્ટીઓને ઉપર-નીચે ખેંચી સાચા ક્રમમાં મૂકો." } },
  { id: 4, cat: 0, icon: "🔄", kind: "rotate", name: { en: "Rotate & Arrange", gu: "ફેરવો અને ગોઠવો" }, desc: { en: "Spin and move the tiles", gu: "ટાઇલ ફેરવો અને ગોઠવો" }, how: { en: "Tap a tile to spin it. Drag to move it.", gu: "ટાઇલ ફેરવવા ટેપ કરો. ખસેડવા ખેંચો." } },
  { id: 5, cat: 0, icon: "❓", kind: "missing", name: { en: "Missing Pieces", gu: "ખૂટતા ટુકડા" }, desc: { en: "Find the lost pieces", gu: "ખોવાયેલા ટુકડા શોધો" }, how: { en: "Drag the right pieces into the holes. Watch out for tricky ones!", gu: "સાચા ટુકડા ખાલી જગ્યામાં મૂકો. ખોટા ટુકડાથી સાવધાન!" } },
  { id: 6, cat: 2, icon: "🔷", name: { en: "Wildlife Tangram", gu: "વન્યજીવ ટેન્ગ્રામ" }, desc: { en: "Build animals from shapes", gu: "આકારથી પ્રાણી બનાવો" }, how: { en: "", gu: "" } },
  { id: 7, cat: 1, icon: "👯", name: { en: "Double Trouble", gu: "ડબલ મુશ્કેલી" }, desc: { en: "Two puzzles, one tray", gu: "બે પઝલ, એક ટ્રે" }, how: { en: "", gu: "" } },
  { id: 8, cat: 1, icon: "🌑", name: { en: "Match the Shadow", gu: "પડછાયો મેળવો" }, desc: { en: "Whose shadow is this?", gu: "આ કોનો પડછાયો?" }, how: { en: "", gu: "" } },
  { id: 9, cat: 1, icon: "🐾", name: { en: "Track the Footprints", gu: "પગલાં ઓળખો" }, desc: { en: "Follow the tracks", gu: "પગલાં અનુસરો" }, how: { en: "", gu: "" } },
  { id: 10, cat: 1, icon: "🏡", name: { en: "Find My Home", gu: "મારું ઘર શોધો" }, desc: { en: "Where does it live?", gu: "તે ક્યાં રહે છે?" }, how: { en: "", gu: "" } },
  { id: 11, cat: 2, icon: "🦁", name: { en: "Build the Animal", gu: "પ્રાણી બનાવો" }, desc: { en: "Put body parts together", gu: "અંગો જોડો" }, how: { en: "", gu: "" } },
  { id: 12, cat: 1, icon: "🍃", name: { en: "Feeding Time", gu: "ખોરાકનો સમય" }, desc: { en: "Who eats what?", gu: "કોણ શું ખાય?" }, how: { en: "", gu: "" } },
  { id: 13, cat: 1, icon: "🏷️", name: { en: "Know My Name", gu: "મારું નામ જાણો" }, desc: { en: "Match names to animals", gu: "નામ મેળવો" }, how: { en: "", gu: "" } },
  { id: 14, cat: 2, icon: "🌳", name: { en: "Build the Gir Forest", gu: "ગીર જંગલ બનાવો" }, desc: { en: "Create your own forest", gu: "તમારું જંગલ બનાવો" }, how: { en: "", gu: "" } },
];

export type Level = { label: L; cols: number; rows: number; extra?: number };
const lv = (en: string, gu: string, cols: number, rows: number, extra?: number): Level => ({ label: { en, gu }, cols, rows, ...(extra !== undefined ? { extra } : {}) });
const JIG: [number, number][] = [[2, 2], [2, 3], [3, 3], [3, 4], [4, 4], [4, 5], [5, 5], [5, 6], [6, 6], [5, 8], [6, 8]];
export const levels: Record<GameKind, Level[]> = {
  jigsaw: JIG.map(([c, r]) => lv(String(c * r), String(c * r), c, r)),
  swap: [lv("Easy", "સરળ", 2, 3), lv("Medium", "મધ્યમ", 3, 4), lv("Hard", "અઘરું", 4, 6)],
  strip: [lv("4 strips", "૪ પટ્ટી", 1, 4), lv("6 strips", "૬ પટ્ટી", 1, 6), lv("8 strips", "૮ પટ્ટી", 1, 8)],
  rotate: [lv("Easy", "સરળ", 2, 3), lv("Medium", "મધ્યમ", 3, 4), lv("Hard", "અઘરું", 4, 5)],
  missing: [lv("2 missing", "૨ ખૂટે", 3, 4, 2), lv("4 missing", "૪ ખૂટે", 3, 4, 4), lv("6 missing", "૬ ખૂટે", 4, 6, 6)],
};

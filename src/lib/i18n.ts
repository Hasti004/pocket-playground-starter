export type Lang = "gu" | "en";
export const t = {
  title: { gu: "ગીરની પઝલ", en: "Gir Puzzle" },
  tagline: { gu: "વન્યજીવનને જાણો, રમતાં રમતાં શીખો.", en: "Discover the wild. Solve the adventure." },
  start: { gu: "શરૂ કરો", en: "Start Exploring" },
  chooseGame: { gu: "રમત પસંદ કરો", en: "Choose a Game" },
  soon: { gu: "ટૂંક સમયમાં", en: "Coming soon" },
  back: { gu: "પાછા", en: "Back" },
  moves: { gu: "ચાલ", en: "Moves" },
  shuffle: { gu: "ફરી ગોઠવો", en: "Shuffle" },
  hint: { gu: "ઝલક", en: "Peek" },
  won: { gu: "શાબાશ! પઝલ પૂર્ણ!", en: "Well done, explorer!" },
  playAgain: { gu: "ફરી રમો", en: "Play again" },
  tapTwo: { gu: "બે ટુકડા ટેપ કરી અદલાબદલી કરો", en: "Tap two pieces to swap them" },
  cats: {
    gu: ["ચિત્ર સાહસ", "વન્યજીવ શોધ", "સર્જનાત્મક પડકાર"],
    en: ["Picture Adventures", "Wildlife Discoveries", "Creative Challenges"],
  },
} as const;

export const games: { id: number; cat: 0 | 1 | 2; icon: string; en: string; gu: string; playable?: boolean }[] = [
  { id: 1, cat: 0, icon: "🧩", en: "Classic Jigsaw", gu: "જીગ્સૉ પઝલ" },
  { id: 2, cat: 0, icon: "🔀", en: "Tile Swap", gu: "ટાઇલ અદલાબદલી", playable: true },
  { id: 3, cat: 0, icon: "📏", en: "Strip Puzzle", gu: "પટ્ટી પઝલ" },
  { id: 4, cat: 0, icon: "🔄", en: "Rotate & Arrange", gu: "ફેરવો અને ગોઠવો" },
  { id: 5, cat: 0, icon: "❓", en: "Missing Pieces", gu: "ખૂટતા ટુકડા" },
  { id: 6, cat: 2, icon: "🔷", en: "Wildlife Tangram", gu: "વન્યજીવ ટેન્ગ્રામ" },
  { id: 7, cat: 1, icon: "👯", en: "Double Trouble", gu: "જોડી શોધો" },
  { id: 8, cat: 1, icon: "🌑", en: "Match the Shadow", gu: "પડછાયો મેળવો" },
  { id: 9, cat: 1, icon: "🐾", en: "Track the Footprints", gu: "પગલાં ઓળખો" },
  { id: 10, cat: 1, icon: "🏡", en: "Find My Home", gu: "મારું ઘર શોધો" },
  { id: 11, cat: 2, icon: "🦁", en: "Build the Animal", gu: "પ્રાણી બનાવો" },
  { id: 12, cat: 1, icon: "🍃", en: "Feeding Time", gu: "ખોરાકનો સમય" },
  { id: 13, cat: 1, icon: "🏷️", en: "Know My Name", gu: "મારું નામ જાણો" },
  { id: 14, cat: 2, icon: "🌳", en: "Build the Gir Forest", gu: "ગીર જંગલ બનાવો" },
];

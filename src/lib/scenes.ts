import lion from "@/assets/gir.png.asset.json";
import leopard from "@/assets/leopard.jpg";
import peacock from "@/assets/peacock.jpg";
import river from "@/assets/river.jpg";

export type Scene = { id: string; img: string; en: string; gu: string; factEn: string; factGu: string };
export const scenes: Scene[] = [
  { id: "lion", img: lion.url, en: "Asiatic Lion", gu: "એશિયાઈ સિંહ", factEn: "Gir is the only wild home of Asiatic lions on Earth!", factGu: "ગીર પૃથ્વી પર એશિયાઈ સિંહોનું એકમાત્ર જંગલી ઘર છે!" },
  { id: "leopard", img: leopard, en: "Indian Leopard", gu: "દીપડો", factEn: "Leopards love to rest high up in trees.", factGu: "દીપડાને ઝાડ પર ઊંચે આરામ કરવો ગમે છે." },
  { id: "peacock", img: peacock, en: "Peacock & Chital", gu: "મોર અને ચિતલ", factEn: "The peacock is India's national bird.", factGu: "મોર ભારતનું રાષ્ટ્રીય પક્ષી છે." },
  { id: "river", img: river, en: "Mugger & Langurs", gu: "મગર અને વાંદરા", factEn: "Mugger crocodiles bask on warm river rocks.", factGu: "મગર નદીના ગરમ પથ્થરો પર તડકો લે છે." },
];

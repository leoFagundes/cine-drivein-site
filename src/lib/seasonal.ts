import type { EventType } from "@/types/Types";

export const SEASONAL_THEMES = ["christmas", "halloween", "easter"] as const;
export type SeasonalTheme = (typeof SEASONAL_THEMES)[number];

export function isSeasonalTheme(value: unknown): value is SeasonalTheme {
  return (SEASONAL_THEMES as readonly unknown[]).includes(value);
}

/** Converte o `isEvent` do siteConfig no tema ativo (ou null). */
export function resolveSeasonalTheme(
  event: EventType | string | undefined,
): SeasonalTheme | null {
  return isSeasonalTheme(event) ? event : null;
}

export const SEASONAL_META: Record<
  SeasonalTheme,
  { badge: string; title: string }
> = {
  christmas: {
    badge: "🎄 Feliz Natal",
    title: "🎄 Cine Drive-In — Especial de Natal",
  },
  halloween: {
    badge: "🎃 Feliz Halloween",
    title: "🎃 Cine Drive-In — Especial de Halloween",
  },
  easter: {
    badge: "🐣 Feliz Páscoa",
    title: "🐣 Cine Drive-In — Especial de Páscoa",
  },
};

/** Último tema vindo do Firestore, para aplicar as cores antes da hidratação. */
const CACHE_KEY = "seasonalTheme";
/** Pré-visualização via `?tema=` — vale só para a aba atual. */
const PREVIEW_KEY = "seasonalPreview";
const PREVIEW_NONE = "none";

/**
 * Roda no <head>, antes do React: aplica `data-seasonal` no <html> a partir
 * da pré-visualização (`?tema=natal|halloween|pascoa|nenhum`, `?tema=auto`
 * volta ao normal) ou do último tema conhecido. Evita o "flash" do tema padrão.
 */
export const SEASONAL_BOOT_SCRIPT = `(function(){try{
var q=new URLSearchParams(location.search).get("tema");
if(q!==null){var m={natal:"christmas",christmas:"christmas",halloween:"halloween",pascoa:"easter","páscoa":"easter",easter:"easter",nenhum:"${PREVIEW_NONE}",none:"${PREVIEW_NONE}",off:"${PREVIEW_NONE}"};
var v=m[q.toLowerCase()];if(v){sessionStorage.setItem("${PREVIEW_KEY}",v)}else{sessionStorage.removeItem("${PREVIEW_KEY}")}}
var t=sessionStorage.getItem("${PREVIEW_KEY}")||localStorage.getItem("${CACHE_KEY}");
if(t==="christmas"||t==="halloween"||t==="easter"){document.documentElement.setAttribute("data-seasonal",t)}
}catch(e){}})();`;

/** `undefined` = sem pré-visualização; `null` = pré-visualizando "sem tema". */
export function readSeasonalPreview(): SeasonalTheme | null | undefined {
  try {
    const value = sessionStorage.getItem(PREVIEW_KEY);
    if (value === PREVIEW_NONE) return null;
    return isSeasonalTheme(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function cacheSeasonalTheme(theme: SeasonalTheme | null) {
  try {
    if (theme) localStorage.setItem(CACHE_KEY, theme);
    else localStorage.removeItem(CACHE_KEY);
  } catch {
    // storage indisponível (aba anônima etc.) — só perde o cache
  }
}

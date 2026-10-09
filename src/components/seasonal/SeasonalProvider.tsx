"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import {
  SEASONAL_META,
  cacheSeasonalTheme,
  isSeasonalTheme,
  readSeasonalPreview,
  resolveSeasonalTheme,
  type SeasonalTheme,
} from "@/lib/seasonal";
import type { SeasonalDecor } from "./types";

interface SeasonalContextValue {
  theme: SeasonalTheme | null;
  decor: SeasonalDecor | null;
}

const SeasonalContext = createContext<SeasonalContextValue>({
  theme: null,
  decor: null,
});

export function useSeasonal() {
  return useContext(SeasonalContext);
}

const loaders: Record<SeasonalTheme, () => Promise<{ default: SeasonalDecor }>> =
  {
    christmas: () => import("./themes/christmas"),
    halloween: () => import("./themes/halloween"),
    easter: () => import("./themes/easter"),
  };

/** Rotas onde a camada animada atrapalharia (o jogo da Snake). */
const SCENE_BLOCKLIST = ["/snake"];

export default function SeasonalProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SeasonalTheme | null>(null);
  const [decor, setDecor] = useState<SeasonalDecor | null>(null);
  const { data: siteConfig } = useSiteConfig();
  const pathname = usePathname();

  // Tema já aplicado pelo script do <head> (cache ou ?tema=): não espera o Firestore.
  useEffect(() => {
    const initial = document.documentElement.dataset.seasonal;
    if (isSeasonalTheme(initial)) setTheme(initial);
  }, []);

  // Fonte da verdade: siteConfig.isEvent — a pré-visualização tem prioridade.
  useEffect(() => {
    if (!siteConfig) return;
    const fromConfig = resolveSeasonalTheme(siteConfig.isEvent);
    cacheSeasonalTheme(fromConfig);
    const preview = readSeasonalPreview();
    setTheme(preview === undefined ? fromConfig : preview);
  }, [siteConfig]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme) root.dataset.seasonal = theme;
    else delete root.dataset.seasonal;
  }, [theme]);

  useEffect(() => {
    if (!theme) return;
    const previous = document.title;
    document.title = SEASONAL_META[theme].title;
    return () => {
      document.title = previous;
    };
  }, [theme, pathname]);

  // Baixa só o código do tema ativo.
  useEffect(() => {
    if (!theme) return;
    let active = true;
    loaders[theme]()
      .then((mod) => {
        if (active) setDecor(mod.default);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [theme]);

  const activeDecor = decor && decor.theme === theme ? decor : null;
  const Scene =
    activeDecor && !SCENE_BLOCKLIST.some((p) => pathname?.startsWith(p))
      ? activeDecor.Scene
      : null;

  return (
    <SeasonalContext.Provider value={{ theme, decor: activeDecor }}>
      {children}
      {Scene && <Scene />}
    </SeasonalContext.Provider>
  );
}

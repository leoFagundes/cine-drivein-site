import { carsTheme } from "./cars";
import { classicTheme } from "./classic";
import type { SnakeTheme, SnakeThemeId } from "./types";

export const SNAKE_THEMES: Record<SnakeThemeId, SnakeTheme> = {
  classic: classicTheme,
  cars: carsTheme,
};

/** Valores aceitos em ?cobrinha= (só para testar o outro tema sem mexer no código). */
export const SNAKE_THEME_PREVIEW: Record<string, SnakeThemeId> = {
  carros: "cars",
  cars: "cars",
  classico: "classic",
  "clássico": "classic",
  classic: "classic",
};

export type { SnakeTheme, SnakeThemeId } from "./types";

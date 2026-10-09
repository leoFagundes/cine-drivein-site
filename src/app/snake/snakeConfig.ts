import type { SnakeThemeId } from "./themes/types";

/**
 * Tema da cobrinha — troque esta linha para mudar o jogo e a página inteira:
 *   "classic" → Snake do Drive-in (cinema, pipoca)
 *   "cars"    → Competição 20 anos de Carros (Relâmpago McQueen, troféus)
 *
 * Para só testar, sem mexer aqui: /snake?cobrinha=carros ou /snake?cobrinha=classico
 */
export const SNAKE_THEME: SnakeThemeId = "cars";

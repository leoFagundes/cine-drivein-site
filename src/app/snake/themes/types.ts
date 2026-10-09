import type { ComponentType } from "react";
import type { SnakeAudioConfig } from "../gameAudio";
import type { Point } from "../gameLogic";

export type SnakeThemeId = "classic" | "cars";

/**
 * Desenho do jogo no canvas. Cabeça e comida são desenhadas uma única vez em
 * sprites (cache); só o corpo é redesenhado a cada quadro.
 */
export interface SnakeRenderer {
  /** Fundo do tabuleiro (cache por tamanho). Coordenadas em px. */
  drawBoard(ctx: CanvasRenderingContext2D, size: number, cell: number, grid: number): void;
  /** Cabeça apontando para a direita (+x), centrada em (0,0). 1 unidade = 1 célula. */
  drawHead(ctx: CanvasRenderingContext2D): void;
  /** Caixa do sprite da cabeça, em células. */
  headSize: { w: number; h: number };
  /** Comida centrada em (0,0). 1 unidade = 1 célula. */
  drawFood(ctx: CanvasRenderingContext2D): void;
  /** Lado do sprite da comida, em células. */
  foodSize: number;
  /** Corpo inteiro, da cabeça à cauda (pontos em px). */
  drawBody(ctx: CanvasRenderingContext2D, points: Point[], cell: number, time: number): void;
  /** Extras por cima da cabeça a cada quadro (texto sempre em pé, animações). */
  drawHeadOverlay?(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    cell: number,
    time: number,
    font: string,
  ): void;
  particleColors: string[];
  crashColors: string[];
  /** Gravidade das partículas, em células/ms². */
  particleGravity: number;
}

export interface SnakeThemeCopy {
  eyebrow: string;
  title: string;
  subtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  registerCta: string;
  privacyNote: string;
  playingAs: string;
  leaderboardTitle: string;
  leaderboardEmpty: string;
  scoreLabel: string;
  startTitle: string;
  startHint: string;
  goText: string;
  gameOverTitle: string;
}

export interface SnakeTheme {
  id: SnakeThemeId;
  copy: SnakeThemeCopy;
  /** Estilo da contagem regressiva antes de largar. */
  countdown: "film" | "lights";
  renderer: SnakeRenderer;
  /** Arte ao lado do título. */
  HeroArt: ComponentType;
  /** Cenário opcional no fundo do cabeçalho. */
  HeroBackdrop?: ComponentType;
  /** Música e efeitos (volume de 0 a 1). Sem isso, o tema é mudo. */
  audio?: SnakeAudioConfig;
}

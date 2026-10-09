import { useId } from "react";
import type { Point } from "../gameLogic";
import type { SnakeRenderer, SnakeTheme } from "./types";

const TAU = Math.PI * 2;

/* Visual "20 anos de Carros": a cabeça é o Relâmpago McQueen visto de cima,
   o corpo é uma faixa de corrida e a comida é um troféu. */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** PRNG determinístico: o granulado do asfalto sai igual a cada desenho. */
function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawBoard(ctx: CanvasRenderingContext2D, size: number, cell: number, grid: number) {
  ctx.fillStyle = "#26262c";
  ctx.fillRect(0, 0, size, size);

  const rand = seeded(42);
  const grains = Math.round((size * size) / 55);
  for (let i = 0; i < grains; i++) {
    ctx.fillStyle =
      rand() > 0.5
        ? `rgba(255,255,255,${(0.025 + rand() * 0.04).toFixed(3)})`
        : `rgba(0,0,0,${(0.12 + rand() * 0.12).toFixed(3)})`;
    ctx.fillRect(rand() * size, rand() * size, 1.2, 1.2);
  }

  // Faixas de pista bem discretas a cada 5 células.
  ctx.strokeStyle = "rgba(250,204,21,0.1)";
  ctx.lineWidth = Math.max(1, cell * 0.08);
  ctx.setLineDash([cell * 0.6, cell * 0.6]);
  for (let k = 5; k < grid; k += 5) {
    ctx.beginPath();
    ctx.moveTo(k * cell, 0);
    ctx.lineTo(k * cell, size);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  const vignette = ctx.createRadialGradient(size / 2, size / 2, size * 0.3, size / 2, size / 2, size * 0.75);
  vignette.addColorStop(0, "rgba(0,0,0,0)");
  vignette.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = vignette;
  ctx.fillRect(0, 0, size, size);
}

/** Comprimento do carro em células (a cabeça é maior que o rastro, para destacar). */
const CAR_LENGTH = 1.7;

/** McQueen visto de cima, desenhado numa caixa de 104 × 70 apontando para +x. */
function drawHead(ctx: CanvasRenderingContext2D) {
  const s = CAR_LENGTH / 104;
  ctx.save();
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.beginPath();
  ctx.ellipse(4, 5, 54, 34, 0, 0, TAU);
  ctx.fill();

  // Pneus com aro claro: aparecem mesmo sobre o asfalto escuro.
  for (const [x, y, w, h] of [
    [-42, -35, 22, 12],
    [-42, 23, 22, 12],
    [16, -33, 20, 11],
    [16, 22, 20, 11],
  ]) {
    ctx.fillStyle = "#24242b";
    roundRect(ctx, x, y, w, h, 4);
    ctx.fill();
    ctx.strokeStyle = "#6b6b78";
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  const body = new Path2D(
    "M-46 -25C-51 -25 -52 -21 -52 -17L-52 17C-52 21 -51 25 -46 25L20 26C37 26 50 18 53 6L53 -6C50 -18 37 -26 20 -26Z",
  );
  // Contorno claro por fora: separa o carro do rastro e do asfalto.
  ctx.strokeStyle = "rgba(255,236,236,0.6)";
  ctx.lineWidth = 3.4;
  ctx.stroke(body);
  const paint = ctx.createLinearGradient(0, -26, 0, 26);
  paint.addColorStop(0, "#a5101c");
  paint.addColorStop(0.18, "#e3222c");
  paint.addColorStop(0.5, "#f23a42");
  paint.addColorStop(0.82, "#e3222c");
  paint.addColorStop(1, "#a5101c");
  ctx.fillStyle = paint;
  ctx.fill(body);
  ctx.strokeStyle = "#6e0a12";
  ctx.lineWidth = 1.2;
  ctx.stroke(body);

  // Aerofólio
  ctx.fillStyle = "#7d0c14";
  roundRect(ctx, -55, -28, 9, 56, 3);
  ctx.fill();
  ctx.fillStyle = "#ffc21a";
  roundRect(ctx, -54, -4, 7, 8, 2);
  ctx.fill();

  // Raios laterais da pintura
  ctx.strokeStyle = "#ffc21a";
  ctx.lineWidth = 3;
  ctx.lineJoin = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(-38, 20 * side);
    ctx.lineTo(-14, 17 * side);
    ctx.lineTo(-18, 21 * side);
    ctx.lineTo(10, 19 * side);
    ctx.stroke();
  }

  // Vidro traseiro e teto
  ctx.fillStyle = "#2c3443";
  ctx.fill(new Path2D("M-34 -15L-23 -17L-23 17L-34 15Z"));
  ctx.fillStyle = "#ea2a33";
  roundRect(ctx, -23, -18, 22, 36, 6);
  ctx.fill();
  ctx.strokeStyle = "rgba(110,10,18,0.6)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Para-brisa com os olhos (o que faz o carro "ter rosto")
  const glass = new Path2D("M0 -21L21 -17C30 -9 30 9 21 17L0 21Z");
  const glassFill = ctx.createLinearGradient(0, 0, 28, 0);
  glassFill.addColorStop(0, "#cfe6f7");
  glassFill.addColorStop(1, "#f4fbff");
  ctx.fillStyle = glassFill;
  ctx.fill(glass);
  ctx.strokeStyle = "#4b5d70";
  ctx.lineWidth = 1.2;
  ctx.stroke(glass);

  for (const side of [-1, 1]) {
    const y = 8.6 * side;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(13, y, 6.6, 7.6, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "#4b5d70";
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.fillStyle = "#2f7fd8";
    ctx.beginPath();
    ctx.arc(16, y, 4.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#0b0f1a";
    ctx.beginPath();
    ctx.arc(17.3, y, 2.2, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(18.3, y - 1.6, 1.05, 0, TAU);
    ctx.fill();
  }

  // Raio no capô
  const bolt = new Path2D("M27 -11L40 -3L33 -2L47 9L32 2L38 1Z");
  ctx.fillStyle = "#ffb703";
  ctx.fill(bolt);
  ctx.strokeStyle = "#c46a00";
  ctx.lineWidth = 1;
  ctx.stroke(bolt);

  // Sorriso no para-choque
  ctx.strokeStyle = "#5c0910";
  ctx.lineWidth = 1.8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(48, -9);
  ctx.quadraticCurveTo(54, 0, 48, 9);
  ctx.stroke();

  ctx.strokeStyle = "rgba(255,255,255,0.35)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-40, -12);
  ctx.lineTo(-24, -14);
  ctx.stroke();

  ctx.restore();
}

/** O "95" fica sempre em pé, sobre o teto, para qualquer direção do carro. */
function drawHeadOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  cell: number,
  _time: number,
  font: string,
) {
  const unit = (CAR_LENGTH / 104) * cell;
  const rx = x + Math.cos(angle) * -12 * unit;
  const ry = y + Math.sin(angle) * -12 * unit;
  ctx.save();
  ctx.font = `800 ${Math.max(6, cell * 0.27)}px ${font}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  ctx.lineWidth = Math.max(1.2, cell * 0.06);
  ctx.strokeStyle = "#5c0910";
  ctx.strokeText("95", rx, ry);
  ctx.fillStyle = "#ffffff";
  ctx.fillText("95", rx, ry);
  ctx.restore();
}

/** Engate escuro ligando os blocos (fica por baixo deles; aparece nos vãos e nas curvas). */
function drawBody(ctx: CanvasRenderingContext2D, points: Point[], cell: number) {
  if (points.length < 2) return;
  const path = new Path2D();
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) path.lineTo(points[i].x, points[i].y);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(0,0,0,0.35)";
  ctx.lineWidth = cell * 0.22;
  ctx.stroke(path);
  ctx.strokeStyle = "#4a0d13";
  ctx.lineWidth = cell * 0.13;
  ctx.stroke(path);
}

/** Um bloco do comboio: vermelho com volume, sombra no asfalto e o raio do McQueen. */
function drawSegment(ctx: CanvasRenderingContext2D) {
  const half = 0.39;
  const radius = 0.2;

  ctx.fillStyle = "rgba(0,0,0,0.38)";
  roundRect(ctx, -half + 0.05, -half + 0.08, half * 2, half * 2, radius);
  ctx.fill();

  const paint = ctx.createLinearGradient(0, -half, 0, half);
  paint.addColorStop(0, "#ff5a60");
  paint.addColorStop(0.45, "#e3222c");
  paint.addColorStop(1, "#a3101a");
  ctx.fillStyle = paint;
  roundRect(ctx, -half, -half, half * 2, half * 2, radius);
  ctx.fill();
  ctx.strokeStyle = "#6e0a12";
  ctx.lineWidth = 0.04;
  ctx.stroke();

  ctx.fillStyle = "rgba(255,255,255,0.3)";
  roundRect(ctx, -half + 0.09, -half + 0.06, half * 2 - 0.18, 0.11, 0.055);
  ctx.fill();

  const bolt = new Path2D(
    "M0.06 -0.24L-0.12 0.02L0.01 0.02L-0.06 0.24L0.14 -0.05L0.01 -0.05L0.08 -0.24Z",
  );
  ctx.fillStyle = "#ffc21a";
  ctx.fill(bolt);
  ctx.strokeStyle = "#a35d00";
  ctx.lineWidth = 0.025;
  ctx.lineJoin = "round";
  ctx.stroke(bolt);
}

/** Troféu dourado, desenhado numa caixa de 40 unidades. */
function drawFood(ctx: CanvasRenderingContext2D) {
  const halo = ctx.createRadialGradient(0, 0, 0.05, 0, 0, 0.78);
  halo.addColorStop(0, "rgba(251,191,36,0.45)");
  halo.addColorStop(1, "rgba(251,191,36,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0, 0.78, 0, TAU);
  ctx.fill();

  ctx.save();
  ctx.scale(1 / 40, 1 / 40);

  ctx.fillStyle = "#7a4a0c";
  roundRect(ctx, -10, 11, 20, 6, 2);
  ctx.fill();
  ctx.fillStyle = "#b7791f";
  roundRect(ctx, -7, 7, 14, 5, 1.5);
  ctx.fill();
  ctx.fillStyle = "#d89b1d";
  ctx.fillRect(-2, 2, 4, 6);

  ctx.strokeStyle = "#e5a823";
  ctx.lineWidth = 2.6;
  ctx.lineCap = "round";
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(10 * side, -10);
    ctx.bezierCurveTo(19 * side, -10, 19 * side, 0, 8 * side, 0);
    ctx.stroke();
  }

  const cup = new Path2D("M-12 -15L12 -15C12 -2 7 3 0 4C-7 3 -12 -2 -12 -15Z");
  const gold = ctx.createLinearGradient(-12, 0, 12, 0);
  gold.addColorStop(0, "#f7c948");
  gold.addColorStop(0.45, "#ffe58a");
  gold.addColorStop(1, "#d9961a");
  ctx.fillStyle = gold;
  ctx.fill(cup);
  ctx.strokeStyle = "#a8690b";
  ctx.lineWidth = 1;
  ctx.stroke(cup);

  ctx.fillStyle = "#e11d2e";
  ctx.fill(new Path2D("M1 -12L-3 -5L0 -5L-2 1L4 -7L1 -7L3 -12Z"));

  ctx.strokeStyle = "rgba(255,255,255,0.7)";
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(-8, -12);
  ctx.quadraticCurveTo(-9, -4, -5, 0);
  ctx.stroke();

  ctx.restore();
}

const renderer: SnakeRenderer = {
  drawBoard,
  drawHead,
  headSize: { w: 1.95, h: 1.35 },
  drawFood,
  foodSize: 1.6,
  bodyStyle: "segments",
  drawBody,
  drawSegment,
  segmentSize: 1,
  drawHeadOverlay,
  particleColors: ["#ffd34d", "#fff3b0", "#ff9f1c", "#e11d2e"],
  crashColors: ["#e3222c", "#ffc21a", "#9ca3af", "#d1d5db"],
  particleGravity: 0.0000035,
};

/** Bandeira quadriculada tremulando + selo dos 20 anos. */
function HeroArt() {
  const checker = `sk-checker-${useId().replace(/:/g, "")}`;
  return (
    <svg
      width={112}
      height={90}
      viewBox="0 0 120 96"
      aria-hidden="true"
      className="flex-shrink-0 drop-shadow-lg"
    >
      <defs>
        <pattern id={checker} width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="12" height="12" fill="#ffffff" />
          <rect width="6" height="6" fill="#111111" />
          <rect x="6" y="6" width="6" height="6" fill="#111111" />
        </pattern>
      </defs>
      <rect x="14" y="8" width="4" height="84" rx="2" fill="#3f3f46" />
      <circle cx="16" cy="8" r="4" fill="#fbbf24" />
      <g className="sk-flag">
        <path
          d="M18 12C38 4 52 20 76 12L76 50C52 58 38 42 18 50Z"
          fill={`url(#${checker})`}
          stroke="#111111"
          strokeWidth="1.2"
        />
      </g>
      <g transform="translate(92 66)">
        <circle r="21" fill="#e11d2e" stroke="#fbbf24" strokeWidth="3" />
        <text y="3" textAnchor="middle" fontSize="17" fontWeight="900" fill="#ffffff">
          20
        </text>
        <text y="13" textAnchor="middle" fontSize="6.5" fontWeight="800" fill="#fde68a">
          ANOS
        </text>
      </g>
    </svg>
  );
}

/** Mesas do deserto ao pôr do sol, no rodapé do cabeçalho. */
function HeroBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 w-full h-16 sm:h-20 pointer-events-none"
      viewBox="0 0 400 60"
      preserveAspectRatio="none"
    >
      <path
        d="M0 60L0 44L40 44L48 30L92 28L100 44L150 46L170 46L176 34L214 33L220 46L280 46L292 22L340 20L352 46L400 48L400 60Z"
        fill="rgba(76,18,58,0.55)"
      />
      <path d="M0 60L0 52L400 54L400 60Z" fill="rgba(40,10,32,0.6)" />
    </svg>
  );
}

export const carsTheme: SnakeTheme = {
  id: "cars",
  copy: {
    eyebrow: "Competição · 20 anos de Carros",
    title: "Corrida da Cobrinha",
    subtitle:
      "Acelere com o Relâmpago McQueen, colete troféus e dispute o topo da classificação.",
    registerTitle: "Inscrição do piloto",
    registerSubtitle: "Preencha para entrar na competição.",
    registerCta: "Ir para a largada",
    privacyNote:
      "Só o seu nome aparece na classificação. O telefone é usado para o Cine Drive-in falar com você sobre a competição.",
    playingAs: "Pilotando como",
    leaderboardTitle: "Classificação",
    leaderboardEmpty: "A pista está livre. Faça a primeira volta!",
    scoreLabel: "Troféus",
    startTitle: "Pronto para a largada?",
    startHint: "Toque no tabuleiro ou aperte uma seta para largar",
    goText: "Ka-chow!",
    gameOverTitle: "Fim da corrida",
  },
  countdown: "lights",
  renderer,
  HeroArt,
  HeroBackdrop,
  audio: {
    // Versão 96 kbps da música (3,6 MB em vez de 7,2 MB) — mesma qualidade a 20%.
    music: { src: "/music/lifeishighway-96k.mp3", volume: 0.2 },
    sfx: {
      eat: { src: "/music/coin.mp3", volume: 0.5 },
      crash: { src: "/music/batida.mp3", volume: 0.5 },
      countdown: { src: "/music/count-racer.mp3", volume: 0.5 },
    },
  },
};

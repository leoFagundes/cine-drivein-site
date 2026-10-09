import ClapperBoard from "../ClapperBoard";
import type { Point } from "../gameLogic";
import type { SnakeRenderer, SnakeTheme } from "./types";

const TAU = Math.PI * 2;

/* Visual "Cine Drive-in": tubo de neon ciano (como o letreiro "Cine") com
   lâmpadas âmbar de marquise correndo pelo corpo, e pipoca de comida. */

function drawBoard(ctx: CanvasRenderingContext2D, size: number, cell: number, grid: number) {
  const bg = ctx.createRadialGradient(size * 0.5, size * 0.35, size * 0.05, size * 0.5, size * 0.5, size * 0.8);
  bg.addColorStop(0, "#16243f");
  bg.addColorStop(1, "#090f1d");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "rgba(148,163,184,0.2)";
  const r = Math.max(0.8, cell * 0.05);
  for (let x = 1; x < grid; x++) {
    for (let y = 1; y < grid; y++) {
      ctx.beginPath();
      ctx.arc(x * cell, y * cell, r, 0, TAU);
      ctx.fill();
    }
  }
}

function drawHead(ctx: CanvasRenderingContext2D) {
  const glow = ctx.createRadialGradient(0, 0, 0.15, 0, 0, 0.8);
  glow.addColorStop(0, "rgba(56,189,248,0.5)");
  glow.addColorStop(1, "rgba(56,189,248,0)");
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 0.8, 0, TAU);
  ctx.fill();

  const skin = ctx.createLinearGradient(0, -0.46, 0, 0.46);
  skin.addColorStop(0, "#8be3ff");
  skin.addColorStop(0.5, "#22b5ec");
  skin.addColorStop(1, "#0b86c0");
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(0.06, 0, 0.56, 0.5, 0, 0, TAU);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.beginPath();
  ctx.ellipse(-0.08, -0.25, 0.24, 0.075, -0.15, 0, TAU);
  ctx.fill();

  for (const side of [-1, 1]) {
    ctx.fillStyle = "rgba(251,113,133,0.35)";
    ctx.beginPath();
    ctx.ellipse(0.04, side * 0.34, 0.09, 0.055, 0, 0, TAU);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0.22, side * 0.21, 0.155, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#0b1220";
    ctx.beginPath();
    ctx.arc(0.28, side * 0.21, 0.085, 0, TAU);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0.3, side * 0.21 - 0.035, 0.028, 0, TAU);
    ctx.fill();
  }
}

/** Língua que sai de vez em quando. */
function drawHeadOverlay(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  cell: number,
  time: number,
) {
  const phase = time % 2600;
  if (phase > 260) return;
  const k = Math.sin((phase / 260) * Math.PI);
  const tip = 0.55 + 0.3 * k;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.scale(cell, cell);
  ctx.strokeStyle = "#fb7185";
  ctx.lineWidth = 0.06;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(0.5, 0);
  ctx.lineTo(tip, 0);
  ctx.lineTo(tip + 0.1, -0.07);
  ctx.moveTo(tip, 0);
  ctx.lineTo(tip + 0.1, 0.07);
  ctx.stroke();
  ctx.restore();
}

function drawBody(ctx: CanvasRenderingContext2D, points: Point[], cell: number) {
  if (points.length < 2) return;
  const path = new Path2D();
  path.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) path.lineTo(points[i].x, points[i].y);

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "rgba(56,189,248,0.16)";
  ctx.lineWidth = cell * 0.96;
  ctx.stroke(path);
  ctx.strokeStyle = "#0e8fc8";
  ctx.lineWidth = cell * 0.64;
  ctx.stroke(path);
  ctx.strokeStyle = "#2fbaf0";
  ctx.lineWidth = cell * 0.47;
  ctx.stroke(path);
  ctx.strokeStyle = "rgba(224,247,255,0.7)";
  ctx.lineWidth = cell * 0.1;
  ctx.stroke(path);

  // Lâmpadas de marquise: o tracejado nasce na cabeça, então anda junto com a cobra.
  ctx.setLineDash([0.001, cell * 0.92]);
  ctx.lineDashOffset = -cell * 0.6;
  ctx.strokeStyle = "#fde68a";
  ctx.lineWidth = cell * 0.17;
  ctx.stroke(path);
  ctx.setLineDash([]);
  ctx.lineDashOffset = 0;
}

function drawFood(ctx: CanvasRenderingContext2D) {
  const halo = ctx.createRadialGradient(0, 0.02, 0.05, 0, 0.02, 0.78);
  halo.addColorStop(0, "rgba(251,191,36,0.42)");
  halo.addColorStop(1, "rgba(251,191,36,0)");
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(0, 0.02, 0.78, 0, TAU);
  ctx.fill();

  const puffs: [number, number, number][] = [
    [-0.2, -0.1, 0.14],
    [0.2, -0.1, 0.14],
    [0, -0.16, 0.16],
    [-0.1, -0.3, 0.13],
    [0.12, -0.29, 0.13],
    [0.01, -0.41, 0.11],
  ];
  for (const [x, y, r] of puffs) {
    ctx.fillStyle = "#fff6e0";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = "rgba(180,130,60,0.35)";
    ctx.lineWidth = 0.02;
    ctx.stroke();
  }
  ctx.fillStyle = "#fbbf24";
  for (const [x, y] of [
    [-0.16, -0.06],
    [0.07, -0.2],
    [0.16, -0.33],
  ]) {
    ctx.beginPath();
    ctx.arc(x, y, 0.035, 0, TAU);
    ctx.fill();
  }

  const bucket = new Path2D("M-0.32 -0.04L0.32 -0.04L0.24 0.44L-0.24 0.44Z");
  ctx.save();
  ctx.clip(bucket);
  for (let i = -4; i < 4; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#e11d48" : "#fff1f2";
    ctx.fillRect(i * 0.1, -0.1, 0.1, 0.6);
  }
  ctx.restore();
  ctx.strokeStyle = "rgba(76,5,25,0.35)";
  ctx.lineWidth = 0.025;
  ctx.stroke(bucket);
  ctx.fillStyle = "#fff1f2";
  ctx.fillRect(-0.34, -0.07, 0.68, 0.06);
}

const renderer: SnakeRenderer = {
  drawBoard,
  drawHead,
  headSize: { w: 1.7, h: 1.7 },
  drawFood,
  foodSize: 1.6,
  drawBody,
  drawHeadOverlay,
  particleColors: ["#fff6e0", "#fde68a", "#fbbf24", "#e11d48"],
  crashColors: ["#38bdf8", "#e0f2fe", "#fbbf24", "#94a3b8"],
  particleGravity: 0.0000045,
};

/** Claquete num "spot" claro — fica legível sobre o cabeçalho escuro. */
function HeroArt() {
  return (
    <div className="sk-hero-badge">
      <ClapperBoard />
    </div>
  );
}

export const classicTheme: SnakeTheme = {
  id: "classic",
  copy: {
    eyebrow: "Sessão secreta",
    title: "Snake do Drive-in",
    subtitle:
      "Você achou o easter egg! Coma pipocas, cresça sem bater e entre para o placar.",
    registerTitle: "Antes de jogar",
    registerSubtitle: "Faça seu cadastro para entrar no placar.",
    registerCta: "Começar a jogar",
    privacyNote:
      "Só o seu nome aparece no placar. O telefone é usado apenas para o Cine Drive-in falar com você.",
    playingAs: "Jogando como",
    leaderboardTitle: "Placar",
    leaderboardEmpty: "Ninguém pontuou ainda. Seja o primeiro!",
    scoreLabel: "Pipocas",
    startTitle: "Pronto para a sessão?",
    startHint: "Toque no tabuleiro ou aperte uma seta para começar",
    goText: "Ação!",
    gameOverTitle: "Fim da sessão",
  },
  countdown: "film",
  renderer,
  HeroArt,
};

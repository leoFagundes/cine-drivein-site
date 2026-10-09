"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import {
  IoChevronBack,
  IoChevronDown,
  IoChevronForward,
  IoChevronUp,
  IoPause,
  IoPlay,
  IoRefresh,
  IoVolumeHigh,
  IoVolumeMute,
} from "react-icons/io5";
import {
  MAX_KMH,
  MAX_LEVEL,
  createInitialState,
  isOpposite,
  kmhForLevel,
  levelForScore,
  step,
  tickMsForLevel,
  type Direction,
  type GameState,
  type Point,
} from "./gameLogic";
import { GameAudio } from "./gameAudio";
import Speedometer from "./Speedometer";
import type { SnakeTheme } from "./themes/types";

const GRID = 20;
const MAX_QUEUED_DIRECTIONS = 3;
/** Px de arraste para virar — reconhecido durante o movimento, sem esperar soltar. */
const SWIPE_PX = 18;
const DPR_CAP = 2;
const COUNTDOWN_BEAT_MS = 380;
/** Evita reiniciar sem querer quem ainda estava apertando teclas ao bater. */
const RESTART_COOLDOWN_MS = 650;
/** Fração do passo em que a cabeça alcança a comida (efeitos e pontuação). */
const EAT_REVEAL = 0.78;
/** Fração do passo usada para girar a cabeça numa curva. */
const TURN_PORTION = 0.45;
/**
 * Virada "atrasada": apertou logo depois de passar do centro da célula?
 * Até esta fração do passo a curva ainda vale para a célula que acabou de passar.
 */
const LATE_TURN_WINDOW = 0.3;
/** Antes de bater, segura a cobra um instante: uma virada de última hora ainda salva. */
const CRASH_GRACE_MAX_MS = 90;
/** Ao apertar, a cabeça já "olha" para a curva (fração de 90°) — resposta imediata. */
const LEAN = 0.25;
const LEAN_MS = 90;
const SHAKE_MS = 420;

type Status = "idle" | "countdown" | "playing" | "paused" | "over";

const KEY_TO_DIRECTION: Record<string, Direction> = {
  arrowup: "up",
  w: "up",
  arrowdown: "down",
  s: "down",
  arrowleft: "left",
  a: "left",
  arrowright: "right",
  d: "right",
};

const ANGLE: Record<Direction, number> = {
  right: 0,
  down: Math.PI / 2,
  left: Math.PI,
  up: -Math.PI / 2,
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  color: string;
}

interface Popup {
  x: number;
  y: number;
  text: string;
  life: number;
  max: number;
  color: string;
  size: number;
}

interface Engine {
  state: GameState;
  /** Estado antes do passo atual (para a virada atrasada). */
  prevState: GameState | null;
  prevSnake: Point[];
  queue: Direction[];
  queuedAt: number;
  status: Status;
  lastTick: number;
  tickMs: number;
  level: number;
  /** A direção do passo atual veio de um comando do jogador. */
  stepExplicit: boolean;
  angleFrom: number;
  angleTo: number;
  turnStartP: number;
  displayAngle: number;
  /** Virada atrasada: de onde a cabeça sai (em células) e em que ponto do passo. */
  headFrom: Point | null;
  headFromP: number;
  /** Ia bater: segura um instante esperando uma virada salvadora. */
  holding: boolean;
  holdAt: number;
  holdDir: Direction;
  /** Comida que a cabeça está indo pegar (efeitos quando chegar lá). */
  eating: Point | null;
  foodShownAt: number;
  playedMs: number;
  lastFrame: number;
  countdownAt: number;
  countdownBeat: number;
  resuming: boolean;
  pausedProgress: number;
  overAt: number;
  shakeUntil: number;
  particles: Particle[];
  popups: Popup[];
  /** Pontos do corpo reaproveitados a cada quadro (nada de lixo para o GC). */
  points: Point[];
}

interface View {
  size: number;
  cell: number;
  dpr: number;
  ctx: CanvasRenderingContext2D | null;
  bg: HTMLCanvasElement | null;
  head: HTMLCanvasElement | null;
  food: HTMLCanvasElement | null;
  segment: HTMLCanvasElement | null;
  font: string;
}

/** Os últimos blocos da cauda afinam um pouco (do último para o antepenúltimo). */
const TAIL_TAPER = [0.78, 0.86, 0.94];

function createEngine(): Engine {
  const state = createInitialState(GRID);
  return {
    state,
    prevState: null,
    prevSnake: state.snake,
    queue: [],
    queuedAt: 0,
    status: "idle",
    lastTick: 0,
    tickMs: tickMsForLevel(0),
    level: 0,
    stepExplicit: false,
    angleFrom: 0,
    angleTo: 0,
    turnStartP: 0,
    displayAngle: 0,
    headFrom: null,
    headFromP: 0,
    holding: false,
    holdAt: 0,
    holdDir: "right",
    eating: null,
    foodShownAt: 0,
    playedMs: 0,
    lastFrame: 0,
    countdownAt: 0,
    countdownBeat: -1,
    resuming: false,
    pausedProgress: 0,
    overAt: 0,
    shakeUntil: 0,
    particles: [],
    popups: [],
    points: [],
  };
}

/** Teclas digitadas em campos de texto nunca controlam o jogo. */
function isEditableTarget(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el || typeof el.tagName !== "string") return false;
  return (
    el.isContentEditable ||
    el.tagName === "INPUT" ||
    el.tagName === "TEXTAREA" ||
    el.tagName === "SELECT"
  );
}

function isActivatable(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return !!el && typeof el.closest === "function" && !!el.closest("button, a");
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

function easeOutBack(t: number) {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function angleDiff(a: number, b: number) {
  let d = b - a;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

/** Sprite em cache: o desenho usa 1 unidade = 1 célula, origem no centro. */
function makeSprite(
  wCells: number,
  hCells: number,
  cell: number,
  dpr: number,
  draw: (ctx: CanvasRenderingContext2D) => void,
) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.ceil(wCells * cell * dpr);
  canvas.height = Math.ceil(hCells * cell * dpr);
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.setTransform(cell * dpr, 0, 0, cell * dpr, canvas.width / 2, canvas.height / 2);
    draw(ctx);
  }
  return canvas;
}

function resizePoints(g: Engine, count: number): Point[] {
  const out = g.points;
  while (out.length < count) out.push({ x: 0, y: 0 });
  out.length = count;
  return out;
}

/** Cabeça no quadro atual (na virada atrasada, ela "corta" a curva). */
function setHeadPoint(g: Engine, cell: number, t: number, out: Point) {
  const to = g.state.snake[0];
  const x = (to.x + 0.5) * cell;
  const y = (to.y + 0.5) * cell;
  if (g.headFrom) {
    const u = clamp01((t - g.headFromP) / (1 - g.headFromP));
    out.x = lerp((g.headFrom.x + 0.5) * cell, x, u);
    out.y = lerp((g.headFrom.y + 0.5) * cell, y, u);
  } else {
    const from = g.prevSnake[0] ?? to;
    out.x = lerp((from.x + 0.5) * cell, x, t);
    out.y = lerp((from.y + 0.5) * cell, y, t);
  }
}

/**
 * Corpo contínuo: só a cabeça e a ponta da cauda deslizam; o resto fica nos
 * centros das células — por isso as curvas saem perfeitas.
 */
function pathPoints(g: Engine, cell: number, t: number): Point[] {
  const cur = g.state.snake;
  const prev = g.prevSnake;
  const out = resizePoints(g, cur.length + 1);
  setHeadPoint(g, cell, t, out[0]);
  for (let i = 1; i < cur.length; i++) {
    out[i].x = (cur[i].x + 0.5) * cell;
    out[i].y = (cur[i].y + 0.5) * cell;
  }
  const last = out.length - 1;
  const tailFrom = prev[prev.length - 1] ?? cur[cur.length - 1];
  const tailTo = cur[cur.length - 1];
  out[last].x = lerp((tailFrom.x + 0.5) * cell, (tailTo.x + 0.5) * cell, t);
  out[last].y = lerp((tailFrom.y + 0.5) * cell, (tailTo.y + 0.5) * cell, t);
  return out;
}

/**
 * Corpo em blocos: cada bloco desliza da sua célula anterior para a atual,
 * todos no mesmo ritmo — como vagões puxados pela cabeça. Ao crescer, o bloco
 * novo nasce embaixo do último e aparece conforme a fila anda.
 */
function segmentPoints(g: Engine, cell: number, t: number): Point[] {
  const cur = g.state.snake;
  const prev = g.prevSnake;
  const out = resizePoints(g, cur.length);
  setHeadPoint(g, cell, t, out[0]);
  for (let i = 1; i < cur.length; i++) {
    const to = cur[i];
    const from = prev[i] ?? to;
    out[i].x = lerp((from.x + 0.5) * cell, (to.x + 0.5) * cell, t);
    out[i].y = lerp((from.y + 0.5) * cell, (to.y + 0.5) * cell, t);
  }
  return out;
}

interface SnakeGameProps {
  theme: SnakeTheme;
  record: number;
  rank: number | null;
  /** Pausa e trava os controles (ex.: enquanto edita o cadastro). */
  suspended?: boolean;
  onGameOver: (score: number, durationMs: number) => void;
}

export default function SnakeGame({
  theme,
  record,
  rank,
  suspended = false,
  onGameOver,
}: SnakeGameProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<Engine>(createEngine());
  const viewRef = useRef<View>({
    size: 0,
    cell: 0,
    dpr: 1,
    ctx: null,
    bg: null,
    head: null,
    food: null,
    segment: null,
    font: "sans-serif",
  });
  const themeRef = useRef(theme);
  const audioRef = useRef<GameAudio | null>(null);
  const recordRef = useRef(record);
  const suspendedRef = useRef(suspended);
  const onGameOverRef = useRef(onGameOver);
  const reduceMotionRef = useRef(false);
  const touchRef = useRef<{ x: number; y: number; swiped: boolean } | null>(null);

  const [status, setStatusState] = useState<Status>("idle");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [finalScore, setFinalScore] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [boardSize, setBoardSize] = useState(0);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    recordRef.current = record;
    onGameOverRef.current = onGameOver;
  }, [record, onGameOver]);

  const copy = theme.copy;

  /* ───────────── Ações ───────────── */

  function setStatus(next: Status) {
    engineRef.current.status = next;
    setStatusState(next);
  }

  function startCountdown() {
    const g = engineRef.current;
    g.countdownAt = performance.now();
    g.countdownBeat = -1;
    setCountdown(3);
    setStatus("countdown");
  }

  function bringIntoView() {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    if (rect.top < 80 || rect.bottom > window.innerHeight) {
      card.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function newGame() {
    const g = engineRef.current;
    const { lastFrame, points } = g;
    Object.assign(g, createEngine(), { lastFrame, points });
    setScore(0);
    setLevel(0);
    startCountdown();
    bringIntoView();
  }

  function pause() {
    const g = engineRef.current;
    if (g.status === "playing") {
      g.pausedProgress = Math.min((performance.now() - g.lastTick) / g.tickMs, 0.999);
    } else if (g.status === "countdown") {
      // Aba escondida ou cadastro aberto na contagem: não larga sozinho.
      if (!g.resuming) g.pausedProgress = 0;
    } else {
      return;
    }
    g.resuming = false;
    g.queue = [];
    audioRef.current?.stopMusic();
    setStatus("paused");
  }

  function resume() {
    const g = engineRef.current;
    if (g.status !== "paused") return;
    g.resuming = true;
    startCountdown();
  }

  function primaryAction(source: "key" | "tap") {
    const g = engineRef.current;
    if (suspendedRef.current) return;
    switch (g.status) {
      case "idle":
        newGame();
        break;
      case "playing":
        // Toque no tabuleiro não pausa: arraste curto viraria pausa sem querer.
        if (source === "key") pause();
        break;
      case "paused":
        resume();
        break;
      case "over":
        if (performance.now() - g.overAt > RESTART_COOLDOWN_MS) newGame();
        break;
    }
  }

  function queueDirection(dir: Direction) {
    const g = engineRef.current;
    const queue = g.queue;
    const last = queue.length > 0 ? queue[queue.length - 1] : g.state.direction;
    if (dir === last || isOpposite(last, dir)) return;
    if (queue.length >= MAX_QUEUED_DIRECTIONS) return;
    if (queue.length === 0) g.queuedAt = performance.now();
    queue.push(dir);
  }

  /** Seta, swipe ou D-pad — também começa/retoma o jogo. */
  function directionInput(dir: Direction, fresh: boolean) {
    const g = engineRef.current;
    if (suspendedRef.current) return;
    if (g.status === "idle") newGame();
    else if (g.status === "paused") resume();
    else if (g.status === "over") {
      if (!fresh || performance.now() - g.overAt < RESTART_COOLDOWN_MS) return;
      newGame();
    }
    const now = performance.now();
    if (lateTurn(dir, now)) return;
    queueDirection(dir);
    // Prestes a bater e veio uma virada: resolve agora, sem esperar o próximo quadro.
    if (g.holding) resolveHold(now);
  }

  /* ───────────── Passos do jogo ───────────── */

  function applyStep(prev: GameState, next: GameState, explicit: boolean, ease = true) {
    const g = engineRef.current;
    g.angleFrom = g.displayAngle;
    g.angleTo = ANGLE[next.direction];
    g.turnStartP = 0;
    g.headFrom = null;
    g.prevState = prev;
    g.prevSnake = prev.snake;
    g.state = next;
    g.stepExplicit = explicit;
    g.eating = next.score > prev.score ? prev.food : null;
    // Acelera aos poucos: cada passo cobre 35% da diferença até o novo nível.
    if (ease) g.tickMs += (tickMsForLevel(levelForScore(next.score)) - g.tickMs) * 0.35;
  }

  function tick(now: number) {
    const g = engineRef.current;
    if (g.eating) revealEat(now);
    const prev = g.state;
    const queued = g.queue.shift();
    const dir = queued ?? prev.direction;
    const next = step(prev, dir);
    if (next.gameOver) {
      g.holding = true;
      g.holdAt = now;
      g.holdDir = dir;
      return;
    }
    applyStep(prev, next, queued !== undefined);
  }

  /** Durante a tolerância da batida: uma virada válida salva; senão, bate. */
  function resolveHold(now: number) {
    const g = engineRef.current;
    while (g.queue.length > 0) {
      const dir = g.queue.shift() as Direction;
      const rescue = step(g.state, dir);
      if (!rescue.gameOver) {
        g.holding = false;
        g.lastTick = now;
        applyStep(g.state, rescue, true);
        return;
      }
    }
    if (now - g.holdAt >= Math.min(CRASH_GRACE_MAX_MS, g.tickMs * 0.55)) {
      g.holding = false;
      g.state = step(g.state, g.holdDir);
      endGame(now);
    }
  }

  /**
   * Apertou um pouco depois de a cabeça passar do centro da célula? Refaz o
   * passo atual já virando — em vez de andar mais uma casa antes da curva.
   */
  function lateTurn(dir: Direction, now: number): boolean {
    const g = engineRef.current;
    const base = g.prevState;
    if (g.status !== "playing" || g.holding || !base) return false;
    if (g.queue.length > 0 || g.stepExplicit) return false;
    const p = (now - g.lastTick) / g.tickMs;
    if (p < 0 || p > LATE_TURN_WINDOW) return false;
    if (dir === g.state.direction || isOpposite(base.direction, dir)) return false;
    const alt = step(base, dir);
    if (alt.gameOver) return false;

    const from = base.snake[0];
    const to = g.state.snake[0];
    applyStep(base, alt, true, false);
    g.headFrom = { x: lerp(from.x, to.x, p), y: lerp(from.y, to.y, p) };
    g.headFromP = p;
    g.turnStartP = p;
    return true;
  }

  /* ───────────── Efeitos ───────────── */

  function burst(x: number, y: number, count: number, colors: string[], power: number) {
    const g = engineRef.current;
    const { cell } = viewRef.current;
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const speed = (0.5 + Math.random() * 1.2) * cell * 0.006 * power;
      const life = 450 + Math.random() * 450;
      g.particles.push({
        x,
        y,
        vx: Math.cos(a) * speed,
        vy: Math.sin(a) * speed - cell * 0.002,
        life,
        max: life,
        size: cell * (0.07 + Math.random() * 0.09),
        color: colors[i % colors.length],
      });
    }
  }

  function popup(x: number, y: number, text: string, color: string, size: number, life = 750) {
    engineRef.current.popups.push({ x, y, text, color, size, life, max: life });
  }

  /** A cabeça chegou na comida: som, pontos, efeitos e a próxima comida. */
  function revealEat(now: number) {
    const g = engineRef.current;
    const food = g.eating;
    if (!food) return;
    g.eating = null;
    g.foodShownAt = now;
    audioRef.current?.play("eat");
    const { cell } = viewRef.current;
    const x = (food.x + 0.5) * cell;
    const y = (food.y + 0.5) * cell;
    burst(x, y, reduceMotionRef.current ? 5 : 14, themeRef.current.renderer.particleColors, 1);
    popup(x, y - cell * 0.4, "+1", "#ffffff", cell * 0.62);

    const total = g.state.score;
    setScore(total);
    const nextLevel = levelForScore(total);
    if (nextLevel !== g.level) {
      const gained = kmhForLevel(nextLevel) - kmhForLevel(g.level);
      g.level = nextLevel;
      setLevel(nextLevel);
      popup(
        x,
        y - cell * 1.15,
        nextLevel >= MAX_LEVEL ? "Velocidade máxima!" : `+${gained} km/h`,
        "#fde68a",
        cell * 0.5,
        1100,
      );
    }
  }

  function endGame(now: number) {
    const g = engineRef.current;
    if (g.eating) revealEat(now);
    audioRef.current?.stopMusic();
    audioRef.current?.play("crash");
    g.overAt = now;
    g.shakeUntil = reduceMotionRef.current ? 0 : now + SHAKE_MS;
    const { cell } = viewRef.current;
    const head = g.state.snake[0];
    const angle = ANGLE[g.state.direction];
    burst(
      (head.x + 0.5) * cell + Math.cos(angle) * cell * 0.55,
      (head.y + 0.5) * cell + Math.sin(angle) * cell * 0.55,
      reduceMotionRef.current ? 8 : 26,
      themeRef.current.renderer.crashColors,
      1.5,
    );
    const total = g.state.score;
    setFinalScore(total);
    setNewRecord(total > recordRef.current);
    setStatus("over");
    try {
      navigator.vibrate?.(50);
    } catch {
      // sem vibração (iOS/desktop)
    }
    onGameOverRef.current(total, Math.round(g.playedMs));
  }

  /* ───────────── Desenho ───────────── */

  function draw(now: number, progress: number, dt: number) {
    const v = viewRef.current;
    const ctx = v.ctx;
    if (!ctx || !v.bg || !v.head || !v.food || v.size === 0) return;
    const g = engineRef.current;
    const r = themeRef.current.renderer;
    const { size, cell, dpr } = v;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (now < g.shakeUntil) {
      const k = (g.shakeUntil - now) / SHAKE_MS;
      ctx.translate((Math.random() - 0.5) * cell * 0.5 * k, (Math.random() - 0.5) * cell * 0.5 * k);
      ctx.drawImage(v.bg, -cell, -cell, size + cell * 2, size + cell * 2);
    } else {
      ctx.drawImage(v.bg, 0, 0, size, size);
    }

    // Comida (a anterior continua no lugar até a cabeça chegar nela)
    const food = g.eating ?? g.state.food;
    let scale = 1;
    if (!g.eating) {
      const t = (now - g.foodShownAt) / 320;
      if (t < 1) scale = Math.max(0, easeOutBack(t));
    }
    const foodPx = r.foodSize * cell * scale * (1 + Math.sin(now / 300) * 0.05);
    if (foodPx > 0) {
      ctx.drawImage(
        v.food,
        (food.x + 0.5) * cell - foodPx / 2,
        (food.y + 0.5) * cell - foodPx / 2,
        foodPx,
        foodPx,
      );
    }

    const segmentSprite = r.bodyStyle === "segments" ? v.segment : null;
    const points = segmentSprite
      ? segmentPoints(g, cell, progress)
      : pathPoints(g, cell, progress);
    r.drawBody(ctx, points, cell, now);
    if (segmentSprite) {
      // Da cauda para a cabeça: os blocos da frente ficam por cima.
      const base = (r.segmentSize ?? 1) * cell;
      for (let i = points.length - 1; i >= 1; i--) {
        const fromTail = points.length - 1 - i;
        const size = base * (TAIL_TAPER[fromTail] ?? 1);
        ctx.drawImage(segmentSprite, points[i].x - size / 2, points[i].y - size / 2, size, size);
      }
    }

    // Cabeça: gira na curva e já "olha" para a próxima virada pedida.
    const turn = easeOutCubic(clamp01((progress - g.turnStartP) / TURN_PORTION));
    let angle = g.angleFrom + angleDiff(g.angleFrom, g.angleTo) * turn;
    const upcoming = g.status === "playing" && !g.holding ? g.queue[0] : undefined;
    if (upcoming) {
      const diff = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, angleDiff(angle, ANGLE[upcoming])));
      angle += diff * LEAN * easeOutCubic(clamp01((now - g.queuedAt) / LEAN_MS));
    }
    g.displayAngle = angle;

    const hw = r.headSize.w * cell;
    const hh = r.headSize.h * cell;
    ctx.save();
    ctx.translate(points[0].x, points[0].y);
    ctx.rotate(angle);
    ctx.drawImage(v.head, -hw / 2, -hh / 2, hw, hh);
    ctx.restore();
    r.drawHeadOverlay?.(ctx, points[0].x, points[0].y, angle, cell, now, v.font);

    // Partículas
    if (g.particles.length > 0) {
      const gravity = r.particleGravity * cell;
      const drag = Math.pow(0.985, dt / 16);
      let alive = 0;
      for (const p of g.particles) {
        p.life -= dt;
        if (p.life <= 0) continue;
        p.vy += gravity * dt;
        p.vx *= drag;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        ctx.globalAlpha = Math.min(1, p.life / p.max + 0.15);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        g.particles[alive++] = p;
      }
      ctx.globalAlpha = 1;
      g.particles.length = alive;
    }

    // Textos que sobem (+1, +4 km/h, "Ka-chow!")
    if (g.popups.length > 0) {
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      let alive = 0;
      for (const p of g.popups) {
        p.life -= dt;
        if (p.life <= 0) continue;
        const t = 1 - p.life / p.max;
        const y = p.y - t * cell * 0.9;
        const pop = t < 0.15 ? easeOutBack(t / 0.15) : 1;
        ctx.globalAlpha = Math.min(1, (p.life / p.max) * 2);
        ctx.font = `800 ${p.size * pop}px ${v.font}`;
        ctx.lineWidth = Math.max(2, p.size * 0.16);
        ctx.strokeStyle = "rgba(0,0,0,0.55)";
        ctx.strokeText(p.text, p.x, y);
        ctx.fillStyle = p.color;
        ctx.fillText(p.text, p.x, y);
        g.popups[alive++] = p;
      }
      ctx.globalAlpha = 1;
      g.popups.length = alive;
    }
  }

  /* ───────────── Loop principal (rAF + passo fixo) ───────────── */

  useEffect(() => {
    let raf = 0;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const g = engineRef.current;
      const dt = g.lastFrame ? Math.min(now - g.lastFrame, 64) : 16;
      g.lastFrame = now;

      if (g.status === "countdown") {
        const beat = Math.floor((now - g.countdownAt) / COUNTDOWN_BEAT_MS);
        if (beat !== g.countdownBeat) {
          g.countdownBeat = beat;
          if (beat < 3) {
            // A luz do semáforo acende no mesmo quadro em que o bipe sai.
            flushSync(() => setCountdown(3 - beat));
            audioRef.current?.play("countdown");
          }
        }
        if (beat >= 3) {
          const resumed = g.resuming;
          g.lastTick = resumed ? now - g.pausedProgress * g.tickMs : now;
          g.resuming = false;
          if (g.holding) g.holdAt = now;
          setStatus("playing");
          audioRef.current?.startMusic();
          if (!resumed) {
            const { size, cell } = viewRef.current;
            popup(size / 2, size / 2, themeRef.current.copy.goText, "#ffffff", cell * 1.4, 650);
          }
        }
      }

      let progress = 1;
      if (g.status === "playing") {
        g.playedMs += dt;
        if (g.holding) {
          resolveHold(now);
        } else if (now - g.lastTick >= g.tickMs) {
          // Cadência estável: avança pelo tempo do passo, não pelo quadro.
          g.lastTick = now - g.lastTick > g.tickMs * 2 ? now : g.lastTick + g.tickMs;
          tick(now);
        }
        if (g.status === "playing" && !g.holding) {
          progress = Math.min((now - g.lastTick) / g.tickMs, 1);
        }
      } else if (g.status === "paused" || (g.status === "countdown" && g.resuming)) {
        progress = g.pausedProgress;
      }

      if (g.eating && progress >= EAT_REVEAL) revealEat(now);
      draw(now, progress, dt);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ───────────── Tamanho, nitidez (DPR) e sprites em cache ───────────── */

  useEffect(() => {
    themeRef.current = theme;
    const board = boardRef.current;
    const canvas = canvasRef.current;
    if (!board || !canvas) return;
    const v = viewRef.current;
    v.font = getComputedStyle(document.body).fontFamily || "sans-serif";

    const build = () => {
      const size = Math.floor(board.clientWidth);
      if (size <= 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const r = themeRef.current.renderer;
      v.size = size;
      v.cell = size / GRID;
      v.dpr = dpr;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      v.ctx = canvas.getContext("2d", { alpha: false });

      const bg = document.createElement("canvas");
      bg.width = canvas.width;
      bg.height = canvas.height;
      const bgCtx = bg.getContext("2d");
      if (bgCtx) {
        bgCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
        r.drawBoard(bgCtx, size, v.cell, GRID);
      }
      v.bg = bg;
      v.head = makeSprite(r.headSize.w, r.headSize.h, v.cell, dpr, r.drawHead);
      v.food = makeSprite(r.foodSize, r.foodSize, v.cell, dpr, r.drawFood);
      v.segment = r.drawSegment
        ? makeSprite(r.segmentSize ?? 1, r.segmentSize ?? 1, v.cell, dpr, r.drawSegment)
        : null;
      setBoardSize(size);
    };

    build();
    const observer = new ResizeObserver(build);
    observer.observe(board);
    return () => observer.disconnect();
  }, [theme]);

  /* ───────────── Áudio do tema ───────────── */

  useEffect(() => {
    if (!theme.audio) return;
    const audio = new GameAudio(theme.audio);
    audio.preload();
    audioRef.current = audio;
    setMuted(audio.muted);

    // Navegadores só liberam som num gesto: libera no primeiro toque/tecla.
    const unlock = () => audio.unlock();
    const events = ["pointerdown", "touchend", "keydown", "click"] as const;
    for (const type of events) window.addEventListener(type, unlock, { capture: true, passive: true });
    return () => {
      for (const type of events) window.removeEventListener(type, unlock, { capture: true });
      audio.dispose();
      if (audioRef.current === audio) audioRef.current = null;
    };
  }, [theme]);

  function toggleMute() {
    const next = !muted;
    audioRef.current?.setMuted(next);
    setMuted(next);
  }

  /* ───────────── Teclado, aba oculta, movimento reduzido ───────────── */

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Digitando nome/telefone, atalhos do sistema: o jogo não reage.
      if (isEditableTarget(e.target) || e.ctrlKey || e.metaKey || e.altKey) return;
      const key = e.key?.toLowerCase();
      if (!key) return;

      const dir = KEY_TO_DIRECTION[key];
      if (dir) {
        e.preventDefault();
        directionInput(dir, !e.repeat);
        return;
      }
      if (key === " " || key === "enter") {
        // Em botão focado, o próprio botão responde (evita ação dupla).
        if (e.repeat || isActivatable(e.target)) return;
        e.preventDefault();
        primaryAction("key");
        return;
      }
      if ((key === "escape" || key === "p") && engineRef.current.status === "playing") {
        e.preventDefault();
        pause();
      }
    }

    function onVisibility() {
      if (document.hidden) pause();
    }

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => (reduceMotionRef.current = motion.matches);
    syncMotion();

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("visibilitychange", onVisibility);
    motion.addEventListener("change", syncMotion);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("visibilitychange", onVisibility);
      motion.removeEventListener("change", syncMotion);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    suspendedRef.current = suspended;
    if (suspended) pause();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suspended]);

  /* ───────────── Toque ───────────── */

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY, swiped: false };
  }

  function onTouchMove(e: React.TouchEvent) {
    const start = touchRef.current;
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return;
    const dir: Direction =
      Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up";
    directionInput(dir, true);
    // Recomeça a medir daqui: dá para encadear curvas sem tirar o dedo.
    touchRef.current = { x: t.clientX, y: t.clientY, swiped: true };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchRef.current;
    touchRef.current = null;
    if (!start || start.swiped || isActivatable(e.target)) return;
    primaryAction("tap");
  }

  function onPointerUp(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && !isActivatable(e.target)) primaryAction("tap");
  }

  const kmh = kmhForLevel(level);
  const framePad = theme.id === "classic" ? 14 : 9;

  return (
    <div ref={cardRef} className="sk-card sk-game scroll-mt-24">
      <div className="sk-hud">
        <Stat label={copy.scoreLabel} value={score} strong />
        <Stat label="Recorde" value={Math.max(record, score)} />
        <Speedometer kmh={kmh} maxKmh={MAX_KMH} level={level} maxLevel={MAX_LEVEL} />
        <div className="sk-hud__actions">
          {theme.audio && (
            <button
              type="button"
              className="sk-icon-btn"
              aria-label={muted ? "Ligar o som" : "Desligar o som"}
              aria-pressed={muted}
              onClick={toggleMute}
            >
              {muted ? <IoVolumeMute size={18} /> : <IoVolumeHigh size={18} />}
            </button>
          )}
          <button
            type="button"
            className="sk-icon-btn"
            aria-label={status === "playing" ? "Pausar" : "Jogar"}
            onClick={() => (status === "playing" ? pause() : primaryAction("tap"))}
          >
            {status === "playing" ? <IoPause size={18} /> : <IoPlay size={18} />}
          </button>
        </div>
      </div>

      <div className={`sk-board sk-board--${theme.id}`} style={{ padding: framePad }}>
        {theme.id === "classic" && <MarqueeBulbs inner={boardSize} pad={framePad} />}
        <div
          ref={boardRef}
          className="sk-board__inner"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onPointerUp={onPointerUp}
        >
          <canvas ref={canvasRef} className="sk-board__canvas" />

          {status === "idle" && (
            <Overlay>
              <button
                type="button"
                className="sk-btn sk-btn--primary"
                onClick={() => primaryAction("tap")}
              >
                <IoPlay size={18} /> Jogar
              </button>
              <p className="sk-overlay__title">{copy.startTitle}</p>
              <p className="sk-overlay__hint">{copy.startHint}</p>
            </Overlay>
          )}

          {status === "countdown" && <Countdown kind={theme.countdown} value={countdown} />}

          {status === "paused" && (
            <Overlay>
              <p className="sk-overlay__title">Pausado</p>
              <button type="button" className="sk-btn sk-btn--primary" onClick={resume}>
                <IoPlay size={18} /> Continuar
              </button>
              <p className="sk-overlay__hint">Espaço, seta ou toque para continuar</p>
            </Overlay>
          )}

          {status === "over" && (
            <Overlay>
              <p className="sk-overlay__eyebrow">{copy.gameOverTitle}</p>
              <p className="sk-overlay__score">{finalScore}</p>
              <p className={`sk-overlay__record${newRecord ? " is-new" : ""}`}>
                {newRecord ? "Novo recorde!" : `Seu recorde: ${Math.max(record, finalScore)}`}
              </p>
              {rank !== null && <p className="sk-overlay__hint">Você está em #{rank}</p>}
              <button
                type="button"
                className="sk-btn sk-btn--primary"
                onClick={() => primaryAction("tap")}
              >
                <IoRefresh size={18} /> Jogar de novo
              </button>
            </Overlay>
          )}
        </div>
      </div>

      <div className="sk-dpad" aria-label="Controles">
        <span />
        <DPadButton label="Para cima" onPress={() => directionInput("up", true)}>
          <IoChevronUp size={26} />
        </DPadButton>
        <span />
        <DPadButton label="Para a esquerda" onPress={() => directionInput("left", true)}>
          <IoChevronBack size={26} />
        </DPadButton>
        <DPadButton label="Para baixo" onPress={() => directionInput("down", true)}>
          <IoChevronDown size={26} />
        </DPadButton>
        <DPadButton label="Para a direita" onPress={() => directionInput("right", true)}>
          <IoChevronForward size={26} />
        </DPadButton>
      </div>

      <p className="sk-keys hidden lg:block">
        Setas ou WASD para virar · Espaço para pausar
      </p>
    </div>
  );
}

function Stat({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="sk-stat">
      <span className="sk-stat__label">{label}</span>
      <span className={`sk-stat__value${strong ? " is-strong" : ""}`}>{value}</span>
    </div>
  );
}

function Overlay({ children }: { children: ReactNode }) {
  return <div className="sk-overlay">{children}</div>;
}

/** Contagem antes de largar: "pontinha de filme" no clássico, semáforo no Carros. */
function Countdown({ kind, value }: { kind: "film" | "lights"; value: number }) {
  if (kind === "lights") {
    const lit = 4 - value;
    return (
      <div className="sk-countdown">
        <div className="sk-lights">
          {[1, 2, 3].map((n) => (
            <span key={n} className={`sk-light${n <= lit ? " is-on" : ""}`} />
          ))}
        </div>
        <p className="sk-overlay__hint">Prepare-se…</p>
      </div>
    );
  }
  return (
    <div className="sk-countdown">
      <div key={value} className="sk-film">
        <span className="sk-film__sweep" />
        <span className="sk-film__number">{value}</span>
      </div>
    </div>
  );
}

/** Lâmpadas de marquise de cinema em volta do tabuleiro (tema clássico). */
function MarqueeBulbs({ inner, pad }: { inner: number; pad: number }) {
  if (inner <= 0) return null;
  const outer = inner + pad * 2;
  const inset = pad / 2;
  const span = outer - inset * 2;
  const count = Math.max(4, Math.round(span / 22));
  const gap = span / count;
  const bulbs: { x: number; y: number; phase: number }[] = [];
  for (let i = 0; i < count; i++) {
    const d = i * gap;
    const phase = i % 2;
    bulbs.push({ x: inset + d, y: inset, phase });
    bulbs.push({ x: outer - inset, y: inset + d, phase });
    bulbs.push({ x: outer - inset - d, y: outer - inset, phase });
    bulbs.push({ x: inset, y: outer - inset - d, phase });
  }
  return (
    <svg
      aria-hidden="true"
      className="sk-bulbs"
      width={outer}
      height={outer}
      viewBox={`0 0 ${outer} ${outer}`}
    >
      {bulbs.map((b, i) => (
        <circle
          key={i}
          cx={b.x}
          cy={b.y}
          r={2.7}
          className={b.phase ? "sk-bulb sk-bulb--b" : "sk-bulb sk-bulb--a"}
        />
      ))}
    </svg>
  );
}

function DPadButton({
  label,
  onPress,
  children,
}: {
  label: string;
  onPress: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="sk-dpad__btn"
      onPointerDown={(e) => {
        // Responde no toque (não espera o "click" ao soltar o dedo).
        e.preventDefault();
        onPress();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onPress();
        }
      }}
    >
      {children}
    </button>
  );
}

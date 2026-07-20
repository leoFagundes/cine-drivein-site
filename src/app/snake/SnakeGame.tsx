"use client";

import { useEffect, useRef, useState } from "react";
import { IoPlay, IoPause } from "react-icons/io5";
import {
  IoChevronUp,
  IoChevronDown,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import {
  createInitialState,
  isOpposite,
  step,
  tickDurationForScore,
  type Direction,
  type GameState,
  type Point,
} from "./gameLogic";

const MAX_QUEUED_DIRECTIONS = 2;
const SWIPE_THRESHOLD = 24; // px mínimos pra contar como um swipe, não um toque

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

const GRID_SIZE = 20;
const CELL = 22;
const SIZE = GRID_SIZE * CELL;

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

type Status = "idle" | "playing" | "paused" | "over";

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
  onGameOver: (finalScore: number) => void;
}

export default function SnakeGame({ onScoreChange, onGameOver }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatusState] = useState<Status>("idle");
  const [displayScore, setDisplayScore] = useState(0);

  const initialState = createInitialState(GRID_SIZE);
  const statusRef = useRef<Status>("idle");
  const stateRef = useRef<GameState>(initialState);
  const prevSnakeRef = useRef<Point[]>(initialState.snake);
  const directionQueueRef = useRef<Direction[]>([]);
  const lastTickRef = useRef<number | null>(null);
  const lastReportedScoreRef = useRef(0);
  const rafRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const onScoreChangeRef = useRef(onScoreChange);
  const onGameOverRef = useRef(onGameOver);
  useEffect(() => {
    onScoreChangeRef.current = onScoreChange;
    onGameOverRef.current = onGameOver;
  }, [onScoreChange, onGameOver]);

  function queueDirection(dir: Direction) {
    const queue = directionQueueRef.current;
    const effectiveCurrent =
      queue.length > 0 ? queue[queue.length - 1] : stateRef.current.direction;
    if (dir === effectiveCurrent || isOpposite(effectiveCurrent, dir)) return;
    if (queue.length >= MAX_QUEUED_DIRECTIONS) return;
    queue.push(dir);
  }

  function reportScore(newScore: number) {
    lastReportedScoreRef.current = newScore;
    setDisplayScore(newScore);
    onScoreChangeRef.current(newScore);
  }

  function setStatus(next: Status) {
    statusRef.current = next;
    setStatusState(next);
  }

  function startGame() {
    setStatus("playing");
    lastTickRef.current = null;
  }

  function pauseGame() {
    if (statusRef.current !== "playing") return;
    directionQueueRef.current = [];
    setStatus("paused");
  }

  function resumeGame() {
    if (statusRef.current !== "paused") return;
    prevSnakeRef.current = stateRef.current.snake;
    setStatus("playing");
    lastTickRef.current = null;
  }

  function restartGame() {
    stateRef.current = createInitialState(GRID_SIZE);
    prevSnakeRef.current = stateRef.current.snake;
    directionQueueRef.current = [];
    lastTickRef.current = null;
    reportScore(0);
    setStatus("playing");
  }

  function handlePrimaryAction() {
    switch (statusRef.current) {
      case "idle":
        startGame();
        break;
      case "playing":
        pauseGame();
        break;
      case "paused":
        resumeGame();
        break;
      case "over":
        restartGame();
        break;
    }
  }

  /** Botão de direção (D-pad) ou swipe — também dá o start no primeiro toque. */
  function handleDirectionInput(dir: Direction) {
    queueDirection(dir);
    if (statusRef.current === "idle") startGame();
  }

  function handleTouchStart(e: React.TouchEvent<HTMLDivElement>) {
    const t = e.touches[0];
    touchStartRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLDivElement>) {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_THRESHOLD) return;

    const dir: Direction =
      Math.abs(dx) > Math.abs(dy)
        ? dx > 0
          ? "right"
          : "left"
        : dy > 0
          ? "down"
          : "up";
    handleDirectionInput(dir);
  }

  // ── Loop principal (rAF único, com acumulador de tempo) ──
  useEffect(() => {
    function draw(progress: number, timestamp: number) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      const s = stateRef.current;
      const prevSnake = prevSnakeRef.current;
      ctx.clearRect(0, 0, SIZE, SIZE);

      // Grid sutil (tom escuro discreto — o fundo aqui é claro)
      ctx.strokeStyle = "rgba(30,41,59,0.05)";
      ctx.lineWidth = 1;
      for (let i = 1; i < GRID_SIZE; i++) {
        ctx.beginPath();
        ctx.moveTo(i * CELL, 0);
        ctx.lineTo(i * CELL, SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * CELL);
        ctx.lineTo(SIZE, i * CELL);
        ctx.stroke();
      }

      // Comida — pipoca âmbar, com leve pulso
      const pulse = statusRef.current === "playing" ? Math.sin(timestamp / 260) : 0;
      const fx = s.food.x * CELL + CELL / 2;
      const fy = s.food.y * CELL + CELL / 2;
      ctx.save();
      ctx.shadowColor = "rgba(245,158,11,0.55)";
      ctx.shadowBlur = 7 + pulse * 3;
      ctx.fillStyle = "#f59e0b";
      ctx.beginPath();
      ctx.arc(fx, fy, CELL * 0.24 + pulse * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Cobra — cada segmento desliza suavemente da posição anterior até a atual
      s.snake.forEach((seg, i) => {
        const from = prevSnake[i] ?? prevSnake[prevSnake.length - 1] ?? seg;
        const gx = lerp(from.x, seg.x, progress);
        const gy = lerp(from.y, seg.y, progress);
        const x = gx * CELL + 1.5;
        const y = gy * CELL + 1.5;
        const w = CELL - 3;
        const isHead = i === 0;

        ctx.fillStyle = isHead ? "#28a9e0" : "#0088c2";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, w, w, isHead ? 7 : 5);
        } else {
          ctx.rect(x, y, w, w);
        }
        ctx.fill();
      });
    }

    function loop(timestamp: number) {
      rafRef.current = requestAnimationFrame(loop);

      let progress = 1;

      if (statusRef.current === "playing") {
        if (lastTickRef.current === null) lastTickRef.current = timestamp;
        const elapsed = timestamp - lastTickRef.current;
        const tickDuration = tickDurationForScore(stateRef.current.score);
        progress = Math.min(elapsed / tickDuration, 1);

        if (elapsed >= tickDuration) {
          lastTickRef.current = timestamp;
          prevSnakeRef.current = stateRef.current.snake;
          const nextDirection =
            directionQueueRef.current.shift() ?? stateRef.current.direction;
          stateRef.current = step(stateRef.current, nextDirection);
          progress = 0;

          if (stateRef.current.score !== lastReportedScoreRef.current) {
            reportScore(stateRef.current.score);
          }

          if (stateRef.current.gameOver) {
            progress = 1;
            setStatus("over");
            onGameOverRef.current(stateRef.current.score);
          }
        }
      }

      draw(progress, timestamp);
    }

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Teclado ──
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const key = e.key.toLowerCase();

      if (key in KEY_TO_DIRECTION) {
        e.preventDefault();
        handleDirectionInput(KEY_TO_DIRECTION[key]);
        return;
      }

      if (key === " ") {
        e.preventDefault();
        handlePrimaryAction();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Pausa automática ao sair da aba ──
  useEffect(() => {
    function onVisibility() {
      if (document.hidden) pauseGame();
    }
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative rounded-2xl overflow-hidden cursor-pointer select-none"
        style={{
          width: "100%",
          maxWidth: SIZE,
          aspectRatio: "1 / 1",
          backgroundColor: "#fafaf9",
          border: "1px solid #e7e5e4",
          boxShadow: "0 8px 24px rgba(15,23,42,0.06)",
        }}
        onClick={handlePrimaryAction}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {status !== "playing" && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center px-6"
            style={{ backgroundColor: "rgba(250,250,249,0.85)" }}
          >
            {status === "idle" && (
              <>
                <IoPlay size={26} style={{ color: "var(--color-primary)" }} />
                <p className="text-sm font-semibold text-stone-800">
                  Toque, arraste ou use as setas pra começar
                </p>
                <p className="text-xs text-stone-500">
                  Setas/WASD no teclado · swipe ou os botões no celular
                </p>
              </>
            )}
            {status === "paused" && (
              <>
                <IoPause size={26} style={{ color: "var(--color-primary)" }} />
                <p className="text-sm font-semibold text-stone-800">Pausado</p>
                <p className="text-xs text-stone-500">
                  Espaço ou toque para continuar
                </p>
              </>
            )}
            {status === "over" && (
              <>
                <p className="text-lg font-bold text-stone-900 tracking-wide">
                  Fim de jogo
                </p>
                <p className="text-sm text-stone-500">Pontuação: {displayScore}</p>
                <p className="text-xs mt-1 text-stone-500">
                  Espaço ou toque para jogar novamente
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Cruzeta de toque — só em telas pequenas, teclado já cobre o desktop */}
      <div className="grid grid-cols-3 gap-2 w-40 lg:hidden">
        <div />
        <DPadButton icon={<IoChevronUp size={18} />} onPress={() => handleDirectionInput("up")} />
        <div />
        <DPadButton icon={<IoChevronBack size={18} />} onPress={() => handleDirectionInput("left")} />
        <DPadButton icon={<IoChevronDown size={18} />} onPress={() => handleDirectionInput("down")} />
        <DPadButton
          icon={<IoChevronForward size={18} />}
          onPress={() => handleDirectionInput("right")}
        />
      </div>
    </div>
  );
}

function DPadButton({
  icon,
  onPress,
}: {
  icon: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onPress();
      }}
      aria-label="Mover"
      className="flex items-center justify-center h-11 rounded-xl bg-white border border-stone-200 text-stone-600 active:bg-stone-100"
    >
      {icon}
    </button>
  );
}

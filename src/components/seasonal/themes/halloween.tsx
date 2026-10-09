"use client";

import { useId, useMemo } from "react";
import type { SeasonalDecor } from "../types";
import {
  Flyer,
  Motion,
  Particles,
  SceneLayer,
  createRandom,
  useIsWide,
  type CSSVars,
} from "../shared";

const INK = "#2a2233";

/* ───────────── Morcego: asas e corpo em camadas separadas para bater no compositor ───────────── */

const BAT_BODY =
  "M46.5 13L45.2 5L48.6 11.2Q50 10.6 51.4 11.2L54.8 5L53.5 13C56.2 15 56.2 19 54.6 21.2C56.4 25.5 55.2 31.5 50 35.5C44.8 31.5 43.6 25.5 45.4 21.2C43.8 19 43.8 15 46.5 13Z";
const BAT_WING_L =
  "M46 19.5C39 11 31 6.5 24.5 6.5C17 6.5 9 9.5 2 14.5Q9.5 14.5 12 22Q17 17.5 22 22.5Q28 20 32 26.5Q38.5 23.5 45.5 28.5Z";
const BAT_WING_R =
  "M54 19.5C61 11 69 6.5 75.5 6.5C83 6.5 91 9.5 98 14.5Q90.5 14.5 88 22Q83 17.5 78 22.5Q72 20 68 26.5Q61.5 23.5 54.5 28.5Z";

function Bat({ width, flap = 0.2 }: { width: number; flap?: number }) {
  return (
    <span
      className="sz-bat"
      style={{ "--bat-w": `${width}px`, "--flap": `${flap}s` } as CSSVars}
    >
      <svg viewBox="0 0 100 50" className="sz-bat__wing sz-bat__wing--l">
        <path d={BAT_WING_L} />
      </svg>
      <svg viewBox="0 0 100 50" className="sz-bat__wing sz-bat__wing--r">
        <path d={BAT_WING_R} />
      </svg>
      <svg viewBox="0 0 100 50" className="sz-bat__body">
        <path d={BAT_BODY} />
        <circle cx="48.2" cy="16.4" r="1.15" fill="#ffb02e" />
        <circle cx="51.8" cy="16.4" r="1.15" fill="#ffb02e" />
      </svg>
    </span>
  );
}

/* ───────────── Teia de canto (gerada: raios + fios que cedem em direção ao centro) ───────────── */

function cobwebPath(seed: number) {
  const rand = createRandom(seed);
  const point = (r: number, deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(r * Math.cos(a)).toFixed(1)} ${(r * Math.sin(a)).toFixed(1)}`;
  };
  const angles = [2, 18, 35, 53, 71, 88].map((a, i, all) =>
    i === 0 || i === all.length - 1 ? a : a + (rand() - 0.5) * 6,
  );

  let d = "";
  for (const a of angles) d += `M0 0L${point(99, a)}`;
  for (const base of [13, 26, 40, 55, 71, 87]) {
    const radii = angles.map(() => base * (0.94 + rand() * 0.12));
    d += `M${point(radii[0], angles[0])}`;
    for (let i = 1; i < angles.length; i++) {
      const sag = ((radii[i - 1] + radii[i]) / 2) * 0.82;
      d += `Q${point(sag, (angles[i - 1] + angles[i]) / 2)} ${point(radii[i], angles[i])}`;
    }
  }
  return d;
}

function Cobweb({
  size,
  flip = false,
  seed = 5,
}: {
  size: number;
  flip?: boolean;
  seed?: number;
}) {
  const d = useMemo(() => cobwebPath(seed), [seed]);
  return (
    <svg
      className={`sz-cobweb${flip ? " sz-cobweb--flip" : ""}`}
      width={size}
      height={size}
      viewBox="0 0 100 100"
    >
      <path
        d={d}
        fill="none"
        stroke="currentColor"
        strokeWidth={1}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ───────────── Aranha descendo no fio ───────────── */

function Spider() {
  return (
    <svg viewBox="0 0 40 40" className="sz-spider">
      <path
        d="M16 16L9 9L4 13M15 20L7 17L2 22M15 24L7 26L3 32M16 28L10 33L9 39M24 16L31 9L36 13M25 20L33 17L38 22M25 24L33 26L37 32M24 28L30 33L31 39"
        fill="none"
        stroke={INK}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="23" r="7.5" fill={INK} />
      <path d="M18.2 21.5h3.6l-1.8 3.2z" fill="#ff7800" opacity=".85" />
      <circle cx="20" cy="13.5" r="5" fill={INK} />
      <circle cx="18.2" cy="12.9" r="1.25" fill="#fff" />
      <circle cx="21.8" cy="12.9" r="1.25" fill="#fff" />
    </svg>
  );
}

/** O fio estica (scaleY) no mesmo ritmo em que a aranha desce: ficam sempre presos. */
function DanglingSpider({
  length,
  drop,
  size = 22,
  duration = 6,
  delay = 0,
  className = "",
  style,
}: {
  length: number;
  drop: number;
  size?: number;
  duration?: number;
  delay?: number;
  className?: string;
  style?: CSSVars;
}) {
  return (
    <span
      className={`sz-dangle ${className}`}
      style={
        {
          ...style,
          "--len": `${length}px`,
          "--drop": `${drop}px`,
          "--stretch": ((length + drop) / length).toFixed(3),
          "--spider": `${size}px`,
          "--dangle-dur": `${duration}s`,
          "--dangle-delay": `${delay}s`,
        } as CSSVars
      }
    >
      <span className="sz-dangle__thread" />
      <span className="sz-dangle__spider">
        <Spider />
      </span>
    </span>
  );
}

/* ───────────── Abóbora com vela (brilho pisca como chama) ───────────── */

const PUMPKIN_FACE = [
  "M19 28L27 28L23.5 21.5Z",
  "M37 28L45 28L40.5 21.5Z",
  "M30 34.5L34 34.5L32 31Z",
  "M17 37.5Q22 40.5 26 41L26.5 44L29.5 44L30 41.5Q32 41.8 34 41.5L34.5 44L37.5 44L38 41Q42 40.5 47 37.5Q32 53 17 37.5Z",
];

function Pumpkin({ size, delay = 0 }: { size: number; delay?: number }) {
  // Cada furo ganha o próprio gradiente (centro claro, borda queimada).
  const glow = `pumpkin-glow-${useId().replace(/:/g, "")}`;
  return (
    <span
      className="sz-pumpkin"
      style={{ "--pumpkin": `${size}px`, "--flicker-delay": `${delay}s` } as CSSVars}
    >
      <span className="sz-pumpkin__halo" />
      <svg viewBox="0 0 64 58" className="sz-pumpkin__body">
        <path
          d="M29.5 14C29 9 31 4.5 35 2.5L37.5 5C34.5 6.5 33.5 9.5 34 14Z"
          fill="#5b7a2a"
        />
        <g stroke="#c4540e" strokeWidth="1.1">
          <ellipse cx="18" cy="35" rx="15" ry="19" fill="#ea6a12" />
          <ellipse cx="46" cy="35" rx="15" ry="19" fill="#ea6a12" />
          <ellipse cx="26" cy="34" rx="13" ry="21" fill="#f7801f" />
          <ellipse cx="38" cy="34" rx="13" ry="21" fill="#f7801f" />
          <ellipse cx="32" cy="34" rx="10.5" ry="21.5" fill="#ff9333" />
        </g>
        <path
          d="M34 9C38 5.5 43 6.5 44.5 9.5"
          stroke="#5b7a2a"
          strokeWidth="1.6"
          fill="none"
          strokeLinecap="round"
        />
        <path d={PUMPKIN_FACE.join("")} fill="#4a1800" />
      </svg>
      <svg viewBox="0 0 64 58" className="sz-pumpkin__glow">
        <defs>
          <radialGradient id={glow}>
            <stop offset="0" stopColor="#fff4b8" />
            <stop offset=".5" stopColor="#ffbf3a" />
            <stop offset="1" stopColor="#b84a00" />
          </radialGradient>
        </defs>
        {PUMPKIN_FACE.map((d) => (
          <path key={d} d={d} fill={`url(#${glow})`} />
        ))}
      </svg>
    </span>
  );
}

/* ───────────── Fantasminha ───────────── */

function Ghost({ size }: { size: number }) {
  return (
    <svg
      viewBox="0 0 48 58"
      width={size}
      height={(size * 58) / 48}
      className="sz-ghost"
    >
      <path
        d="M24 3C12.5 3 6 13 6 26L6 50C8.5 47 10.5 47 13 50.5C15.5 54 17.5 54 20 50.5C22 47.5 26 47.5 28 50.5C30.5 54 32.5 54 35 50.5C37.5 47 39.5 47 42 50L42 26C42 13 35.5 3 24 3Z"
        fill="#fdfcff"
        stroke="#c9bde0"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <ellipse cx="18" cy="23" rx="2.7" ry="3.6" fill={INK} />
      <ellipse cx="30" cy="23" rx="2.7" ry="3.6" fill={INK} />
      <circle cx="18.9" cy="21.7" r=".9" fill="#fff" />
      <circle cx="30.9" cy="21.7" r=".9" fill="#fff" />
      <ellipse cx="24" cy="31.5" rx="2.5" ry="3.1" fill={INK} />
      <circle cx="13.5" cy="29.5" r="2.6" fill="#f6a5c0" opacity=".55" />
      <circle cx="34.5" cy="29.5" r="2.6" fill="#f6a5c0" opacity=".55" />
    </svg>
  );
}

function WitchHat() {
  return (
    <svg viewBox="0 0 64 52">
      <path
        d="M15 43C19 32 23 20 27.5 11.5C30.5 6 35.5 2 42.5 3.5C38 6 36 10 35.5 14.5C36.5 25 41.5 35 48.5 43Z"
        fill={INK}
      />
      <path
        d="M27.5 11.5C30.5 6 35.5 2 42.5 3.5C37 4 32 8 29 14Z"
        fill="#4a3d5c"
      />
      <ellipse cx="32" cy="44.5" rx="30" ry="6.5" fill={INK} />
      <path d="M16.8 38Q32 41 46 38L48.5 43Q32 46.5 15 43Z" fill="#7b2cbf" />
      <rect
        x="28.5"
        y="38.8"
        width="7"
        height="5.6"
        rx="1"
        fill="none"
        stroke="#f5c542"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* ───────────── Peças do tema ───────────── */

function Scene() {
  const wide = useIsWide();
  return (
    <SceneLayer>
      <Particles
        count={wide ? 18 : 10}
        seed={31}
        direction="up"
        minDuration={9}
        maxDuration={16}
        minSize={7}
        maxSize={14}
        sway={26}
        render={(v) => (
          <span className={v > 0.72 ? "sz-ember sz-ember--violet" : "sz-ember"} />
        )}
      />
      <Flyer top="16vh" cycle={17} delay={-2} rise="-6vh">
        <Motion kind="bob" duration={1.3}>
          <Bat width={wide ? 56 : 44} flap={0.18} />
        </Motion>
      </Flyer>
      <Flyer top="36vh" cycle={23} delay={-11} direction="rtl" rise="-12vh">
        <Motion kind="bob" duration={1.1} delay={-0.4}>
          <Bat width={wide ? 40 : 32} flap={0.16} />
        </Motion>
      </Flyer>
      <Flyer top="60vh" cycle={29} delay={-20} rise="-20vh">
        <Motion kind="bob" duration={1.5} delay={-0.8}>
          <Bat width={wide ? 30 : 24} flap={0.14} />
        </Motion>
      </Flyer>
      {wide && (
        <Flyer top="8vh" cycle={37} delay={-7} direction="rtl" rise="10vh">
          <Motion kind="bob" duration={1.2}>
            <Bat width={36} flap={0.17} />
          </Motion>
        </Flyer>
      )}
    </SceneLayer>
  );
}

function HeaderTrim() {
  const wide = useIsWide();
  const size = wide ? 124 : 64;
  return (
    <div aria-hidden className="sz-header-trim">
      <span className="sz-header-trim__corner sz-header-trim__corner--l">
        <Cobweb size={size} seed={5} />
      </span>
      <span className="sz-header-trim__corner sz-header-trim__corner--r">
        <Cobweb size={size} seed={9} flip />
      </span>
      {/* Só no desktop: no celular os títulos ficam logo abaixo do header e a
          aranha pousaria neles. Na teia da esquerda, longe do selo do hero. */}
      {wide && (
        <DanglingSpider
          length={64}
          drop={70}
          size={24}
          duration={7}
          style={{ left: `${Math.round(size * 0.5)}px` }}
        />
      )}
    </div>
  );
}

function LogoAccessory() {
  return (
    <span aria-hidden className="sz-logo-acc sz-logo-acc--witch">
      <WitchHat />
    </span>
  );
}

function TitleOrnament({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <Motion kind="float" duration={3.2}>
        <Ghost size={30} />
      </Motion>
    );
  }
  if (variant === 2) {
    return (
      <DanglingSpider
        length={16}
        drop={12}
        size={22}
        duration={4.6}
        className="sz-dangle--ornament"
      />
    );
  }
  return (
    <Motion kind="wobble" duration={4}>
      <Pumpkin size={42} />
    </Motion>
  );
}

function CardTrim({ index, layer }: { index: number; layer: "back" | "front" }) {
  if (layer === "back") return null;
  const right = index % 2 === 0;
  return (
    <span
      aria-hidden
      className={`sz-card-web ${right ? "sz-card-web--r" : "sz-card-web--l"}`}
    >
      <Cobweb size={96} flip={right} seed={13 + index} />
      {index === 0 && (
        <DanglingSpider
          length={34}
          drop={40}
          size={20}
          duration={6.5}
          delay={-2}
          style={{ right: "38px" }}
        />
      )}
    </span>
  );
}

function Ground() {
  return (
    <>
      <span className="sz-ground__item" style={{ left: "2%" }}>
        <Pumpkin size={46} />
      </span>
      <span className="sz-ground__item" style={{ left: "15%" }}>
        <Pumpkin size={30} delay={-0.7} />
      </span>
      <span className="sz-ground__item" style={{ left: "46%", bottom: "18px" }}>
        <Motion kind="float" duration={3.4}>
          <Ghost size={30} />
        </Motion>
      </span>
      <span className="sz-ground__item" style={{ right: "3%" }}>
        <Pumpkin size={40} delay={-1.3} />
      </span>
    </>
  );
}

// Revoada mais horizontal que vertical: no celular, subir demais esconde os morcegos atrás do header.
const BURST_BATS = [
  { x: -170, y: -70, s: 0.9, d: 0 },
  { x: 165, y: -85, s: 1, d: 0.12 },
  { x: -125, y: 35, s: 0.7, d: 0.3 },
  { x: 190, y: 15, s: 0.8, d: 0.42 },
  { x: -35, y: -95, s: 0.6, d: 0.55 },
];

function HeroBurst() {
  return (
    <div aria-hidden className="sz-burst">
      {BURST_BATS.map((b, i) => (
        <span
          key={i}
          className="sz-burst__item sz-burst__item--fly sz-burst__item--slow"
          style={
            {
              "--bx": `${b.x}px`,
              "--by": `${b.y}px`,
              "--bs": b.s,
              "--bd": `${b.d}s`,
            } as CSSVars
          }
        >
          <Bat width={40} flap={0.14} />
        </span>
      ))}
    </div>
  );
}

const halloween: SeasonalDecor = {
  theme: "halloween",
  Scene,
  HeaderTrim,
  LogoAccessory,
  TitleOrnament,
  CardTrim,
  Ground,
  HeroBurst,
};

export default halloween;

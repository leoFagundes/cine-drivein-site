"use client";

import { useId, useMemo } from "react";
import type { SeasonalDecor } from "../types";
import {
  Flyer,
  Garland,
  Motion,
  Particles,
  SceneLayer,
  createRandom,
  useIsWide,
  type CSSVars,
} from "../shared";

const SILHOUETTE = "#3d2b26";

/* ───────────── Neve ───────────── */

/** Floco de 6 pontas, pré-calculado em um único path. */
const SNOWFLAKE_PATH = (() => {
  const arm: [number, number, number, number][] = [
    [0, 0, 0, -9],
    [0, -5, -2.6, -7.4],
    [0, -5, 2.6, -7.4],
    [0, -2.6, -1.8, -4.2],
    [0, -2.6, 1.8, -4.2],
  ];
  let d = "";
  for (let k = 0; k < 6; k++) {
    const a = (k * Math.PI) / 3;
    const c = Math.cos(a);
    const s = Math.sin(a);
    const p = (x: number, y: number) =>
      `${(x * c - y * s).toFixed(2)} ${(x * s + y * c).toFixed(2)}`;
    for (const [x1, y1, x2, y2] of arm) d += `M${p(x1, y1)}L${p(x2, y2)}`;
  }
  return d;
})();

function Snowflake() {
  return (
    <svg viewBox="-10 -10 20 20" className="sz-snowflake">
      <path d={SNOWFLAKE_PATH} stroke="#a7bfd6" strokeWidth={2.8} strokeLinecap="round" />
      <path d={SNOWFLAKE_PATH} stroke="#fff" strokeWidth={1.3} strokeLinecap="round" />
    </svg>
  );
}

/** Neve acumulada no topo dos cartazes, com pinguinhos de gelo. */
function snowCapPath(width: number, seed: number) {
  const rand = createRandom(seed);
  const points: [number, number][] = [];
  let x = -6;
  let peak = true;
  while (x < width + 6) {
    points.push([x, peak ? 3 + rand() * 3.5 : 8 + rand() * 2.5]);
    x += 14 + rand() * 18;
    peak = !peak;
  }
  points.push([width + 6, 8]);

  let d = `M${points[0][0]} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mx = ((x0 + x1) / 2).toFixed(1);
    d += `C${mx} ${y0.toFixed(1)} ${mx} ${y1.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }

  const base = 15;
  d += `L${width + 6} ${base}`;
  x = width + 6;
  while (x > -6) {
    const nx = Math.max(x - (16 + rand() * 26), -6);
    if (rand() > 0.45 && x - nx > 12) {
      const cx = (x + nx) / 2;
      const depth = (base + 4 + rand() * 7).toFixed(1);
      d += `L${(cx + 3.5).toFixed(1)} ${base}C${(cx + 3).toFixed(1)} ${depth} ${(cx - 3).toFixed(1)} ${depth} ${(cx - 3.5).toFixed(1)} ${base}`;
    }
    d += `L${nx.toFixed(1)} ${base}`;
    x = nx;
  }
  return `${d}Z`;
}

function SnowCap({ seed }: { seed: number }) {
  const d = useMemo(() => snowCapPath(350, seed), [seed]);
  return (
    <svg className="sz-snowcap" viewBox="0 0 350 28" preserveAspectRatio="none">
      <path d={d} transform="translate(0 2)" fill="#c6d7e7" />
      <path d={d} fill="#fff" />
    </svg>
  );
}

/* ───────────── Trenó com renas (silhueta, como na ilustração) ───────────── */

function Reindeer({ x, y, rudolph = false }: { x: number; y: number; rudolph?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="22" cy="22" rx="14" ry="6.5" transform="rotate(-8 22 22)" />
      <path d="M31 20C33 14 35 10 38 7.5C40 5.5 43.5 5.5 45.5 7.5L48.5 10C48.5 12 46.5 12.8 44.5 12L41.5 12C39.5 15 37.5 19 35.5 23Z" />
      <path d="M40 7L37.5 3.8L42 6Z" />
      <path
        d="M40.5 6.5L38 1M39 3.5L35.5 2.5M42.5 6L44 0.5M43.3 3L46.5 2"
        fill="none"
        stroke={SILHOUETTE}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M32 26L39 30L44 28.5M30 27L35 33L40 34M13 25L6 28L1 26.5M15 26L9 32L3 33.5M8.5 19L5 16.5"
        fill="none"
        stroke={SILHOUETTE}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {rudolph && <circle cx="48.9" cy="10.8" r="1.8" fill="#e03131" />}
    </g>
  );
}

function Sleigh({ width }: { width: number }) {
  return (
    <span className="sz-sleigh" style={{ width }}>
      <span className="sz-sleigh__trail" />
      <svg viewBox="0 0 220 64" fill={SILHOUETTE}>
        <path
          d="M56 21Q90 34 118 30M118 30Q145 26 172 23"
          fill="none"
          stroke={SILHOUETTE}
          strokeWidth="1.2"
          opacity=".7"
        />
        <circle cx="20" cy="24" r="9" />
        <path d="M27 37C25 26 30 16 39 16C47 16 51 25 50 37Z" />
        <circle cx="40" cy="12" r="5.5" />
        <path d="M35 10C34 4 40 2 45 6L44 9Z" />
        <path d="M36 6C31 4 27 6 25 9" fill="none" stroke={SILHOUETTE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="24.5" cy="9.5" r="2.4" />
        <path d="M45 24L56 21" fill="none" stroke={SILHOUETTE} strokeWidth="4" strokeLinecap="round" />
        <path d="M10 20C6 30 8 44 20 48L60 48C70 48 76 42 78 32C74 34 68 34 64 30L58 30L54 36L24 36C20 36 17 30 17 24C17 20 14 18 10 20Z" />
        <path
          d="M4 57L66 57C76 57 82 51 80 43M20 48L18 57M40 48L40 57M60 48L62 57"
          fill="none"
          stroke={SILHOUETTE}
          strokeWidth="2.6"
          strokeLinecap="round"
        />
        <Reindeer x={104} y={10} />
        <Reindeer x={160} y={3} rudolph />
      </svg>
    </span>
  );
}

/* ───────────── Enfeites ───────────── */

const STAR =
  "M20 3L24.23 14.18L36.17 14.75L26.85 22.22L29.99 33.75L20 27.2L10.01 33.75L13.15 22.22L3.83 14.75L15.77 14.18Z";

function Star({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 40 40" width={size} height={size} className="sz-star">
      <path d={STAR} fill="#f6c143" stroke="#e0a526" strokeWidth="2" strokeLinejoin="round" />
      <path d="M20 9L22.2 15.6L20 14.2Z" fill="#fff6d1" opacity=".8" />
    </svg>
  );
}

function Bauble({ size, color = "#d62828" }: { size: number; color?: string }) {
  const clip = `bauble-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 40 56" width={size} height={size * 1.4}>
      <defs>
        <clipPath id={clip}>
          <circle cx="20" cy="35" r="16.5" />
        </clipPath>
      </defs>
      <path d="M20 0V9" stroke="#a08c6a" strokeWidth="1" />
      <circle cx="20" cy="9" r="2.4" fill="none" stroke="#d9a93a" strokeWidth="1.3" />
      <rect x="15.5" y="10.5" width="9" height="6" rx="1.3" fill="#e2b23c" />
      <circle cx="20" cy="35" r="16.5" fill={color} />
      <g clipPath={`url(#${clip})`}>
        <path
          d="M0 31L5 26.5L10 31L15 26.5L20 31L25 26.5L30 31L35 26.5L40 31L40 35.5L35 31L30 35.5L25 31L20 35.5L15 31L10 35.5L5 31L0 35.5Z"
          fill="#f2c94c"
        />
        {[9, 16, 23, 30].map((cx) => (
          <circle key={cx} cx={cx} cy="43" r="1.6" fill="#fff" opacity=".85" />
        ))}
      </g>
      <ellipse cx="13" cy="27" rx="3.2" ry="5.6" transform="rotate(35 13 27)" fill="#fff" opacity=".45" />
    </svg>
  );
}

function Holly({ width }: { width: number }) {
  return (
    <svg viewBox="0 0 64 40" width={width} height={(width * 40) / 64}>
      <g stroke="#145c2c" strokeWidth=".9" strokeLinejoin="round">
        <path
          transform="rotate(14 32 22)"
          fill="#1f7a3d"
          d="M32 22Q27 20.5 22 13.5Q17.5 17.5 13 14.5Q8.25 19.75 3.5 19Q8 22 8 27Q12 25.25 16 30.5Q20.5 26.25 25 29Q27 24 32 22Z"
        />
        <path
          transform="rotate(-14 32 22)"
          fill="#24914f"
          d="M32 22Q37 20.5 42 13.5Q46.5 17.5 51 14.5Q55.75 19.75 60.5 19Q56 22 56 27Q52 25.25 48 30.5Q43.5 26.25 39 29Q37 24 32 22Z"
        />
      </g>
      <circle cx="28.8" cy="20" r="4" fill="#d62828" />
      <circle cx="35.2" cy="20" r="4" fill="#d62828" />
      <circle cx="32" cy="15" r="4" fill="#e03131" />
      <circle cx="27.6" cy="18.7" r="1" fill="#fff" opacity=".8" />
      <circle cx="34" cy="18.7" r="1" fill="#fff" opacity=".8" />
      <circle cx="30.8" cy="13.7" r="1" fill="#fff" opacity=".8" />
    </svg>
  );
}

function SantaHat() {
  return (
    <svg viewBox="0 0 60 50">
      <path d="M9 38C11 22 22 8 37 8C47 8 53.5 14 56 23C52 19.5 47.5 18.5 44.5 20C46.5 26.5 48.5 32 50.5 38Z" fill="#d62828" />
      <path d="M37 8C30 9 24 16 21 26C25 18 30 12.5 37 8Z" fill="#ff6b6b" opacity=".55" />
      <path
        d="M5.5 35.5Q29 29.5 53.5 35.5Q56 40.5 52.5 45.5Q29 39.5 7.5 45.5Q3 40.5 5.5 35.5Z"
        fill="#fff"
        stroke="#d5dfea"
        strokeWidth="1"
      />
      <circle cx="55.5" cy="25" r="5" fill="#fff" stroke="#d5dfea" strokeWidth="1" />
    </svg>
  );
}

function PineTree({ height }: { height: number }) {
  return (
    <svg viewBox="0 0 40 60" width={(height * 40) / 60} height={height}>
      <rect x="17" y="48" width="6" height="10" rx="1" fill="#7a4b2a" />
      <path d="M3 50L20 23L37 50Z" fill="#1f7a44" />
      <path d="M6.5 38L20 13.5L33.5 38Z" fill="#24914f" />
      <path d="M10 26.5L20 6L30 26.5Z" fill="#2aa45a" />
      <g fill="#fff">
        <path d="M3.6 49.2Q8 46 12.2 48.6Q16.5 45.4 20.6 48.3Q25 45.2 29 48.5Q33 46 36.4 49.2L37 50L3 50Z" />
        <path d="M7.1 37.3Q11 34.6 14.6 36.9Q18.4 34 22 36.7Q26 34 29.6 36.8Q32.4 35 33 37.2L33.5 38L6.5 38Z" />
        <path d="M10.5 25.8Q13.6 23.4 16.4 25.4Q19.4 23 22.4 25.2Q25.6 23.2 28.3 25.4L30 26.5L10 26.5Z" />
      </g>
      <circle cx="14" cy="44" r="1.6" fill="#d62828" />
      <circle cx="26" cy="42" r="1.6" fill="#f2c94c" />
      <circle cx="17" cy="31.5" r="1.5" fill="#f2c94c" />
      <circle cx="24.5" cy="33" r="1.5" fill="#d62828" />
      <circle cx="21" cy="20" r="1.4" fill="#4dabff" />
      <path
        d="M20 0.5L21.12 3.46L24.28 3.61L21.81 5.59L22.65 8.64L20 6.9L17.35 8.64L18.19 5.59L15.72 3.61L18.88 3.46Z"
        fill="#f6c143"
      />
    </svg>
  );
}

function Gift({ size, box, ribbon }: { size: number; box: string; ribbon: string }) {
  return (
    <svg viewBox="0 0 30 30" width={size} height={size}>
      <rect x="3" y="12" width="24" height="17" rx="1.5" fill={box} />
      <rect x="1.5" y="9" width="27" height="5" rx="1" fill={box} />
      <rect x="1.5" y="12.6" width="27" height="1.4" fill="#000" fillOpacity=".12" />
      <rect x="13" y="9" width="4" height="20" fill={ribbon} />
      <path d="M15 9C10 2 4.5 5.5 9 9Z" fill={ribbon} />
      <path d="M15 9C20 2 25.5 5.5 21 9Z" fill={ribbon} />
      <circle cx="15" cy="9" r="1.9" fill={ribbon} />
    </svg>
  );
}

function Snowman({ height }: { height: number }) {
  return (
    <svg viewBox="0 0 44 64" width={(height * 44) / 64} height={height}>
      <path d="M13 30L5 24M8 26.5L6.5 22.5M31 30L39 23M36 25.5L38.5 21.5" stroke="#7a4b2a" strokeWidth="1.6" strokeLinecap="round" />
      <g fill="#fff" stroke="#c9d8e6" strokeWidth="1.4">
        <circle cx="22" cy="50" r="13" />
        <circle cx="22" cy="31" r="9.5" />
        <circle cx="22" cy="16" r="7.5" />
      </g>
      <rect x="13.5" y="8.5" width="17" height="2.6" rx="1" fill="#2a2a33" />
      <rect x="16" y="0.5" width="12" height="9" rx="1.5" fill="#2a2a33" />
      <rect x="16" y="6" width="12" height="2" fill="#d62828" />
      <circle cx="19.5" cy="14.5" r="1" fill="#2a2a33" />
      <circle cx="24.5" cy="14.5" r="1" fill="#2a2a33" />
      <path d="M22 17L28.5 18.2L22 19Z" fill="#f28c28" />
      <path d="M19.5 20Q22 21.6 24.5 20" stroke="#2a2a33" strokeWidth=".9" fill="none" strokeLinecap="round" />
      <path d="M14.5 22Q22 25.5 29.5 22L29.5 25Q22 28.5 14.5 25Z" fill="#d62828" />
      <path d="M25 24L27 33L23.5 33L22.5 25Z" fill="#b51f1f" />
      <circle cx="22" cy="31" r="1" fill="#2a2a33" />
      <circle cx="22" cy="35" r="1" fill="#2a2a33" />
      <circle cx="22" cy="46" r="1.1" fill="#2a2a33" />
    </svg>
  );
}

const SPARKLE =
  "M10 0C10.8 6.2 13.8 9.2 20 10C13.8 10.8 10.8 13.8 10 20C9.2 13.8 6.2 10.8 0 10C6.2 9.2 9.2 6.2 10 0Z";

/* ───────────── Peças do tema ───────────── */

function Scene() {
  const wide = useIsWide();
  return (
    <SceneLayer>
      <Particles
        count={wide ? 38 : 22}
        seed={7}
        minDuration={9}
        maxDuration={17}
        minSize={6}
        maxSize={13}
        sway={30}
        render={(v) => (v > 0.68 ? <Snowflake /> : <span className="sz-snow" />)}
      />
      <Flyer top="24vh" cycle={30} delay={-4} rise="-9vh">
        <Motion kind="bob" duration={2.2}>
          <Sleigh width={wide ? 230 : 150} />
        </Motion>
      </Flyer>
    </SceneLayer>
  );
}

const BULB_COLORS = ["#ff4d4d", "#ffc94a", "#3ddc84", "#4dabff"];

function HeaderTrim() {
  const wide = useIsWide();
  return (
    <div aria-hidden className="sz-header-trim">
      <Garland
        swags={wide ? 11 : 5}
        depth={13}
        perSwag={[0.22, 0.5, 0.78]}
        wireColor="#2f3d33"
        height={36}
        renderItem={(i) => (
          <span
            className="sz-bulb"
            style={
              {
                "--c": BULB_COLORS[i % BULB_COLORS.length],
                "--d": `${i % 2 === 0 ? 0 : -1.6}s`,
                "--tilt": `${((i * 37) % 17) - 8}deg`,
              } as CSSVars
            }
          />
        )}
      />
    </div>
  );
}

function LogoAccessory() {
  return (
    <span aria-hidden className="sz-logo-acc sz-logo-acc--santa">
      <SantaHat />
    </span>
  );
}

function TitleOrnament({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <Motion kind="sway" duration={3.6}>
        <Holly width={46} />
      </Motion>
    );
  }
  if (variant === 2) {
    return (
      <Motion kind="pulse" duration={1.8}>
        <Star size={34} />
      </Motion>
    );
  }
  return (
    <Motion kind="swing" duration={2.6}>
      <Bauble size={28} />
    </Motion>
  );
}

function CardTrim({ index, layer }: { index: number; layer: "back" | "front" }) {
  if (layer === "back") return null;
  return <SnowCap seed={21 + index * 7} />;
}

function Ground() {
  const wide = useIsWide();
  return (
    <>
      <svg className="sz-ground__band" viewBox="0 0 400 24" preserveAspectRatio="none">
        <path
          d="M0 24L0 11C30 5 60 9 90 7C130 4 160 11 200 8C240 5 270 10 310 7C350 4 380 9 400 8L400 24Z"
          fill="#cddbe8"
        />
        <path
          d="M0 24L0 13C30 7 60 11 90 9C130 6 160 13 200 10C240 7 270 12 310 9C350 6 380 11 400 10L400 24Z"
          fill="#fff"
        />
      </svg>
      <span className="sz-ground__item" style={{ left: "2%", bottom: "8px" }}>
        <PineTree height={62} />
      </span>
      <span className="sz-ground__item" style={{ left: "17%", bottom: "8px" }}>
        <Gift size={28} box="#d62828" ribbon="#f2c94c" />
      </span>
      <span className="sz-ground__item" style={{ left: "27%", bottom: "8px" }}>
        <Gift size={21} box="#1f7a44" ribbon="#ffffff" />
      </span>
      {wide && (
        <span className="sz-ground__item" style={{ right: "18%", bottom: "8px" }}>
          <PineTree height={46} />
        </span>
      )}
      <span className="sz-ground__item" style={{ right: "3%", bottom: "8px" }}>
        <Snowman height={60} />
      </span>
    </>
  );
}

const SPARKLES = [
  { x: 10, y: 14, s: 16, d: 0 },
  { x: 27, y: 6, s: 11, d: 1.3 },
  { x: 70, y: 9, s: 17, d: 0.6 },
  { x: 88, y: 28, s: 12, d: 2 },
  { x: 55, y: 4, s: 10, d: 2.7 },
  { x: 6, y: 42, s: 11, d: 3.3 },
  { x: 94, y: 6, s: 13, d: 3.9 },
];

function HeroBurst() {
  return (
    <div aria-hidden className="sz-burst sz-burst--inside">
      {SPARKLES.map((s, i) => (
        <span
          key={i}
          className="sz-burst__sparkle"
          style={
            {
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.s,
              height: s.s,
              "--bd": `${s.d}s`,
            } as CSSVars
          }
        >
          <svg viewBox="0 0 20 20">
            <path d={SPARKLE} fill="#fffbe6" />
          </svg>
        </span>
      ))}
    </div>
  );
}

const christmas: SeasonalDecor = {
  theme: "christmas",
  Scene,
  HeaderTrim,
  LogoAccessory,
  TitleOrnament,
  CardTrim,
  Ground,
  HeroBurst,
};

export default christmas;

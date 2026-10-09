"use client";

import { useId, useMemo, type ReactNode } from "react";
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

const PASTELS = ["#f7a8c4", "#9fd3f7", "#f8dc6c", "#9fe0bd", "#c9b1f2", "#f9be93"];
const FUR = "#f4ede6";
const FUR_EDGE = "#bfae9f";
const EAR_PINK = "#f7b9c9";

/* ───────────── Ovos decorados ───────────── */

const EGG =
  "M15 1.5C23.5 1.5 28.5 14.5 28.5 23.5C28.5 31.5 22.5 36.5 15 36.5C7.5 36.5 1.5 31.5 1.5 23.5C1.5 14.5 6.5 1.5 15 1.5Z";

const EGG_DESIGNS: { base: string; pattern: ReactNode }[] = [
  {
    base: "#f7a8c4",
    pattern: (
      <path
        d="M0 19L5 15.5L10 19L15 15.5L20 19L25 15.5L30 19L30 24L25 20.5L20 24L15 20.5L10 24L5 20.5L0 24Z"
        fill="#fff3b0"
      />
    ),
  },
  {
    base: "#9fd3f7",
    pattern: (
      <g fill="#fff">
        <circle cx="9" cy="13" r="2.1" />
        <circle cx="17" cy="9.5" r="1.5" />
        <circle cx="21.5" cy="17" r="2.2" />
        <circle cx="13.5" cy="17.5" r="1.2" />
        <circle cx="10.5" cy="23.5" r="1.8" />
        <circle cx="19" cy="27" r="2" />
        <circle cx="24.5" cy="24.5" r="1.3" />
        <circle cx="14" cy="31" r="1.6" />
        <circle cx="6.5" cy="29" r="1.2" />
      </g>
    ),
  },
  {
    base: "#9fe0bd",
    pattern: (
      <g fill="#c9b1f2">
        <path d="M0 11Q7.5 8 15 11T30 11V14.5Q22.5 17.5 15 14.5T0 14.5Z" />
        <path d="M0 26Q7.5 23 15 26T30 26V29.5Q22.5 32.5 15 29.5T0 29.5Z" />
      </g>
    ),
  },
  {
    base: "#f8dc6c",
    pattern: (
      <path
        d="M0 21Q4 17 8 21T16 21T24 21T32 21V25Q28 29 24 25T16 25T8 25T0 25Z"
        fill="#f49ac1"
      />
    ),
  },
];

function Egg({ design, size }: { design: number; size?: number }) {
  const clip = `egg-${useId().replace(/:/g, "")}`;
  const { base, pattern } = EGG_DESIGNS[design % EGG_DESIGNS.length];
  return (
    <svg
      viewBox="0 0 30 38"
      width={size}
      height={size ? (size * 38) / 30 : undefined}
      className="sz-egg"
    >
      <defs>
        <clipPath id={clip}>
          <path d={EGG} />
        </clipPath>
      </defs>
      <path d={EGG} fill={base} />
      <g clipPath={`url(#${clip})`}>{pattern}</g>
      <ellipse
        cx="10"
        cy="12"
        rx="2.2"
        ry="3.8"
        transform="rotate(18 10 12)"
        fill="#fff"
        opacity=".5"
      />
      <path d={EGG} fill="none" stroke="#000" strokeOpacity=".14" strokeWidth="1" />
    </svg>
  );
}

/* ───────────── Pétalas e flores ───────────── */

function Petal({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 20" className="sz-petal">
      <path
        d="M10 1C15 5 16 12 10 19C4 12 5 5 10 1Z"
        fill={color}
        stroke="#000"
        strokeOpacity=".1"
        strokeWidth=".8"
      />
      <path
        d="M10 4Q9 10 10 16"
        stroke="#fff"
        strokeOpacity=".55"
        strokeWidth=".9"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function FlowerHead({ color }: { color: string }) {
  return (
    <>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="0"
          cy="-6"
          rx="4"
          ry="6"
          transform={`rotate(${a})`}
          fill={color}
          stroke="#000"
          strokeOpacity=".08"
          strokeWidth=".6"
        />
      ))}
      <circle r="3.4" fill="#f8d24a" stroke="#e9b923" strokeWidth=".8" />
    </>
  );
}

function Flower({ size, color }: { size: number; color: string }) {
  return (
    <svg viewBox="-12 -12 24 24" width={size} height={size}>
      <FlowerHead color={color} />
    </svg>
  );
}

function StemFlower({ height, color }: { height: number; color: string }) {
  return (
    <svg viewBox="-12 -12 24 48" width={height / 2} height={height}>
      <path d="M0 4Q1.5 18 0 36" stroke="#4f9f52" strokeWidth="1.8" fill="none" />
      <path d="M0.6 22Q8 16 10 20Q5 25 0.8 24Z" fill="#6bbf6a" />
      <FlowerHead color={color} />
    </svg>
  );
}

/* ───────────── Borboleta (asas batem no compositor) ───────────── */

const BUTTERFLY_PALETTES = [
  { upper: "#f49ac1", lower: "#fbc7a4", edge: "#d9709f" },
  { upper: "#8fc9f2", lower: "#c9b1f2", edge: "#5d9fd0" },
  { upper: "#f8d45a", lower: "#9fe0bd", edge: "#d6ab2c" },
];

function Butterfly({ width, palette = 0 }: { width: number; palette?: number }) {
  const p = BUTTERFLY_PALETTES[palette % BUTTERFLY_PALETTES.length];
  return (
    <span className="sz-butterfly" style={{ "--bf-w": `${width}px` } as CSSVars}>
      <svg viewBox="0 0 60 48" className="sz-butterfly__wing">
        <path
          d="M29 22C25 9 14 2 6 5C1 7 2 16 8 20C14 23.5 22 23.5 29 23Z"
          fill={p.upper}
          stroke={p.edge}
          strokeWidth="1.2"
        />
        <path
          d="M29 25C22 25.5 13 29 11 35C9.5 40 14 44 19 41C24 38 27.5 31.5 29.5 26.5Z"
          fill={p.lower}
          stroke={p.edge}
          strokeWidth="1.2"
        />
        <circle cx="12" cy="10" r="1.8" fill="#fff" opacity=".8" />
        <circle cx="9" cy="15" r="1.1" fill="#fff" opacity=".8" />
      </svg>
      <svg viewBox="0 0 60 48" className="sz-butterfly__wing">
        <path
          d="M31 22C35 9 46 2 54 5C59 7 58 16 52 20C46 23.5 38 23.5 31 23Z"
          fill={p.upper}
          stroke={p.edge}
          strokeWidth="1.2"
        />
        <path
          d="M31 25C38 25.5 47 29 49 35C50.5 40 46 44 41 41C36 38 32.5 31.5 30.5 26.5Z"
          fill={p.lower}
          stroke={p.edge}
          strokeWidth="1.2"
        />
        <circle cx="48" cy="10" r="1.8" fill="#fff" opacity=".8" />
        <circle cx="51" cy="15" r="1.1" fill="#fff" opacity=".8" />
      </svg>
      <svg viewBox="0 0 60 48" className="sz-butterfly__body">
        <ellipse cx="30" cy="25" rx="1.7" ry="9.5" fill="#3b2f3f" />
        <circle cx="30" cy="15" r="2.2" fill="#3b2f3f" />
        <path
          d="M29.5 14Q27 7 24 5M30.5 14Q33 7 36 5"
          stroke="#3b2f3f"
          strokeWidth="1.1"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="24" cy="5" r="1.2" fill="#3b2f3f" />
        <circle cx="36" cy="5" r="1.2" fill="#3b2f3f" />
      </svg>
    </span>
  );
}

/* ───────────── Coelhinho espiando (orelha direita mexe sozinha) ───────────── */

function Bunny({ width }: { width: number }) {
  return (
    <span className="sz-bunny" style={{ "--bunny-w": `${width}px` } as CSSVars}>
      <svg viewBox="0 0 64 76" className="sz-bunny__ear">
        <path
          d="M36 34C36 22 40 4 46 2C51 8 49 26 42 36Z"
          fill={FUR}
          stroke={FUR_EDGE}
          strokeWidth="1.4"
        />
        <path d="M39.5 30C39.5 21 42 9.5 45 6.5C47.5 11 46.5 23 42.5 31Z" fill={EAR_PINK} />
      </svg>
      <svg viewBox="0 0 64 76" className="sz-bunny__base">
        <path
          d="M22 36C15 26 13 8 18 2C24 4 28 22 28 34Z"
          fill={FUR}
          stroke={FUR_EDGE}
          strokeWidth="1.4"
        />
        <path d="M21 31C17 23 16.5 11 19 6.5C22.5 9 24.5 21 24.5 30Z" fill={EAR_PINK} />
        <ellipse cx="32" cy="50" rx="20" ry="17" fill={FUR} stroke={FUR_EDGE} strokeWidth="1.4" />
        <circle cx="21" cy="55" r="4" fill={EAR_PINK} opacity=".6" />
        <circle cx="43" cy="55" r="4" fill={EAR_PINK} opacity=".6" />
        <ellipse cx="24.5" cy="47" rx="2.6" ry="3.2" fill="#3b302b" />
        <ellipse cx="39.5" cy="47" rx="2.6" ry="3.2" fill="#3b302b" />
        <circle cx="25.4" cy="45.8" r=".95" fill="#fff" />
        <circle cx="40.4" cy="45.8" r=".95" fill="#fff" />
        <path d="M29.5 53Q32 51.5 34.5 53Q32 56.5 29.5 53Z" fill="#f08aa8" />
        <path
          d="M32 55.5V57.5M32 57.5Q30 59.5 28.5 58M32 57.5Q34 59.5 35.5 58"
          stroke="#3b302b"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M22 54L13 52M22 56.5L13 57.5M42 54L51 52M42 56.5L51 57.5"
          stroke={FUR_EDGE}
          strokeWidth=".8"
          strokeLinecap="round"
        />
        <ellipse cx="22" cy="71" rx="6.5" ry="4.5" fill={FUR} stroke={FUR_EDGE} strokeWidth="1.4" />
        <ellipse cx="42" cy="71" rx="6.5" ry="4.5" fill={FUR} stroke={FUR_EDGE} strokeWidth="1.4" />
      </svg>
    </span>
  );
}

function LogoEars() {
  return (
    <span aria-hidden className="sz-logo-acc sz-logo-acc--ears">
      <svg viewBox="0 0 40 34" className="sz-logo-ears__right">
        <path
          d="M21 26C21 16 24 5 29.5 2C33.5 7 31.5 18 26 26Z"
          fill={FUR}
          stroke={FUR_EDGE}
          strokeWidth="1.2"
        />
        <path d="M23.2 22C23.6 15 25.6 8 28.8 5.6C30.8 9.5 29.6 16.5 25.8 22Z" fill={EAR_PINK} />
      </svg>
      <svg viewBox="0 0 40 34">
        <path
          d="M14 26C9 18 8 6 12 1.5C17 3.5 19.5 15 19 26Z"
          fill={FUR}
          stroke={FUR_EDGE}
          strokeWidth="1.2"
        />
        <path d="M14 22C11 16 10.5 8 12.6 5C15.3 7.5 16.7 15 16.4 22Z" fill={EAR_PINK} />
        <path
          d="M4 31Q20 21 36 31"
          stroke="#f49ac1"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}

/* ───────────── Grama em ladrilho (SVG em data URI, repetido no eixo X) ───────────── */

function grassTile(seed: number, color: string, height: number) {
  const rand = createRandom(seed);
  let d = "";
  for (let x = -2; x < 82; x += 2.6 + rand() * 2.8) {
    const h = height * (0.45 + rand() * 0.55);
    const lean = (rand() - 0.5) * 9;
    const w = 2.4 + rand() * 1.6;
    const tip = x + w / 2 + lean;
    d += `M${x.toFixed(1)} ${height}Q${(x + w / 2 + lean * 0.3).toFixed(1)} ${(height - h * 0.6).toFixed(1)} ${tip.toFixed(1)} ${(height - h).toFixed(1)}Q${(x + w / 2 + lean * 0.5).toFixed(1)} ${(height - h * 0.5).toFixed(1)} ${(x + w).toFixed(1)} ${height}Z`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 ${height}" preserveAspectRatio="none"><path d="${d}" fill="${color}"/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

function Grass({ layer }: { layer: "back" | "front" }) {
  const tile = useMemo(
    () =>
      layer === "back" ? grassTile(3, "#5aa95b", 30) : grassTile(8, "#7cc76f", 22),
    [layer],
  );
  return <span className={`sz-grass sz-grass--${layer}`} style={{ backgroundImage: tile }} />;
}

/* ───────────── Peças do tema ───────────── */

function Scene() {
  const wide = useIsWide();
  return (
    <SceneLayer>
      <Particles
        count={wide ? 22 : 13}
        seed={19}
        minDuration={11}
        maxDuration={19}
        minSize={11}
        maxSize={18}
        sway={34}
        render={(v) =>
          v > 0.86 ? (
            <Egg design={Math.floor(v * 100)} />
          ) : (
            <Petal color={PASTELS[Math.floor(v * PASTELS.length)]} />
          )
        }
      />
      <Flyer top="20vh" cycle={19} delay={-3} rise="-10vh">
        <Motion kind="float" duration={2.2}>
          <span className="sz-tilt sz-tilt--r">
            <Butterfly width={wide ? 42 : 34} palette={0} />
          </span>
        </Motion>
      </Flyer>
      <Flyer top="50vh" cycle={26} delay={-15} direction="rtl" rise="-14vh">
        <Motion kind="float" duration={1.9} delay={-0.6}>
          <span className="sz-tilt sz-tilt--l">
            <Butterfly width={wide ? 34 : 28} palette={1} />
          </span>
        </Motion>
      </Flyer>
      {wide && (
        <Flyer top="68vh" cycle={33} delay={-24} rise="-22vh">
          <Motion kind="float" duration={2.4} delay={-1}>
            <span className="sz-tilt sz-tilt--r">
              <Butterfly width={30} palette={2} />
            </span>
          </Motion>
        </Flyer>
      )}
      <span className="sz-peek">
        <Bunny width={wide ? 70 : 58} />
      </span>
    </SceneLayer>
  );
}

function HeaderTrim() {
  const wide = useIsWide();
  return (
    <div aria-hidden className="sz-header-trim">
      <Garland
        swags={wide ? 11 : 5}
        depth={12}
        perSwag={[0.3, 0.7]}
        wireColor="#b08b62"
        height={42}
        renderItem={(i) => (
          <span
            className="sz-egg-hang"
            style={{ "--motion-delay": `${-((i * 0.37) % 2.4)}s` } as CSSVars}
          >
            <Egg design={i} size={13} />
          </span>
        )}
        renderAnchor={(i) => (
          <Flower size={13} color={PASTELS[(i * 2 + 4) % PASTELS.length]} />
        )}
      />
    </div>
  );
}

function TitleOrnament({ variant }: { variant: number }) {
  if (variant === 1) {
    return (
      <Motion kind="spin" duration={14}>
        <Flower size={34} color="#f7a8c4" />
      </Motion>
    );
  }
  if (variant === 2) {
    return (
      <Motion kind="float" duration={2.2}>
        <Butterfly width={40} palette={2} />
      </Motion>
    );
  }
  return (
    <Motion kind="wobble" duration={3.4}>
      <Egg design={3} size={28} />
    </Motion>
  );
}

function CardTrim({ index, layer }: { index: number; layer: "back" | "front" }) {
  // Só nos cartazes ímpares: o de cima de todos fica livre do subtítulo da seção.
  if (layer === "front" || index % 2 === 0) return null;
  return (
    <span
      aria-hidden
      className={`sz-card-bunny ${index % 4 === 1 ? "sz-card-bunny--r" : "sz-card-bunny--l"}`}
      style={{ "--peek-delay": `${-index * 2.3}s` } as CSSVars}
    >
      <Bunny width={46} />
    </span>
  );
}

function Ground() {
  return (
    <>
      <Grass layer="back" />
      <span className="sz-ground__item" style={{ left: "2%", bottom: "6px" }}>
        <StemFlower height={40} color="#c9b1f2" />
      </span>
      <span className="sz-ground__item sz-ground__egg" style={{ left: "9%" }}>
        <Egg design={1} size={22} />
      </span>
      <span
        className="sz-ground__item sz-ground__egg sz-ground__egg--tilt"
        style={{ left: "17%" }}
      >
        <Egg design={0} size={18} />
      </span>
      <span className="sz-ground__item" style={{ left: "30%", bottom: "6px" }}>
        <StemFlower height={34} color="#f7a8c4" />
      </span>
      <span className="sz-ground__item sz-ground__egg" style={{ right: "27%" }}>
        <Egg design={3} size={20} />
      </span>
      <span className="sz-ground__item" style={{ right: "20%", bottom: "6px" }}>
        <StemFlower height={30} color="#9fd3f7" />
      </span>
      <span className="sz-ground__item sz-ground__bunny" style={{ right: "4%" }}>
        <Bunny width={50} />
      </span>
      <Grass layer="front" />
    </>
  );
}

const BURST_BUTTERFLIES = [
  { x: -140, y: -120, s: 0.9, d: 0, p: 0 },
  { x: 150, y: -110, s: 1, d: 0.25, p: 1 },
  { x: 20, y: -170, s: 0.75, d: 0.5, p: 2 },
];

function HeroBurst() {
  return (
    <div aria-hidden className="sz-burst">
      {BURST_BUTTERFLIES.map((b, i) => (
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
          <Butterfly width={38} palette={b.p} />
        </span>
      ))}
    </div>
  );
}

const easter: SeasonalDecor = {
  theme: "easter",
  Scene,
  HeaderTrim,
  LogoAccessory: LogoEars,
  TitleOrnament,
  CardTrim,
  Ground,
  HeroBurst,
};

export default easter;

"use client";

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* Primitivos dos temas. Toda animação mexe só em transform/opacity
   (roda no compositor, sem repintar), pensando em celular. */

export type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/** PRNG determinístico (mulberry32): os efeitos saem iguais a cada render. */
export function createRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** true em telas ≥ 768px — usado para dosar a quantidade de efeitos no celular. */
export function useIsWide() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setWide(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return wide;
}

/** Camada fixa da cena (acima do conteúdo, abaixo do header, sem capturar toque). */
export function SceneLayer({ children }: { children: ReactNode }) {
  return (
    <>
      <div aria-hidden className="sz-atmo" />
      <div aria-hidden className="sz-scene">
        {children}
      </div>
    </>
  );
}

interface ParticlesProps {
  count: number;
  seed: number;
  /** "down" cai do topo; "up" sobe do rodapé e some no caminho. */
  direction?: "down" | "up";
  minDuration: number;
  maxDuration: number;
  minSize: number;
  maxSize: number;
  /** Amplitude máxima do balanço lateral, em px. */
  sway: number;
  /** `variant` ∈ [0, 1) — sorteio estável para escolher o desenho. */
  render: (variant: number, index: number) => ReactNode;
}

export function Particles({
  count,
  seed,
  direction = "down",
  minDuration,
  maxDuration,
  minSize,
  maxSize,
  sway,
  render,
}: ParticlesProps) {
  const items = useMemo(() => {
    const rand = createRandom(seed);
    return Array.from({ length: count }, () => {
      const duration = minDuration + rand() * (maxDuration - minDuration);
      return {
        variant: rand(),
        style: {
          "--x": `${(2 + rand() * 96).toFixed(2)}%`,
          "--size": `${(minSize + rand() * (maxSize - minSize)).toFixed(1)}px`,
          "--dur": `${duration.toFixed(2)}s`,
          // Atraso negativo: as partículas já começam espalhadas pela tela.
          "--delay": `${(-rand() * duration).toFixed(2)}s`,
          "--sway": `${(sway * (0.4 + rand() * 0.8)).toFixed(1)}px`,
          "--sway-dur": `${(2.6 + rand() * 2.8).toFixed(2)}s`,
          "--spin": `${((rand() > 0.5 ? 1 : -1) * (90 + rand() * 270)).toFixed(0)}deg`,
        } as CSSVars,
      };
    });
  }, [count, seed, minDuration, maxDuration, minSize, maxSize, sway]);

  return (
    <>
      {items.map((item, i) => (
        <span
          key={i}
          className={`sz-particle${direction === "up" ? " sz-particle--up" : ""}`}
          style={item.style}
        >
          <span className="sz-particle__sway">{render(item.variant, i)}</span>
        </span>
      ))}
    </>
  );
}

/**
 * Atravessa a tela de tempos em tempos. O voo ocupa ~1/3 do `cycle`
 * e o resto do ciclo fica fora da tela — ciclos diferentes evitam padrão.
 */
export function Flyer({
  children,
  top,
  cycle,
  delay,
  direction = "ltr",
  rise = "0px",
}: {
  children: ReactNode;
  top: string;
  cycle: number;
  delay: number;
  direction?: "ltr" | "rtl";
  /** Deslocamento vertical ao longo do voo (ex.: "-12vh" sobe). */
  rise?: string;
}) {
  return (
    <span
      className={`sz-flyer${direction === "rtl" ? " sz-flyer--rtl" : ""}`}
      style={
        {
          "--top": top,
          "--cycle": `${cycle}s`,
          "--delay": `${delay}s`,
          "--rise": rise,
        } as CSSVars
      }
    >
      {children}
    </span>
  );
}

/** Varal em "barrigas" (curvas quadráticas) com itens pendurados ao longo dele. */
export function Garland({
  swags,
  depth,
  perSwag,
  wireColor,
  height,
  renderItem,
  renderAnchor,
}: {
  swags: number;
  /** Quanto cada barriga desce, em px. */
  depth: number;
  /** Posições (0–1) dos itens em cada barriga. */
  perSwag: number[];
  wireColor: string;
  height: number;
  renderItem: (index: number) => ReactNode;
  /** Enfeite opcional nos pontos de fixação entre as barrigas. */
  renderAnchor?: (index: number) => ReactNode;
}) {
  const top = 1.5;
  const width = swags * 100;

  let d = `M0 ${top}`;
  const items: { left: string; top: number }[] = [];
  const anchors = Array.from(
    { length: renderAnchor ? swags - 1 : 0 },
    (_, i) => `${((i + 1) / swags) * 100}%`,
  );
  for (let s = 0; s < swags; s++) {
    d += `Q${s * 100 + 50} ${top + depth * 2} ${(s + 1) * 100} ${top}`;
    for (const t of perSwag) {
      items.push({
        left: `${(((s + t) * 100) / width) * 100}%`,
        top: top + 4 * depth * t * (1 - t),
      });
    }
  }

  return (
    <div className="sz-garland" style={{ height }}>
      <svg
        className="sz-garland__wire"
        viewBox={`0 0 ${width} ${depth + 4}`}
        preserveAspectRatio="none"
        style={{ height: depth + 4 }}
      >
        <path
          d={d}
          fill="none"
          stroke={wireColor}
          strokeWidth={1.4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {items.map((item, i) => (
        <span
          key={i}
          className="sz-garland__item"
          style={{ left: item.left, top: item.top }}
        >
          {renderItem(i)}
        </span>
      ))}
      {renderAnchor &&
        anchors.map((left, i) => (
          <span key={`a${i}`} className="sz-garland__anchor" style={{ left }}>
            {renderAnchor(i)}
          </span>
        ))}
    </div>
  );
}

/** Dá vida a um enfeite parado: flutuar, balançar, bambolear… (ver seasonal.css). */
export function Motion({
  kind,
  children,
  duration,
  delay = 0,
  className = "",
}: {
  kind: "bob" | "swing" | "wobble" | "sway" | "float" | "pulse" | "spin";
  children: ReactNode;
  duration?: number;
  delay?: number;
  className?: string;
}) {
  return (
    <span
      className={`sz-motion sz-motion--${kind} ${className}`}
      style={
        {
          ...(duration ? { "--motion-dur": `${duration}s` } : {}),
          "--motion-delay": `${delay}s`,
        } as CSSVars
      }
    >
      {children}
    </span>
  );
}

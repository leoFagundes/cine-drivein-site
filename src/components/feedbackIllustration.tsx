import React from "react";

/** Gera os pontos de uma estrela de 5 pontas para uso em <polygon>. */
function starPoints(cx: number, cy: number, outerR: number, innerR: number): string {
  const points: string[] = [];
  for (let i = 0; i < 10; i++) {
    const angle = (Math.PI / 5) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    points.push(
      `${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`,
    );
  }
  return points.join(" ");
}

// Estrelinhas dentro do balão de avaliação.
const BUBBLE_STAR_X = [176, 192, 208];

// Estrelinhas soltas em volta da cena (mais douradas, com brilho).
const SPARKLE_STARS = [
  { cx: 16, cy: 55, outerR: 4, innerR: 1.6, delay: "0.1s" },
  { cx: 16, cy: 100, outerR: 4.5, innerR: 1.8, delay: "0.5s" },
  { cx: 18, cy: 155, outerR: 4, innerR: 1.6, delay: "1s" },
  { cx: 232, cy: 60, outerR: 5, innerR: 2, delay: "0.3s" },
  { cx: 245, cy: 145, outerR: 4, innerR: 1.6, delay: "0.8s" },
  { cx: 200, cy: 170, outerR: 3.5, innerR: 1.4, delay: "1.3s" },
];

// Bolinhas soltas (tom do céu) — completam o chuvisco de brilho em volta.
const SPARKLE_DOTS = [
  { cx: 30, cy: 40, r: 1.8, delay: "0.2s" },
  { cx: 10, cy: 120, r: 1.5, delay: "0.6s" },
  { cx: 40, cy: 170, r: 1.6, delay: "1.1s" },
  { cx: 250, cy: 90, r: 1.7, delay: "0.4s" },
  { cx: 220, cy: 165, r: 1.4, delay: "0.9s" },
];

const AMBER = "#f59e0b";

export default function FeedbackIllustration() {
  return (
    <div className="flex items-center justify-center w-52 h-40 sm:w-64 sm:h-48">
      <svg viewBox="0 0 260 190" fill="none" className="w-full h-full">
        {/* céu — lua e estrelinhas distantes */}
        <circle
          cx="238"
          cy="18"
          r="20"
          fill="var(--color-primary)"
          fillOpacity="0.12"
          className="animate-pulse"
        />
        <circle cx="238" cy="18" r="12" fill="var(--color-primary)" fillOpacity="0.85" />
        <circle cx="18" cy="14" r="2" fill="var(--color-primary)" className="animate-pulse" />
        <circle
          cx="60"
          cy="10"
          r="1.4"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "0.3s" }}
        />
        <circle
          cx="100"
          cy="20"
          r="1.8"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "0.6s" }}
        />
        <circle
          cx="150"
          cy="12"
          r="1.3"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "0.9s" }}
        />
        <circle
          cx="192"
          cy="24"
          r="1.6"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />

        {/* postes da tela */}
        <rect x="50" y="118" width="5" height="46" fill="var(--color-primary)" opacity="0.3" />
        <rect x="205" y="118" width="5" height="46" fill="var(--color-primary)" opacity="0.3" />

        {/* tela de projeção */}
        <rect
          x="44"
          y="32"
          width="170"
          height="88"
          rx="10"
          fill="var(--color-primary)"
          fillOpacity="0.08"
          stroke="var(--color-primary)"
          strokeWidth="4"
        />

        {/* brilho atrás do play */}
        <ellipse
          cx="130"
          cy="76"
          rx="52"
          ry="24"
          fill="var(--color-primary)"
          fillOpacity="0.12"
          className="animate-pulse"
        />

        {/* play — "sessão em cartaz" */}
        <path d="M118,58 L149,76 L118,94 Z" fill="var(--color-primary)" />

        {/* estrelinhas e bolinhas soltas em volta da cena */}
        {SPARKLE_STARS.map((s, i) => (
          <polygon
            key={i}
            points={starPoints(s.cx, s.cy, s.outerR, s.innerR)}
            fill={AMBER}
            className="animate-pulse"
            style={{ animationDelay: s.delay }}
          />
        ))}
        {SPARKLE_DOTS.map((d, i) => (
          <circle
            key={i}
            cx={d.cx}
            cy={d.cy}
            r={d.r}
            fill="var(--color-primary)"
            className="animate-pulse"
            style={{ animationDelay: d.delay }}
          />
        ))}

        {/* sombra no chão */}
        <ellipse cx="115" cy="182" rx="90" ry="7" fill="var(--color-primary)" fillOpacity="0.08" />

        {/* carro, de frente pra telona */}
        <g>
          <path
            d="M75,150 Q75,133 92,133 L142,133 Q158,133 158,150 Z"
            fill="var(--color-primary)"
            fillOpacity="0.85"
          />
          <rect x="97" y="138" width="18" height="8" rx="3" fill="white" fillOpacity="0.55" />
          <rect x="55" y="150" width="120" height="26" rx="10" fill="var(--color-primary)" />
          <rect x="60" y="158" width="8" height="6" rx="2" fill={AMBER} />
          <rect x="167" y="158" width="8" height="6" rx="2" fill={AMBER} />
          <circle cx="80" cy="176" r="11" fill="white" stroke="var(--color-primary)" strokeWidth="5" />
          <circle cx="150" cy="176" r="11" fill="white" stroke="var(--color-primary)" strokeWidth="5" />
        </g>

        {/* balão de avaliação — sai do meio do carro (capô/painel) pra cima,
            sobrepondo o canto da tela de propósito */}
        <g className="drop-shadow-card">
          <path
            d="M170,130 L140,148 L190,130 Z"
            fill="white"
            stroke="var(--color-primary)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <rect
            x="155"
            y="88"
            width="80"
            height="44"
            rx="12"
            fill="white"
            stroke="var(--color-primary)"
            strokeWidth="3"
          />
          {BUBBLE_STAR_X.map((x, i) => (
            <polygon key={i} points={starPoints(x, 104, 6, 2.4)} fill={AMBER} />
          ))}
          <rect x="167" y="116" width="52" height="4" rx="2" fill="var(--color-primary)" fillOpacity="0.25" />
          <rect x="167" y="123" width="36" height="4" rx="2" fill="var(--color-primary)" fillOpacity="0.25" />
        </g>
      </svg>
    </div>
  );
}

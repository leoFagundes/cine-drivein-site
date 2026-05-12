"use client";

import { useMemo } from "react";
import Snowfall from "react-snowfall";

const PARTICLE_COUNT = 15;

const HALLOWEEN_COLORS = ["#ff6400", "#9600c8", "#ff4500", "#8b00ff"];
const EASTER_COLORS = ["#ffb6c1", "#bae1ff", "#ffffba", "#baffc9", "#ffdfba"];

function Particles({
  colors,
  animationName,
}: {
  colors: string[];
  animationName: string;
}) {
  const particles = useMemo(
    () =>
      Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
        id: i,
        left: `${((i / PARTICLE_COUNT) * 100 + (i % 3) * 3).toFixed(1)}%`,
        size: `${6 + (i % 4) * 3}px`,
        delay: `${((i * 0.5) % 7).toFixed(1)}s`,
        duration: `${7 + (i % 5)}s`,
        color: colors[i % colors.length],
      })),
    []
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: p.left,
            bottom: "-20px",
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            opacity: 0,
            animation: `${animationName} ${p.duration} ${p.delay} infinite ease-in-out`,
          }}
        />
      ))}
    </div>
  );
}

export function SeasonalEffects({
  event,
}: {
  event: "christmas" | "halloween" | "easter" | "default";
}) {
  if (event === "christmas") {
    return (
      <Snowfall
        snowflakeCount={80}
        color="#b0ccdd"
        speed={[0.5, 2.0]}
        wind={[-0.5, 1.5]}
        radius={[2, 7]}
      />
    );
  }

  if (event === "halloween") {
    return <Particles colors={HALLOWEEN_COLORS} animationName="emberFloat" />;
  }

  if (event === "easter") {
    return <Particles colors={EASTER_COLORS} animationName="petalFloat" />;
  }

  return null;
}

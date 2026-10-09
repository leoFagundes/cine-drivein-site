const ARC = "M8 44A34 34 0 0 1 76 44";
const ARC_LENGTH = Math.PI * 34;
const TICKS = Array.from({ length: 9 }, (_, i) => i / 8);

/** Velocímetro do HUD: o ponteiro e o arco deslizam até a nova velocidade. */
export default function Speedometer({
  kmh,
  maxKmh,
  level,
  maxLevel,
}: {
  kmh: number;
  maxKmh: number;
  level: number;
  maxLevel: number;
}) {
  const ratio = Math.max(0, Math.min(kmh / maxKmh, 1));
  const atMax = level >= maxLevel;

  return (
    <div
      className="sk-speedo"
      role="img"
      aria-label={`Velocidade: ${kmh} km/h${atMax ? " (máxima)" : ""}`}
    >
      <svg viewBox="0 0 84 50" className="sk-speedo__dial">
        <path d={ARC} className="sk-speedo__track" />
        <path
          d={ARC}
          className="sk-speedo__fill"
          style={{
            strokeDasharray: ARC_LENGTH,
            strokeDashoffset: ARC_LENGTH * (1 - ratio),
          }}
        />
        {TICKS.map((t) => {
          const a = Math.PI * (1 - t);
          return (
            <line
              key={t}
              x1={42 + Math.cos(a) * 27}
              y1={44 - Math.sin(a) * 27}
              x2={42 + Math.cos(a) * 23}
              y2={44 - Math.sin(a) * 23}
              className="sk-speedo__tick"
            />
          );
        })}
        <g
          className="sk-speedo__needle"
          style={{ transform: `rotate(${-90 + ratio * 180}deg)` }}
        >
          <line x1="42" y1="44" x2="42" y2="17" />
        </g>
        <circle cx="42" cy="44" r="3.6" className="sk-speedo__hub" />
      </svg>
      <div className="sk-speedo__readout">
        <span className="sk-speedo__value">{kmh}</span>
        <span className="sk-speedo__unit">km/h</span>
      </div>
      <span className={`sk-speedo__level${atMax ? " is-max" : ""}`}>
        {atMax ? "MÁX" : `Nível ${level + 1}`}
      </span>
    </div>
  );
}

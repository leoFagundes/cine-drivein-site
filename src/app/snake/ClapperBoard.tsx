"use client";

import { motion, useReducedMotion } from "framer-motion";

/** Claquete de cinema que bate em loop — abre, bate e faz uma pausa antes de repetir. */
export default function ClapperBoard() {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      width={72}
      height={56}
      viewBox="0 0 100 78"
      aria-hidden="true"
      className="flex-shrink-0"
    >
      <defs>
        <pattern
          id="clapperStripes"
          width="14"
          height="14"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="14" fill="#1c1917" />
          <rect x="7" width="7" height="14" fill="#fafaf9" />
        </pattern>
      </defs>

      {/* Prancheta (parte de baixo, fixa) */}
      <rect x="6" y="34" width="88" height="38" rx="5" fill="#1c1917" />
      <rect x="6" y="34" width="88" height="5" fill="#0088c2" />

      {/* Bastão da claquete — gira em torno da dobradiça, em loop suave */}
      <g transform="translate(10 34)">
        <motion.g
          style={{ transformOrigin: "0px 0px" }}
          initial={{ rotate: 0 }}
          animate={{ rotate: reduceMotion ? 0 : [0, -24, 2, 0] }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  duration: 0.75,
                  times: [0, 0.45, 0.75, 1],
                  ease: ["easeOut", "easeIn", "easeOut"],
                  repeat: Infinity,
                  repeatDelay: 3.2,
                }
          }
        >
          <rect
            x="-4"
            y="-18"
            width="88"
            height="18"
            rx="4"
            fill="url(#clapperStripes)"
            stroke="#1c1917"
            strokeWidth="2"
          />
        </motion.g>
      </g>

      {/* Dobradiça */}
      <circle cx="10" cy="34" r="3.5" fill="#0088c2" stroke="#fafaf9" strokeWidth="1.5" />
    </svg>
  );
}

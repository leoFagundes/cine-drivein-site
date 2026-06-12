import React from "react";
import { FaStar } from "react-icons/fa";

export default function FeedbackIllustration() {
  return (
    <div className="relative flex items-center justify-center w-52 h-40 sm:w-64 sm:h-48">
      <svg viewBox="0 0 240 180" fill="none" className="w-full h-full">
        {/* estrelas no céu */}
        <circle cx="28" cy="18" r="2.5" fill="var(--color-primary)" className="animate-pulse" />
        <circle
          cx="58"
          cy="10"
          r="1.8"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "0.4s" }}
        />
        <circle
          cx="205"
          cy="14"
          r="2.5"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "0.8s" }}
        />
        <circle
          cx="180"
          cy="32"
          r="1.6"
          fill="var(--color-primary)"
          className="animate-pulse"
          style={{ animationDelay: "1.2s" }}
        />

        {/* postes da tela */}
        <rect x="32" y="58" width="6" height="64" fill="var(--color-primary)" opacity="0.35" />
        <rect x="202" y="58" width="6" height="64" fill="var(--color-primary)" opacity="0.35" />

        {/* tela de projeção */}
        <rect
          x="18"
          y="18"
          width="204"
          height="104"
          rx="8"
          fill="var(--color-primary)"
          fillOpacity="0.08"
          stroke="var(--color-primary)"
          strokeWidth="4"
        />

        {/* brilho + play */}
        <circle
          cx="120"
          cy="70"
          r="28"
          fill="var(--color-primary)"
          fillOpacity="0.15"
          className="animate-pulse"
        />
        <path d="M111 55 L138 70 L111 85 Z" fill="var(--color-primary)" />

        {/* chão */}
        <rect x="0" y="152" width="240" height="28" fill="var(--color-primary)" fillOpacity="0.06" />

        {/* carro */}
        <g>
          <path
            d="M92 138 L100 119 L140 119 L148 138 Z"
            fill="var(--color-primary)"
            fillOpacity="0.85"
          />
          <rect x="78" y="138" width="84" height="22" rx="6" fill="var(--color-primary)" />
          <circle cx="98" cy="161" r="9" fill="white" stroke="var(--color-primary)" strokeWidth="4" />
          <circle cx="142" cy="161" r="9" fill="white" stroke="var(--color-primary)" strokeWidth="4" />
          <rect x="86" y="146" width="14" height="6" rx="2" fill="white" fillOpacity="0.6" />
        </g>
      </svg>

      <FaStar
        size={22}
        className="absolute top-1 right-1 text-amber-400 drop-shadow-sm animate-bounce"
      />
      <FaStar
        size={16}
        className="absolute top-6 right-10 text-amber-400 drop-shadow-sm animate-bounce"
        style={{ animationDelay: "0.2s" }}
      />
      <FaStar
        size={14}
        className="absolute -bottom-1 -left-2 text-amber-400 drop-shadow-sm animate-bounce"
        style={{ animationDelay: "0.4s" }}
      />
      <FaStar
        size={18}
        className="absolute bottom-6 -left-5 text-amber-400 drop-shadow-sm animate-bounce"
        style={{ animationDelay: "0.6s" }}
      />
      <FaStar
        size={12}
        className="absolute top-1/2 -right-4 text-amber-400 drop-shadow-sm animate-bounce"
        style={{ animationDelay: "0.8s" }}
      />
    </div>
  );
}

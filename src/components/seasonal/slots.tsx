"use client";

import { useSeasonal } from "./SeasonalProvider";

/* Pontos de encaixe dos enfeites. Sem tema ativo, não renderizam nada. */

export function SeasonalHeaderTrim() {
  const { decor } = useSeasonal();
  return decor ? <decor.HeaderTrim /> : null;
}

export function SeasonalLogoAccessory() {
  const { decor } = useSeasonal();
  return decor ? <decor.LogoAccessory /> : null;
}

/** Ornamento acima de um título; o desenho varia de forma estável com o texto. */
export function SeasonalTitleOrnament({
  seed,
  className = "",
}: {
  seed: string;
  className?: string;
}) {
  const { decor } = useSeasonal();
  if (!decor) return null;

  const variant =
    Array.from(seed).reduce(
      (acc, ch) => (acc * 31 + ch.charCodeAt(0)) % 9973,
      7,
    ) % 3;

  return (
    <span aria-hidden className={`sz-ornament ${className}`}>
      <decor.TitleOrnament variant={variant} />
    </span>
  );
}

export function SeasonalCardTrim({
  index,
  layer,
}: {
  index: number;
  layer: "back" | "front";
}) {
  const { decor } = useSeasonal();
  return decor ? <decor.CardTrim index={index} layer={layer} /> : null;
}

export function SeasonalGround() {
  const { decor } = useSeasonal();
  if (!decor) return null;
  return (
    <div aria-hidden className="sz-ground">
      <decor.Ground />
    </div>
  );
}

export function SeasonalHeroBurst() {
  const { decor } = useSeasonal();
  return decor ? <decor.HeroBurst /> : null;
}

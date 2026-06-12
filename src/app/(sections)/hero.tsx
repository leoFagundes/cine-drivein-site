"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import cineDrivein from "../../../public/images/ilustracao-drivein.png";
import cineDriveinNatal from "../../../public/images/ilustracaonatal-drivein.png";
import cineDriveinHalloween from "../../../public/images/ilustracaohalloween-drivein.png";
import cineDriveinEaster from "../../../public/images/ilustracaopascoa-drivein.png";
import { SeasonalEffects } from "@/components/seasonalEffects";
import { useSiteConfig } from "@/hooks/useSiteConfig";

type EventType = "default" | "christmas" | "halloween" | "easter";

const THEME_CLASSES = ["theme-christmas", "theme-halloween", "theme-easter"];

const eventShadow: Record<EventType, string> = {
  default: "drop-shadow-lg",
  christmas: "drop-shadow-lg",
  halloween: "drop-shadow-lg",
  easter: "drop-shadow-lg",
};

const eventBadge: Record<EventType, string | null> = {
  default: null,
  christmas: "🎄 Feliz Natal",
  halloween: "🎃 Feliz Halloween",
  easter: "🐣 Feliz Páscoa",
};

const eventTitle: Record<EventType, string> = {
  default: "Cine Drive-In",
  christmas: "🎄 Cine Drive-In — Especial de Natal",
  halloween: "🎃 Cine Drive-In — Especial de Halloween",
  easter: "🐣 Cine Drive-In — Especial de Páscoa",
};

const eventBackgrounds: Record<EventType, string> = {
  default: cineDrivein.src,
  christmas: cineDriveinNatal.src,
  halloween: cineDriveinHalloween.src,
  easter: cineDriveinEaster.src,
};

export default function Hero() {
  const [currentEvent, setCurrentEvent] = useState<EventType>("default");
  const { data: siteConfig } = useSiteConfig();

  useEffect(() => {
    if (!siteConfig) return;

    const event = siteConfig.isEvent;
    const resolved: EventType = (
      ["christmas", "halloween", "easter"] as string[]
    ).includes(event)
      ? (event as EventType)
      : "default";

    setCurrentEvent(resolved);

    THEME_CLASSES.forEach((cls) => document.body.classList.remove(cls));
    if (resolved !== "default") {
      document.body.classList.add(`theme-${resolved}`);
    }

    document.title = eventTitle[resolved];
  }, [siteConfig]);

  useEffect(() => {
    return () => {
      THEME_CLASSES.forEach((cls) => document.body.classList.remove(cls));
      document.title = "Cine Drive-In";
    };
  }, []);

  const background = eventBackgrounds[currentEvent];
  const badge = eventBadge[currentEvent];

  return (
    <section className="flex justify-center sm:gap-4 flex-wrap lg:flex-nowrap sm:min-h-[400px] w-11/12 sm:w-10/12 max-w-[1200px] mb-10 lg:my-20">
      <SeasonalEffects event={currentEvent} />
      <div className="hidden lg:flex flex-col justify-center gap-2 w-[350px] hero-enter">
        <h1 className="text-primary text-center lg:text-start font-bold text-5xl">
          PATRIMÔNIO CULTURAL
        </h1>
        <p className="text-lg text-center lg:text-start font-semibold">
          DO DISTRITO FEDERAL
        </p>
        <span className="text-primary text-center lg:text-start text-lg font-semibold">
          Projeto de Lei nº 6.055/2017
        </span>
      </div>
      <div className="relative hero-enter-delayed">
        <div
          className={`relative rounded-lg overflow-hidden shadow-card ${eventShadow[currentEvent]}`}
        >
          <Image
            className="block w-[700px] max-w-full bg-center"
            src={background}
            width={700}
            height={500}
            alt="Cine Drive-In"
          />
          {badge && (
            <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              {badge}
            </span>
          )}
          <div className="lg:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pt-12 pb-4 px-4 flex gap-1 flex-col items-center text-center">
            <div>
              <p className="font-bold text-white text-xl drop-shadow-sm">
                PATRIMÔNIO CULTURAL
              </p>
              <p className="text-base italic font-medium text-white/90 drop-shadow-sm">
                Do Distrito Federal
              </p>
            </div>
            <p className="text-white text-center text-sm font-semibold italic drop-shadow-sm">
              Projeto de Lei nº 6.055/2017
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

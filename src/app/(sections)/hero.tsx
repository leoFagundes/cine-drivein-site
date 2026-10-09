"use client";

import Image from "next/image";
import React, { useState } from "react";
import cineDrivein from "../../../public/images/ilustracao-drivein.webp";
import cineDriveinNatal from "../../../public/images/ilustracaonatal-drivein.webp";
import cineDriveinHalloween from "../../../public/images/ilustracaohalloween-drivein.webp";
import cineDriveinEaster from "../../../public/images/ilustracaopascoa-drivein.webp";
import { useSeasonal } from "@/components/seasonal/SeasonalProvider";
import { SeasonalHeroBurst } from "@/components/seasonal/slots";
import { SEASONAL_META, type SeasonalTheme } from "@/lib/seasonal";

const seasonalBackgrounds: Record<SeasonalTheme, string> = {
  christmas: cineDriveinNatal.src,
  halloween: cineDriveinHalloween.src,
  easter: cineDriveinEaster.src,
};

export default function Hero() {
  const { theme } = useSeasonal();
  // Só revela a versão sazonal depois que ela carregou: troca em crossfade, sem piscar.
  const [loadedTheme, setLoadedTheme] = useState<SeasonalTheme | null>(null);
  const showSeasonal = theme !== null && loadedTheme === theme;

  return (
    <section className="flex justify-center sm:gap-4 flex-wrap lg:flex-nowrap sm:min-h-[400px] w-11/12 sm:w-10/12 max-w-[1200px] mb-10 lg:my-20">
      <div className="hidden lg:flex flex-col justify-center gap-2 w-[350px] hero-enter">
        <h1 className="text-primary text-center lg:text-start font-bold text-5xl">
          PATRIMÔNIO CULTURAL
        </h1>
        <p className="text-lg text-center lg:text-start font-semibold">
          DO DISTRITO FEDERAL
        </p>
        <span className="text-primary text-center lg:text-start text-lg font-semibold">
          Lei Distrital nº 6.055/2017
        </span>
      </div>
      <div className="relative hero-enter-delayed">
        <div className="hero-card relative rounded-lg overflow-hidden shadow-card drop-shadow-lg">
          <Image
            className="block w-[700px] max-w-full bg-center"
            src={cineDrivein.src}
            width={700}
            height={500}
            alt="Cine Drive-In"
            priority
          />
          {theme && (
            <Image
              key={theme}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                showSeasonal ? "opacity-100" : "opacity-0"
              }`}
              src={seasonalBackgrounds[theme]}
              width={700}
              height={500}
              alt=""
              onLoad={() => setLoadedTheme(theme)}
            />
          )}
          {showSeasonal && (
            <span className="sz-badge absolute top-3 right-3 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full">
              {SEASONAL_META[theme].badge}
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
              Lei Distrital nº 6.055/2017
            </p>
          </div>
        </div>
        {showSeasonal && <SeasonalHeroBurst />}
      </div>
    </section>
  );
}

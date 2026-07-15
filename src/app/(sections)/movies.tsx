"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import { useRouter } from "next/navigation";
import { Film } from "@/types/Types";
import Image from "next/image";
import { IoWarning, IoReload } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import { FaCirclePlay } from "react-icons/fa6";
import Button from "@/components/button";
import { useSiteConfig } from "@/hooks/useSiteConfig";
import { trackEvent } from "@/lib/analytics";

type FilmWithSession = Film & {
  sessionKey: string;
};

export default function Movies() {
  const [data, setData] = useState<FilmWithSession[] | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [isClosedToday, setIsClosedToday] = useState(false);
  const [isWarnClosedOpen, setIsWarnClosedOpen] = useState(false);
  const { data: siteConfig, loading, error, reload } = useSiteConfig();
  const router = useRouter();

  useEffect(() => {
    if (!siteConfig) return;

    const sessions = [
      siteConfig.session1,
      siteConfig.session2,
      siteConfig.session3,
      siteConfig.session4,
    ];

    const films: FilmWithSession[] = sessions
      .map((session, index) => {
        if (!session) return null;
        return { ...session, sessionKey: `screening${index + 1}` };
      })
      .filter(Boolean) as FilmWithSession[];

    setData(films);
    setContainerWidth(350 * films.length + 48 * films.length);
    setIsClosedToday(siteConfig.isClosed);
    setIsWarnClosedOpen(siteConfig.isClosed);
  }, [siteConfig]);

  if (error)
    return (
      <SectionContainer
        title="EM CARTAZ"
        subtitle="Confira a programação atual"
      >
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1">
            <IoWarning className="text-orange-700" size={"20px"} />
            <h3 className="font-semibold text-lg text-orange-700">
              Ops, parece que tivemos um erro ao carregar os filmes...
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <IoReload className="text-orange-700" size={"20px"} />
            <p
              className="text-orange-700 cursor-pointer text-lg font-semibold underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
              onClick={reload}
            >
              Tente novamente
            </p>
          </div>
        </div>
      </SectionContainer>
    );

  return (
    <SectionContainer
      title="EM CARTAZ"
      subtitle={`${
        isClosedToday ? "Hoje estamos fechados!" : "Confira a programação atual"
      }`}
    >
      {loading && (
        <div className="flex justify-center w-full gap-8 flex-wrap">
          {[0, 1, 2].map((i) => (
            <div key={i} className="w-[350px] animate-pulse">
              <div className="w-[350px] h-[500px] rounded-lg bg-stone-200" />
              <div className="flex flex-col gap-2 p-3">
                <div className="h-4 bg-stone-200 rounded-md w-3/4" />
                <div className="h-3 bg-stone-200 rounded-md w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
      {isWarnClosedOpen && (
        <div className="absolute flex justify-center items-start md:items-center w-full h-full bg-stone-100/60 backdrop-blur-[2px] z-20 p-8">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] bg-white rounded-2xl border border-stone-200 p-8 text-center flex flex-col items-center gap-5 shadow-sm hover:cursor-default"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <BiError className="text-[22px] text-amber-600" />
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-medium tracking-[0.13em] uppercase text-amber-600">
                Aviso
              </span>
              <h2 className="text-[18px] font-semibold text-stone-900 leading-snug">
                Hoje o Cine Drive-in
                <br />
                estará fechado
              </h2>
              <p className="text-[13px] text-stone-400 mt-0.5">
                Volte em breve para conferir a programação.
              </p>
            </div>

            <Button
              onClick={() => setIsWarnClosedOpen(false)}
              className="w-full bg-stone-900 text-stone-100 hover:bg-stone-800 text-sm"
            >
              Ver filmes em cartaz
            </Button>
          </div>
        </div>
      )}

      <div
        className="flex justify-center w-full gap-8 flex-wrap"
        style={{ maxWidth: containerWidth }}
      >
        {data?.map((film, index) => {
          const { title, showtime, image, classification } = film;

          return (
            <div
              key={index}
              onClick={() => {
                void trackEvent({ type: "filmClick", filmName: title, session: film.sessionKey });
                router.push(`/film/detail/${film.sessionKey}`);
              }}
              className="w-[350px] group contrast-[1.1] hover:cursor-pointer duration-200"
            >
              <div className="relative overflow-hidden rounded-lg shadow-card">
                <img
                  src={image}
                  alt={title}
                  className="w-[350px] h-[500px] rounded-lg shadow-md sm:group-hover:scale-110 duration-500"
                />
                <div className="hidden sm:flex absolute inset-0 flex-col justify-end p-4 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white font-bold text-lg leading-snug">
                    {title}
                  </p>
                  <p className="text-white/80 text-sm font-medium">
                    {showtime}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-white text-xs font-semibold">
                    <FaCirclePlay size={14} />
                    Ver detalhes
                  </span>
                </div>
                {(film.avisos ?? []).length > 0 && (
                  <div className="flex flex-col gap-1.5 ml-2 mt-1 absolute bottom-2 right-2 transition-transform duration-300 sm:group-hover:-translate-y-24">
                    {(film.avisos ?? []).map((aviso, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-black/30 backdrop-blur-[4px] border border-white/50 rounded-md px-3 py-2"
                      >
                        <BiError
                          className="text-white mt-0.5 flex-shrink-0"
                          size={15}
                        />
                        <p className="text-xs text-white font-medium leading-snug">
                          {aviso}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col relative gap-1 p-3 border-gray rounded-b-lg">
                <div className="flex justify-between gap-1">
                  <p className="text-sm font-bold">{title}</p>

                  <div className="min-w-8 min-h-8">
                    <Image
                      src={`/images/classifications/classificacao-${classification}.png`}
                      width={32}
                      height={32}
                      alt="classification"
                    />
                  </div>
                </div>

                <p className="text-sm">
                  <span className="font-semibold">Horário:</span> {showtime}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </SectionContainer>
  );
}

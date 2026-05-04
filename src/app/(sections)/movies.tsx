"use client";

/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import { useRouter } from "next/navigation";
import FilmRepositories from "@/services/repositories/FilmRepositorie";
import { Film, SiteConfig } from "@/types/Types";
import Image from "next/image";
import Loader from "@/components/loader";
import { IoWarning, IoReload } from "react-icons/io5";
import { BiError } from "react-icons/bi";
import SiteConfigsRepository from "@/services/repositories/SiteConfigsRepositorie";
import Button from "@/components/button";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

type FilmWithSession = Film & {
  sessionKey: string;
};

export default function Movies() {
  const [data, setData] = useState<FilmWithSession[] | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [isClosedToday, setIsClosedToday] = useState(false);
  const [isWarnClosedOpen, setIsWarnClosedOpen] = useState(false);
  const router = useRouter();

  async function fetchFilms() {
    setLoading(true);
    setLoadError(false);

    try {
      const ref = doc(db, "siteConfig", "main");
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        throw new Error("Config não encontrada");
      }

      const data = snap.data() as SiteConfig;

      const sessions: (Film | null | undefined)[] = [
        data.session1,
        data.session2,
        data.session3,
        data.session4,
      ];

      const films: FilmWithSession[] = sessions
        .map((session, index) => {
          if (!session) return null;

          return {
            ...session,
            sessionKey: `screening${index + 1}`,
          };
        })
        .filter(Boolean) as FilmWithSession[];

      setData(films);
      setContainerWidth(350 * films.length + 48 * films.length);

      setIsClosedToday(data.isClosed);
      setIsWarnClosedOpen(data.isClosed);
    } catch (error) {
      console.error("Erro ao carregar filmes", error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchFilms();
  }, []);

  function handleReload() {
    fetchFilms();
  }

  if (loadError)
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
              onClick={handleReload}
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
      {loading && <Loader />}
      {isWarnClosedOpen && (
        <div className="absolute flex justify-center items-start md:items-center w-full h-full bg-stone-100/60 backdrop-blur-[2px] z-20 p-8">
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[360px] bg-white rounded-2xl border border-stone-200 p-8 text-center flex flex-col items-center gap-5 shadow-sm hover:cursor-default"
          >
            {/* Ícone */}
            <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
              <BiError className="text-[22px] text-amber-600" />
            </div>

            {/* Textos */}
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

            {/* Botão */}
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

          const sessionNumber = index + 1;

          return (
            <div
              key={index}
              onClick={() => router.push(`/film/detail/${film.sessionKey}`)}
              className="w-[350px] group contrast-[1.1] hover:cursor-pointer duration-200"
            >
              <div className="relative overflow-hidden rounded-lg shadow-card">
                <img
                  src={image}
                  alt={title}
                  className="w-[350px] h-[500px] rounded-lg shadow-md sm:group-hover:scale-110 duration-500"
                />
                {/* Avisos */}
                {(film.avisos ?? []).length > 0 && (
                  <div className="flex flex-col gap-1.5 mt-1 absolute bottom-2 right-2">
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

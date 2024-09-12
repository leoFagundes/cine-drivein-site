"use client";

/* eslint-disable @next/next/no-img-element */
import React, { Fragment, useEffect, useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import { useRouter } from "next/navigation";
import FilmRepositories from "@/services/repositories/FilmRepositorie";
import { FilmProps } from "@/types/Types";
import Image from "next/image";
import Loader from "@/components/loader";
import { IoWarning, IoReload } from "react-icons/io5";
import { BiError } from "react-icons/bi";

export default function Movies() {
  const [data, setData] = useState<FilmProps[] | undefined>(undefined);
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
      const films = await FilmRepositories.getFilms();

      // Ordena os filmes pela ordem das sessões
      const sortedFilms = films.sort((a: any, b: any) => {
        const sessionOrder = ["Sessão 1", "Sessão 2", "Sessão 3"];
        return (
          sessionOrder.indexOf(a.screening) - sessionOrder.indexOf(b.screening)
        );
      });

      setData(sortedFilms);
      setContainerWidth(350 * sortedFilms.length + 48 * sortedFilms.length);

      // setIsClosedToday(true);
      // setIsWarnClosedOpen(true);
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
        <div
          onClick={() => setIsWarnClosedOpen(false)}
          className="absolute flex hover:cursor-pointer justify-center items-start md:items-center w-full h-full bg-gray/50 z-20 p-8"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-[450px] h-[300px] shadow-card bg-primary rounded-lg p-3 hover:cursor-default"
          >
            <div className="absolute top-0 left-0 flex items-center justify-center h-full w-full rounded-lg">
              <BiError className="text-gray/20 scale-[16]" />
            </div>
            <div className="flex justify-center items-center flex-col gap-2 z-10 rounded-lg backdrop-blur-[2px] h-full w-full">
              <h2 className="font-bold text-3xl text-center text-primary">
                AVISO
              </h2>
              <h2 className="font-semibold text-2xl text-center">
                Hoje o Cine Drive-in estará fechado
              </h2>
              <h2
                onClick={() => setIsWarnClosedOpen(false)}
                className="font-semibold text-primary text-xl underline hover:cursor-pointer"
              >
                Ver filmes em cartaz
              </h2>
            </div>
          </div>
        </div>
      )}

      <div
        className={`flex justify-around w-full gap-8 flex-wrap`}
        style={{ maxWidth: containerWidth }}
      >
        {data?.map(
          (
            { _id, title, showtime, image, classification, screening },
            index
          ) => (
            <Fragment key={index}>
              {title ? (
                <div
                  onClick={() => {
                    if (screening === "Sessão 1") {
                      router.push(`/film/detail/screening1`);
                    }
                    if (screening === "Sessão 2") {
                      router.push(`/film/detail/screening2`);
                    }
                    if (screening === "Sessão 3") {
                      router.push(`/film/detail/screening3`);
                    }
                  }}
                  className="w-[350px] group contrast-[1.1] hover:cursor-pointer duration-200"
                >
                  <div className="relative overflow-hidden rounded-lg shadow-card">
                    <img
                      src={image}
                      alt={title}
                      className="w-[350px] h-[500px] rounded-lg shadow-md sm:group-hover:scale-110 duration-500 "
                    />
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
              ) : (
                ""
              )}
            </Fragment>
          )
        )}
      </div>
    </SectionContainer>
  );
}

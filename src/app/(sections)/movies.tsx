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

export default function Movies() {
  const [data, setData] = useState<FilmProps[] | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
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
    <SectionContainer title="EM CARTAZ" subtitle="Confira a programação atual">
      {loading && <Loader />}

      <div
        className={`flex justify-around w-full gap-8 flex-wrap`}
        style={{ maxWidth: containerWidth }}
      >
        {data?.map(({ _id, title, showtime, image, classification }, index) => (
          <Fragment key={index}>
            {title ? (
              <div
                onClick={() => router.push(`/filmDetail/${_id}`)}
                className="w-[350px] group contrast-[1.1] hover:cursor-pointer duration-200"
              >
                <div className="relative overflow-hidden rounded-lg shadow-card">
                  <img
                    src={image}
                    alt={title}
                    className="rounded-lg shadow-md sm:group-hover:scale-110 duration-500 "
                  />
                </div>
                <div className="flex flex-col relative gap-1 p-3 border-gray rounded-b-lg">
                  <div className="flex justify-between gap-1">
                    <p className="text-sm font-bold">{title}</p>
                    <Image
                      src={`/images/classifications/classificacao-${classification}.png`}
                      width={32}
                      height={32}
                      alt="classification"
                    />
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
        ))}
      </div>
    </SectionContainer>
  );
}

"use client";

/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import { useRouter } from "next/navigation";
import FilmRepositories from "@/services/repositories/FilmRepositorie";
import { FilmProps } from "@/types/Types";
import Image from "next/image";
import Loader from "@/components/loader";

export default function Movies() {
  const [data, setData] = useState<FilmProps[] | undefined>(undefined);
  const [containerWidth, setContainerWidth] = useState(1000);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      try {
        const films = await FilmRepositories.getFilms();

        // Ordena os filmes pela ordem das sessões
        const sortedFilms = films.sort((a: any, b: any) => {
          const sessionOrder = ["Sessão 1", "Sessão 2", "Sessão 3"];
          return (
            sessionOrder.indexOf(a.screening) -
            sessionOrder.indexOf(b.screening)
          );
        });

        setData(sortedFilms);
        setContainerWidth(350 * sortedFilms.length + 48 * sortedFilms.length);
      } catch (error) {
        console.error("Erro ao carregar filmes", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  return (
    <SectionContainer
      title="EM CARTAZ"
      subtitle="Programação de 22 a 28 de Agosto"
    >
      {loading && <Loader />}

      <div
        className={`flex justify-around w-full gap-8 flex-wrap`}
        style={{ maxWidth: containerWidth }}
      >
        {data?.map(
          (
            { _id, screening, title, showtime, image, classification },
            index
          ) => (
            <div
              onClick={() => router.push(`/filmDetail/${_id}`)}
              key={index}
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
          )
        )}
      </div>
    </SectionContainer>
  );
}

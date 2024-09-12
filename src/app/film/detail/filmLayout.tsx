/* eslint-disable @next/next/no-img-element */

import { FilmProps } from "@/types/Types";
import React from "react";

interface FilmLayoutProps {
  data: FilmProps | undefined;
}

export default function FilmLayout({ data }: FilmLayoutProps) {
  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      <div className="flex gap-6 justify-center md:justify-start md:flex-nowrap flex-wrap">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="max-w-[400px] text-center text-3xl text-cente font-bold text-primary">
            {data?.title}
          </h1>
          <img
            className="max-w-[350px] rounded-lg shadow-card"
            src={data?.image}
            alt="film"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-xl">Sinopse</p>
          <p className="text-sm lg:text-base">{data?.synopsis}</p>
          <div>
            {data?.writer && data?.writer.length > 0 && (
              <p>
                <span className="font-semibold">Roteiro:</span>{" "}
                {data?.writer.join(", ")}
              </p>
            )}

            {data?.cast && data?.cast.length > 0 && (
              <p>
                <span className="font-semibold">Elenco:</span>{" "}
                {data?.cast.join(", ")}
              </p>
            )}

            {data?.genres && data?.genres.length > 0 && (
              <p>
                <span className="font-semibold">Gênero:</span>{" "}
                {data?.genres.join(", ")}
              </p>
            )}

            {data?.duration && (
              <p>
                <span className="font-semibold">Duração:</span> {data?.duration}
              </p>
            )}

            {data?.language && (
              <p>
                <span className="font-semibold">Idioma:</span> {data?.language}
              </p>
            )}

            {data?.showtime && (
              <p>
                <span className="font-semibold">Horários:</span>{" "}
                {data?.showtime}
              </p>
            )}

            {data?.displayDate && (
              <p>
                <span className="font-semibold">Data de Exibição:</span>{" "}
                {data?.displayDate}
              </p>
            )}

            {data?.classification && (
              <p>
                <span className="font-semibold">Classificação:</span>{" "}
                {data?.classification.toLowerCase() === "l"
                  ? "Livre"
                  : data?.classification}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h1 className="text-center text-3xl text-cente font-bold text-primary">
          TRAILER
        </h1>
        <iframe
          className="w-full h-[300px] md:h-[500px] rounded-lg shadow-card"
          src={data?.trailer}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

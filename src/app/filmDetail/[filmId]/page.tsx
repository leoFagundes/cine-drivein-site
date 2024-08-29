"use client";

import Loader from "@/components/loader";
import FilmRepositories from "@/services/repositories/FilmRepositorie";
import { FilmProps } from "@/types/Types";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";

interface FilmDetailsProps {
  params: {
    filmId: string;
  };
}

export default function FilmDetails({ params }: FilmDetailsProps) {
  const [data, setData] = useState<FilmProps | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      try {
        const films = await FilmRepositories.getFilmById(params.filmId);
        const videoId = films.trailer.split("v=")[1];
        const embedUrl = `https://www.youtube.com/embed/${videoId}`;

        setData({ ...films, trailer: embedUrl });
      } catch (error) {
        console.error("Erro ao carregar filmes", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFilms();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center top-0 left-0 fixed h-screen w-screen bg-primary">
        <Loader />
      </div>
    );

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
            <p>
              <span className="font-semibold">Roteiro:</span>{" "}
              {data?.writer.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Elenco:</span>{" "}
              {data?.cast.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Gênero:</span>{" "}
              {data?.genres.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Duração:</span> {data?.duration}
            </p>
            <p>
              <span className="font-semibold">Idioma:</span> {data?.language}
            </p>
            <p>
              <span className="font-semibold">Horários:</span> {data?.showtime}
            </p>
            <p>
              <span className="font-semibold">Data de Exibição:</span>{" "}
              {data?.displayDate}
            </p>
            <p>
              <span className="font-semibold">Classificação:</span>{" "}
              {data?.classification.toLowerCase() === "l"
                ? "Livre"
                : data?.classification}
            </p>
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

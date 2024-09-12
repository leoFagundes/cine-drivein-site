"use client";

/* eslint-disable @next/next/no-img-element */
import Loader from "@/components/loader";
import FilmRepositories from "@/services/repositories/FilmRepositorie";
import { FilmProps } from "@/types/Types";
import React, { useEffect, useState } from "react";
import FilmLayout from "../filmLayout";

export default function FilmDetails() {
  const [data, setData] = useState<FilmProps | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      try {
        const films = await FilmRepositories.getFilmById(
          "66e1c4e4a62058ebe52f3a66"
        );
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

  return <FilmLayout data={data} />;
}

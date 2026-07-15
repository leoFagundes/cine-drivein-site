"use client";

/* eslint-disable @next/next/no-img-element */
import Loader from "@/components/loader";
import { Film, SiteConfig } from "@/types/Types";
import React, { useEffect, useState } from "react";
import FilmLayout from "../filmLayout";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useRouter } from "next/navigation";

export default function FilmDetails() {
  const [data, setData] = useState<Film | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchFilm() {
      setLoading(true);

      try {
        const ref = doc(db, "siteConfig", "main");
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          throw new Error("Config não encontrada");
        }

        const config = snap.data() as SiteConfig;

        const film = config.session4;

        if (!film) {
          throw new Error("session4 não encontrada");
        }

        let embedUrl = film.trailer;

        if (film.trailer.includes("v=")) {
          const videoId = film.trailer.split("v=")[1];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        }

        setData({
          ...film,
          trailer: embedUrl,
        });
      } catch (error) {
        console.error("Erro ao carregar filme", error);
        router.push("/error");
      } finally {
        setLoading(false);
      }
    }

    fetchFilm();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center top-0 left-0 fixed h-screen w-screen bg-primary">
        <Loader />
      </div>
    );

  return <FilmLayout data={data} />;
}

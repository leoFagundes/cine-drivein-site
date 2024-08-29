"use client";

/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionContainer from "../../containers/sectionContainer";
import { useRouter } from "next/navigation";

export default function Movies() {
  const router = useRouter();
  const data = [
    {
      id: "1234",
      title: "HAROLD E O LÁPIS MÁGICO LÁ (DUB)",
      showtime: "18h00",
      image: "images/image_21.png",
      classification: "l",
      synopsis: "descriçãoblablaa",
      director: "Tony Goldwyn",
      writer: "Tony Spiridakis",
      cast: ["Bobby Cannavale", "Robert De Niro", "Rose Byrne"],
      genres: ["Comédia", "Comédia dramática", "Drama"],
      duration: "102 min.",
      language: "Legendado",
      displayDate: "22 a 28/08/2024",
      trailer: (
        <iframe
          className="w-full h-[300px] md:h-[500px] rounded-lg shadow-card"
          src="https://www.youtube.com/embed/crJfmNciZso?si=v6U1EN5kW5rEEqGB"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ),
    },
    {
      id: "12345",
      title: "HAROLD E O LÁPIS MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_19.png",
      classification: "12",
      synopsis: "descriçãoblablaa",
      director: "Tony Goldwyn",
      writer: "Tony Spiridakis",
      cast: ["Bobby Cannavale", "Robert De Niro", "Rose Byrne"],
      genres: ["Comédia", "Comédia dramática", "Drama"],
      duration: "102 min.",
      language: "Legendado",
      displayDate: "22 a 28/08/2024",
      trailer: (
        <iframe
          className="w-full h-[300px] md:h-[500px] rounded-lg shadow-card"
          src="https://www.youtube.com/embed/crJfmNciZso?si=v6U1EN5kW5rEEqGB"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ),
    },
    {
      id: "12346",
      title: "HAROLD E O LÁPIS MÁGICO MÁGICO MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_20.png",
      classification: "16",
      synopsis: "descriçãoblablaa",
      director: "Tony Goldwyn",
      writer: "Tony Spiridakis",
      cast: ["Bobby Cannavale", "Robert De Niro", "Rose Byrne"],
      genres: ["Comédia", "Comédia dramática", "Drama"],
      duration: "102 min.",
      language: "Legendado",
      displayDate: "22 a 28/08/2024",
      trailer: (
        <iframe
          className="w-full h-[300px] md:h-[500px] rounded-lg shadow-card"
          src="https://www.youtube.com/embed/crJfmNciZso?si=v6U1EN5kW5rEEqGB"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      ),
    },
  ];

  const containerWidth = 350 * data.length + 48 * data.length;
  console.log(containerWidth);

  return (
    <SectionContainer
      title="EM CARTAZ"
      subtitle="Programação de 22 a 28 de Agosto"
    >
      <div
        className={`flex justify-around w-full gap-8 flex-wrap`}
        style={{ maxWidth: containerWidth }}
      >
        {data.map(({ id, title, showtime, image, classification }, index) => (
          <div
            onClick={() => router.push(`/film/${id}`)}
            key={index}
            className="w-[350px] group contrast-[1.1] hover:cursor-pointer duration-200"
          >
            <div className="relative overflow-hidden rounded-lg shadow-card">
              <img
                src={image}
                alt={title}
                className="rounded-lg shadow-md sm:group-hover:scale-110 duration-500 "
              />
              {/* <div className="justify-center items-center hidden group-hover:flex absolute bottom-0 h-full w-full" /> */}
            </div>
            <div className="flex flex-col relative gap-1 p-3 border-gray rounded-b-lg">
              <div className="flex justify-between gap-1">
                <p className="text-sm font-bold">{title}</p>
                <img
                  className="w-8 h-8 "
                  src={`/images/classificacao-${classification}.png`}
                  alt="movie classification"
                />
              </div>
              <p className="text-sm">
                <span className="font-semibold">Horário:</span> {showtime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

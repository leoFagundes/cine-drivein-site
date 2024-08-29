/* eslint-disable @next/next/no-img-element */
import React from "react";

interface FilmDetailsProps {
  params: {
    filmId: string;
  };
}

export default function FilmDetails({ params }: FilmDetailsProps) {
  const data = {
    id: "1234",
    title: "HAROLD E O LÁPIS MÁGICO LÁ (DUB)",
    showtime: "18h00",
    image: "images/image_21.png",
    classification: "l",
    synopsis:
      "Adaptado do romance infantil de Crockett Johnson (1955), Harold e o Lápis Mágico vai contar a história de Harold (Zachary Levi), um menino de 4 anos que cria um mundo mágico usando apenas duas coisas muito preciosas: a sua imaginação e um lápis roxo! Dentro de seu livro, Harold pode fazer qualquer coisa ganhar vida simplesmente desenhando com esse lápis mágico. No entanto, quando ele cresce e deixa de desenhar apenas nas páginas do livro e começa a desenhar no mundo físico, descobre que tem muito mais a aprender sobre a vida real do que ele imaginava. Além disso, seu confiável lápis roxo pode desencadear mais travessuras hilárias que, na maioria, estão fora do seu controle. Quando o poder da imaginação ilimitada cai nas mãos erradas, será preciso toda a criatividade de Harold e seus amigos para salvar o mundo real e o seu próprio.",
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
  };

  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      <div className="flex gap-6 justify-center md:justify-start md:flex-nowrap flex-wrap">
        <div className="flex flex-col gap-4 items-center">
          <h1 className="max-w-[400px] text-center text-3xl text-cente font-bold text-primary">
            {data.title}
          </h1>
          <img
            className="max-w-[350px] rounded-lg shadow-card"
            src="/images/image_21.png"
            alt="film"
          />
        </div>
        <div className="flex flex-col gap-4">
          <p className="font-semibold text-xl">Sinopse</p>
          <p className="text-sm lg:text-base">{data.synopsis}</p>
          <div>
            <p>
              <span className="font-semibold">Roteiro:</span> {data.writer}
            </p>
            <p>
              <span className="font-semibold">Elenco:</span>{" "}
              {data.cast.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Gênero:</span>{" "}
              {data.genres.join(", ")}
            </p>
            <p>
              <span className="font-semibold">Duração:</span> {data.duration}
            </p>
            <p>
              <span className="font-semibold">Idioma:</span> {data.language}
            </p>
            <p>
              <span className="font-semibold">Horários:</span> {data.showtime}
            </p>
            <p>
              <span className="font-semibold">Data de Exibição:</span>{" "}
              {data.displayDate}
            </p>
            <p>
              <span className="font-semibold">Classificação:</span> Livre
            </p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h1 className="text-center text-3xl text-cente font-bold text-primary">
          TRAILER
        </h1>
        {data.trailer}
      </div>
    </section>
  );
}

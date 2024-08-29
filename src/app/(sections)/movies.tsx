/* eslint-disable @next/next/no-img-element */
import React from "react";
import SectionContainer from "../../containers/sectionContainer";

export default function Movies() {
  const data = [
    {
      title: "HAROLD E O LÁPIS MÁGICO LÁ (DUB)",
      showtime: "18h00",
      image: "images/image_21.png",
      classification: "l",
    },
    {
      title: "HAROLD E O LÁPIS MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_19.png",
      classification: "12",
    },
    {
      title: "HAROLD E O LÁPIS MÁGICO MÁGICO MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_20.png",
      classification: "16",
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
        className={`flex justify-around w-full py-6 gap-8 flex-wrap`}
        style={{ maxWidth: containerWidth }}
      >
        {data.map(({ title, showtime, image, classification }, index) => (
          <div
            key={index}
            className="w-[350px] group sm:hover:contrast-[1.1] hover:cursor-pointer duration-200 hover:"
          >
            <div className="relative ">
              <img src={image} alt={title} className="rounded-lg shadow-md" />
              <div className="justify-center items-center hidden group-hover:flex group-hover:animate-fadeIn absolute bg-circular-gradient bottom-0 h-full w-full" />
            </div>
            <div className="flex flex-col relative gap-1 p-3 border-gray rounded-b-lg">
              <div className="flex justify-between gap-1">
                <p className="text-sm font-bold">{title}</p>
                <img
                  className=" w-8 h-8 "
                  src={`images/classificacao-${classification}.png`}
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

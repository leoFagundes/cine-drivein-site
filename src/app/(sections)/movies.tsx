import React from "react";
import SectionContainer from "../containers/sectionContainer";

export default function Movies() {
  const data = [
    {
      title: "HAROLD E O LÁPIS MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_21.png",
    },
    {
      title: "HAROLD E O LÁPIS MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_19.png",
    },
    {
      title: "HAROLD E O LÁPIS MÁGICO (DUB)",
      showtime: "18h00",
      image: "images/image_20.png",
    },
  ];

  const containerWidth = 300 * data.length + 48 * data.length;
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
        {data.map(({ title, showtime, image }, index) => (
          <div
            key={index}
            className="w-[300px] hover:opacity-80 hover:cursor-pointer duration-200 hover:"
          >
            <img src={image} alt={title} className="rounded-t-lg " />
            <div className="flex flex-col relative gap-2 p-3 border-r-2 border-b-2 border-l-2 border-gray rounded-b-lg">
              <p className="text-xs font-bold">{title}</p>
              <p className=" text-xs">
                <span className="font-semibold">Horário:</span> {showtime}
              </p>
            </div>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}

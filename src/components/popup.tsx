"use client";

import { useState } from "react";
import { CgClose } from "react-icons/cg";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupInfo, setPopupInfo] = useState({
    title: "Evento de Natal",
    messages: [
      "Estamos realizando um evento de natal do dia 20 ao dia 30 de dezembro. Venha ver!",
      "Venha conferir os eventos.",
    ],
    image: "https://www.ivoti.rs.gov.br/admin/imagens/noticias/card-natal1.jpg",
  });

  return (
    <>
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="flex justify-center items-center fixed w-screen h-screen bg-gray/50 backdrop-blur-sm top-0 left-0 z-50 hover:cursor-pointer animate-fadeIn"
        >
          {popupInfo.image ? (
            <>
              <div
                className="h-full w-full max-w-[90%] max-h-[90%] bg-contain bg-no-repeat bg-center "
                style={{ backgroundImage: `url(${popupInfo.image})` }}
              />
              <CgClose
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-8 text-white hover:cursor-pointer"
                size={32}
              />
            </>
          ) : (
            <article
              className="flex flex-col justify-center gap-4 hover:cursor-default w-[350px] min-h-[200px] bg-primary rounded-lg shadow-card p-4 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-center font-semibold text-2xl text-primary">
                {popupInfo.title}
              </h2>
              <div className="flex flex-col gap-2">
                {popupInfo.messages.map((message, index) => (
                  <p key={index} className="font-medium">
                    {message}
                  </p>
                ))}
              </div>
              <CgClose
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray hover:cursor-pointer"
                size={20}
              />
            </article>
          )}
        </div>
      )}
    </>
  );
}

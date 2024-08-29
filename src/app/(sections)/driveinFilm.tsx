/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import Modal from "@/components/modal";

export default function DriveinFilm() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <SectionContainer
      title="O ÚLTIMO CINE DRIVE-IN"
      subtitle="Disponível na Netflix"
    >
      <div className="flex items-center flex-col gap-8 w-11/12 sm:10/12 max-w-[1200px]">
        <iframe
          className="shadow-lg rounded-lg w-[90%] max-w-[560px] h-[200px] sm:h-[315px]"
          src="https://www.youtube.com/embed/2QLudKcat2A?si=Wz-LKd_zRmeW2PnZ"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
        <p className="font-semibold">
          Ao retornar a sua cidade natal com sua mãe adoecida, Marlombrando
          reencontra seu pai e o cinema Drive-in onde passou sua infância.
          Almeida, mantém o cinema funcionando com apenas dois funcionários:
          Paula cuida da projeção e da lanchonete; José, um velho amigo de
          Almeida, atende a bilheteria e faz limpeza do local. A chegada de
          Marlombrando e a ameaça de demolição do Drive-in, trará um novo rumo
          para suas vidas.
        </p>

        <p
          onClick={() => setIsModalOpen(true)}
          className="font-semibold text-primary self-start underline hover:cursor-pointer"
        >
          Conheça um pouco mais da nossa história!
        </p>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <a
          className="h-full"
          href="/images/history.png"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img className="h-full" src="/images/history.png" alt="history" />
        </a>
      </Modal>
    </SectionContainer>
  );
}

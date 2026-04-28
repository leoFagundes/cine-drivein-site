"use client";

import { useEffect, useState } from "react";
/* eslint-disable @next/next/no-img-element */
import SectionContainer from "../../containers/sectionContainer";
import Modal from "@/components/modal";
import Link from "next/link";
import ticket from "../../../public/images/ticket.png";
import menu from "../../../public/images/menu.png";
import { FaExpand } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import ScheduleRepositories from "@/services/repositories/ScheduleRepositories";
import { Schedule } from "@/types/Types";

export default function Snack() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [schedule, setSchedule] = useState<Partial<Schedule>>({
    closingTime: "23:00",
    openingTime: "17:30",
  });

  // useEffect(() => {
  //   async function fecthSchedule() {
  //     try {
  //       const newSchedule = await ScheduleRepositories.getSchedule();
  //       setSchedule({
  //         closingTime: newSchedule.closingTime,
  //         openingTime: newSchedule.openingTime,
  //       });
  //     } catch (error) {
  //       console.error("Não foi possível carregar o schedule: ", error);
  //     }
  //   }

  //   fecthSchedule();
  // }, []);

  return (
    <SectionContainer id="snack" title="LANCHONETE" subtitle="Cardápio">
      <div className="flex items-center gap-4 relative w-screen h-full">
        <div className="flex flex-col items-end justify-center p-8 gap-4 box-border w-full h-full">
          <div className="w-56 sm:w-80 font-semibold text-sm sm:text-base">
            <p>
              Bem-vindo à nossa lanchonete! Aproveite nossos lanches enquanto
              curte um bom filme. Estamos prontos para atender você com
              deliciosas opções de lanches e lanches vegetarianos, porções,
              bomboniere, bebidas e salgadinhos.
            </p>
            <br />
            <p>
              <span className="font-bold">Horário de Funcionamento:</span>{" "}
              <br /> Estamos abertos das{" "}
              <span className="text-primary">{schedule.openingTime}</span> às{" "}
              <span className="text-primary">{schedule.closingTime}</span>
            </p>
            <br />
            <p>
              Faça seu pedido online através do nosso site e receba diretamente
              no seu carro. É <span className="text-primary">prático</span>,
              <span className="text-primary"> rápido</span> e{" "}
              <span className="text-primary">seguro!</span>
            </p>
            <br />
          </div>
        </div>
        <div
          style={{
            backgroundImage: `url(${ticket.src})`,
            backgroundSize: "cover",
            backgroundPosition: "0%",
            width: "100%",
            height: "600px",
          }}
        />
      </div>
    </SectionContainer>
  );
}

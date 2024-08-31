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
    closingTime: "18:00",
    openingTime: "23:00",
  });

  useEffect(() => {
    async function fecthSchedule() {
      try {
        const newSchedule = await ScheduleRepositories.getSchedule();
        setSchedule({
          closingTime: newSchedule.closingTime,
          openingTime: newSchedule.openingTime,
        });
      } catch (error) {
        console.error("Não foi possível carregar o schedule: ", error);
      }
    }

    fecthSchedule();
  }, []);

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
            <p>
              Acesse{" "}
              <Link
                target="_blank"
                className="text-primary hover:underline"
                href={"https://app.cinedrivein.com"}
              >
                https://app.cinedrivein.com
              </Link>{" "}
              para conferir nosso cardápio completo e fazer seu pedido.
            </p>
            <br />
            <div className="flex items-center gap-3">
              <p className="text-right">
                Ou Clique no ícone para ver as nossas opções!
              </p>
              <img
                onClick={() => setIsModalOpen(true)}
                className="h-16 hover:cursor-pointer"
                src="/svg/menu-icon.svg"
                alt="menu"
              />
              <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div
                  onClick={(e) => e.stopPropagation()}
                  className="h-full w-full max-w-[500px] bg-contain bg-no-repeat bg-center"
                  style={{ backgroundImage: `url(${menu.src})` }}
                />
                <div className="hover:cursor-pointer absolute top-4 right-8 flex items-center gap-4">
                  <a
                    className="h-full"
                    href="/images/menu.png"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaExpand
                      size={"22px"}
                      className="text-white drop-shadow-md"
                    />
                  </a>

                  <IoMdClose
                    onClick={() => setIsModalOpen(false)}
                    size={"32px"}
                    className="hover:cursor-pointer drop-shadow-md text-white"
                  />
                </div>
              </Modal>
            </div>
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

"use client";

import { useState } from "react";
/* eslint-disable @next/next/no-img-element */
import SectionContainer from "../../containers/sectionContainer";
import Modal from "@/components/modal";
import Link from "next/link";
import ticket from "../../../public/images/ticket.png";

export default function Snack() {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
              <span className="text-primary">18:00</span> às{" "}
              <span className="text-primary">23:00</span>
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
                <a
                  className="h-full"
                  href="/images/menu.png"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img className="h-full" src="/images/menu.png" alt="menu" />
                </a>
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

"use client";

import { useState } from "react";
import SectionContainer from "../../containers/sectionContainer";
import ticket from "../../../public/images/ticket.png";
import { IoRestaurantOutline } from "react-icons/io5";
import CardapioModal from "@/components/cardapioModal";

export default function Snack() {
  const [cardapioOpen, setCardapioOpen] = useState(false);

  return (
    <>
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
                <span className="text-primary">17:30</span> às{" "}
                <span className="text-primary">23:00</span>
              </p>
              <br />
              <p>
                Faça seu pedido online através do nosso site e receba
                diretamente no seu carro. É{" "}
                <span className="text-primary">prático</span>,
                <span className="text-primary"> rápido</span> e{" "}
                <span className="text-primary">seguro!</span>
              </p>
              <br />

              <button
                onClick={() => setCardapioOpen(true)}
                className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer shadow-md"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <IoRestaurantOutline size={17} />
                Ver cardápio
              </button>
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

      <CardapioModal
        isOpen={cardapioOpen}
        onClose={() => setCardapioOpen(false)}
      />
    </>
  );
}

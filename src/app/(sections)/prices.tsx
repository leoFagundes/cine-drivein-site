import SectionContainer from "../containers/sectionContainer";
import { FaCircleInfo } from "react-icons/fa6";

export default function Prices() {
  return (
    <SectionContainer
      id="prices"
      title="PREÇOS"
      subtitle="Venda somente no Local"
    >
      <div className="flex items-center gap-4 relative w-screen h-full">
        <div
          style={{
            backgroundImage: `url(images/ticket.png)`,
            backgroundSize: "cover",
            backgroundPosition: "100%",
            width: "100%",
            height: "600px",
          }}
        />
        <div className="flex flex-col justify-center p-8 gap-4 box-border w-full h-full">
          <div>
            <p className="text-3xl font-bold">
              Meia <span className="text-xs font-medium">(por pessoa)</span>
            </p>
            <p className="text-primary font-bold text-4xl">R$ 20,00</p>
          </div>
          <div>
            <p className="text-3xl font-bold">
              Inteira <span className="text-xs font-medium">(por pessoa)</span>
            </p>
            <p className="text-primary font-bold text-4xl">R$ 40,00</p>
          </div>
          <div className="flex flex-col gap-3 mt-2">
            <div className="flex gap-2 max-w-80">
              <FaCircleInfo className="min-w-6" color="#0088C2" size="20px" />
              <p className=" text-sm font-semibold">
                Estudantes com carteirinha, idosos e crianças até 10 anos têm
                direito a meia-entrada.
              </p>
            </div>
            <div className="flex gap-2 max-w-80">
              <FaCircleInfo className="min-w-6" color="#0088C2" size="20px" />
              <p className="flex gap-2 text-sm font-semibold">
                A bilheteira abre às 17h30 e o cinema está aberto até às 00h00.
              </p>
            </div>
            <div className="flex gap-2 max-w-80">
              <FaCircleInfo className="min-w-6" color="#0088C2" size="20px" />
              <p className="flex gap-2 text-sm font-semibold">
                Garanta seu ingresso e aproveite uma noite cheia de cinema! Um
                bilhete é válido para todos os filmes exibidos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}

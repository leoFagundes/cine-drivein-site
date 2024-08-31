import { FaLink } from "react-icons/fa6";
import SectionContainer from "../../containers/sectionContainer";
import { FaCircleInfo } from "react-icons/fa6";
import ticket from "../../../public/images/ticket.png";
import Link from "next/link";

export default function Prices() {
  return (
    <SectionContainer
      id="prices"
      title="PREÇOS"
      subtitle="Preços válidos diariamente"
    >
      <div className="flex items-center gap-4 relative w-screen h-full">
        <div
          style={{
            backgroundImage: `url(${ticket.src})`,
            backgroundSize: "cover",
            backgroundPosition: "100%",
            width: "100%",
            height: "600px",
          }}
        />
        <div className="flex flex-col justify-center p-8 gap-4 box-border w-full h-full">
          <article className="flex flex-col gap-3">
            <div>
              <p className="flex sm:items-center sm:gap-1 sm:flex-row flex-col text-xl sm:text-3xl font-bold">
                Meia <span className="text-xs font-medium">(por pessoa)</span>
              </p>
              <p className="text-primary font-bold text-2xl sm:text-4xl">
                R$ 20,00
              </p>
            </div>
            <div>
              <p className="flex sm:items-center sm:gap-1 sm:flex-row flex-col text-xl sm:text-3xl font-bold">
                Inteira{" "}
                <span className="text-xs font-medium">(por pessoa)</span>
              </p>
              <p className="text-primary font-bold text-2xl sm:text-4xl">
                R$ 40,00
              </p>
            </div>
          </article>

          <article className="flex flex-col gap-3 mt-2 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row gap-2 max-w-80">
              <FaLink className="min-w-6" color="#0088C2" size="18px" />
              <Link
                target="_blank"
                href={
                  "https://www.veloxtickets.com/Portal/Ingresso/Cinema/Brasilia"
                }
                className="font-semibold text-primary hover:cursor-pointer underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
              >
                Vendas online no Velox Tickets
              </Link>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 max-w-80">
              <FaCircleInfo className="min-w-6" color="#0088C2" size="20px" />
              <p className="font-semibold">
                Estudantes com carteirinha, idosos e crianças até 10 anos têm
                direito a meia-entrada.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 max-w-80">
              <FaCircleInfo className="min-w-6" color="#0088C2" size="20px" />
              <p className="flex gap-2 font-semibold">
                A bilheteira abre às 17h30 e o cinema está aberto até às 23h30.
              </p>
            </div>
          </article>
        </div>
      </div>
    </SectionContainer>
  );
}

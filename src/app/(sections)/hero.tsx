import Image from "next/image";
import React from "react";
import cineDrivein from "../../../public/svg/bg-cinedrivein.svg";

export default function Hero() {
  return (
    <section className="flex justify-center sm:gap-4 flex-wrap lg:flex-nowrap sm:min-h-[400px] w-11/12 sm:w-10/12 max-w-[1200px] mb-20 lg:my-20">
      <div className="hidden lg:flex flex-col justify-center gap-2 w-[350px]">
        <h1 className="text-primary text-center lg:text-start font-bold text-5xl">
          PATRIMÔNIO CULTURAL
        </h1>
        <p className="text-lg text-center lg:text-start font-semibold">
          DO DISTRITO FEDERAL
        </p>
        <span className="text-primary text-center lg:text-start text-lg font-semibold">
          Projeto de lei Nº 1.608/2013
        </span>
      </div>
      <div>
        <Image
          className="block w-[700px] h-full bg-center drop-shadow-lg rounded-lg"
          src={cineDrivein.src}
          width={700}
          height={500}
          alt="teste"
        />
        <div className="lg:hidden -mt-3 flex gap-1 flex-col items-center text-center">
          <div>
            <p className="font-bold text-primary text-xl">
              PATRIMÔNIO CULTURAL
            </p>
            <p className="text-base italic font-medium">Do Distrito Federal</p>
          </div>
          <p className="text-primary text-center text-sm font-semibold italic">
            Projeto de lei Nº 1.608/2013
          </p>
        </div>
      </div>
      {/* <div
        className="lg:block hidden w-[700px] h-full bg-center drop-shadow-lg rounded-lg bg-contain bg-no-repeat"
        style={{
          backgroundImage: `url(svg/bg-cinedrivein.svg)`,
        }}
      /> */}
      {/* <Image src={ticket.src} width={500} height={500} alt="teste" /> */}
    </section>
  );
}

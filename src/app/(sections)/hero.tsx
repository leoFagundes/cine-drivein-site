import Image from "next/image";
import React from "react";

export default function Hero() {
  return (
    <section className="flex justify-center lg:justify-between gap-4 flex-wrap lg:flex-nowrap min-h-[60vh] w-11/12 sm:w-10/12 my-20">
      <div className=" flex flex-col justify-center gap-2 w-1/2 min-w-[350px]">
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
      <div className="scale-100 hidden lg:flex w-1/2 items-center ">
        <Image
          className="min-w-[400px] min-h-[400px]"
          src={"svg/bg-cinedrivein.svg"}
          layout="fill"
          alt="page-not-found"
        />
      </div>
    </section>
  );
}

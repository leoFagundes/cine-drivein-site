import React from "react";

export default function Hero() {
  return (
    <section className="flex justify-center gap-4 flex-wrap lg:flex-nowrap min-h-[400px] w-11/12 sm:w-10/12 max-w-[1200px] my-20">
      <div className=" flex flex-col justify-center gap-2 w-[350px]">
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
      <div
        className="lg:block hidden w-[700px] h-full bg-center drop-shadow-lg rounded-lg bg-contain bg-no-repeat"
        style={{
          backgroundImage: "url(svg/bg-cinedrivein.svg)",
        }}
      />
    </section>
  );
}

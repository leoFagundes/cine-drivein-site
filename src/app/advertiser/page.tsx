/* eslint-disable @next/next/no-img-element */
import {
  FaLocationDot,
  FaFilm,
  FaUserGroup,
  FaCalendarDays,
} from "react-icons/fa6";
import { FaDesktop, FaCar } from "react-icons/fa";
import Link from "next/link";
import RevealOnScroll from "@/components/revealOnScroll";

export default function BecomeAnAdvertiser() {
  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      {/* <div className="min-h-[2000px] hidden md:flex flex-col absolute top-0 left-0 pointer-events-none overflow-hidden">
        <img
          className="mix-blend-overlay -z-10 w-screen scale-125"
          src="/svg/roll3.svg"
          alt="roll"
        />
        <img
          className="mix-blend-overlay -z-10 w-screen scale-125"
          src="/svg/roll2.svg"
          alt="roll"
        />
      </div> */}

      <RevealOnScroll>
        <img
          className="shadow-card rounded-lg contrast-[1.1] brightness-110 saturate-[1.1]"
          src={"/images/cine-drivein.png"}
          alt={"Cine Drive-in"}
        />
      </RevealOnScroll>

      <RevealOnScroll delay={100} className="relative">
        <div className="flex gap-4 flex-col w-full md:w-[60%]">
          <h1 className="text-center self-center text-primary font-semibold text-3xl">
            SUA EMPRESA NO CINEMA
          </h1>
          <p className="font-semibold">
            O Cine Drive-In de Brasília: Uma Oportunidade Única de Conexão com
            seu Público
          </p>
          <p className="text-sm">
            Em funcionamento desde 1973, o Cine Drive-In de Brasília é o último
            cinema drive-in em operação no Brasil. Mais do que um cinema, é uma
            experiência que combina nostalgia e inovação, atraindo famílias,
            amigos e cinéfilos de todas as idades. Com décadas de tradição,
            nosso drive-in oferece um ambiente único e memorável, perfeito para
            marcas que desejam se conectar de forma autêntica com um público
            engajado.
          </p>
          <ul className="text-sm list-disc px-8">
            <li>
              Em média passam pelo cinema entre{" "}
              <span className="font-semibold">6 a 8 mil pessoas por mês</span>
            </li>
            <li>
              Público no <span className="font-semibold">Facebook</span> mais de
              <span className="font-semibold">24,5 mil seguidores</span>
            </li>
            <li>
              <span className="font-semibold">Instagram</span> com mais de{" "}
              <span className="font-semibold">70 mil seguidores</span>
            </li>
            <li>
              Site com visitas únicas por mês{" "}
              <span className="font-semibold">20 mil acessos</span> <br />{" "}
              <i className="text-xs">(Comprovando por Google Analytics)</i>
            </li>
          </ul>
        </div>
        <img
          className="drop-shadow-card absolute right-0 top-0 hidden md:block md:scale-75 lg:scale-100 -translate-y-52 md:translate-x-40 lg:translate-x-20"
          src={"/images/cine-location.png"}
          alt={"Cine Drive-in"}
        />
      </RevealOnScroll>

      <RevealOnScroll
        delay={150}
        className="flex justify-center lg:justify-between gap-4 text-center font-semibold text-xs sm:text-sm my-6 w-full"
      >
        <div className="flex flex-col items-center justify-center gap-2 max-w-[300px]">
          <FaLocationDot size={"32px"} className="text-primary" />
          <p>Ótima localização e fácil acesso, no coração de Brasília</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-[300px]">
          <FaDesktop size={"32px"} className="text-primary" />
          <p>Maior tela de projeção cinematográfica do país, com 312 m²</p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 max-w-[300px]">
          <FaCar size={"32px"} className="text-primary" />
          <p>
            Estacionamento amplo e capacidade para 400 carros, média de 2 mil
            pessoas
          </p>
        </div>
      </RevealOnScroll>

      <hr className="text-primary" />

      <RevealOnScroll className="flex flex-col gap-6 my-6 w-full">
        <h1 className="text-center self-center text-primary font-semibold text-3xl">
          EMPRESAS QUE JÁ ANUNCIARAM
        </h1>
        <div className="bg-white shadow-card rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-4 grid-rows-2 md:grid-rows-1 md:grid-cols-8 gap-8 items-center w-full">
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/amil.png"}
              alt={"amil"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/clubeTerapia.png"}
              alt={"clubeTerapia"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/drogavet.png"}
              alt={"drogavet"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/gov.png"}
              alt={"gov"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/honda.png"}
              alt={"honda"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/jaguar.png"}
              alt={"jaguar"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/medcar.png"}
              alt={"medcar"}
            />
            <img
              className="grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              src={"/images/organizations/wizard.png"}
              alt={"wizard"}
            />
          </div>
        </div>
      </RevealOnScroll>

      <hr className="text-primary" />

      <RevealOnScroll className="flex justify-center flex-wrap-reverse items-center gap-8 my-6 w-full">
        <div className="flex flex-col gap-4 max-w-full lg:max-w-[300px]">
          <h3 className="text-primary font-bold text-xl">
            O cinema é o tema do premiado longa metragem, “O último Cine Drive
            In”, produzido pelo renomado diretor Iberê de Carvalho
          </h3>
          <p className="text-sm font-medium">
            O filme recentemente foi um dos vencedores do prêmio Netflix e será
            traduzido em mais de 32 línguas para exibição na plataforma
            streaming mais famosa do mundo.
          </p>
        </div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/Krd98yb5i6U?si=DxCb_rWh_TG7t9_q"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </RevealOnScroll>

      <hr className="text-primary" />

      <RevealOnScroll className="flex flex-col items-center gap-6 my-6 w-full">
        <div className="flex flex-col items-center gap-3">
          <h1 className="text-center self-center text-primary font-semibold text-3xl">
            NOSSOS FILMES
          </h1>
          <p className="text-center font-medium max-w-[600px]">
            Os filmes exibidos são, geralmente, voltados para a família e
            casais, com filmes de animação e comédias românticas.
          </p>
          <p className="text-center text-lg font-semibold max-w-[600px]">
            O Cine Drive-in conta atualmente com três sessões:
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">18:30</p>
            <p className="text-sm font-medium">
              <i>Filmes para o público infantil e familiar</i>
            </p>
          </div>
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">20:20</p>
            <p className="text-sm font-medium">
              <i>Filmes para público jovem/adulto</i>
            </p>
          </div>
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">22:10</p>
            <p className="text-sm font-medium">
              <i>Filmes para público jovem/adulto</i>
            </p>
          </div>
        </div>
      </RevealOnScroll>

      <hr className="text-primary" />

      <RevealOnScroll className="flex flex-col gap-6 my-6 w-full">
        <h1 className="text-center self-center text-primary font-semibold text-3xl">
          PÚBLICO ATUAL
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaUserGroup size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">6 a 8 mil</p>
            <p className="text-sm font-medium">
              pessoas circulam pelo cinema por mês
            </p>
          </div>
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaCalendarDays size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">20 a 50 anos</p>
            <p className="text-sm font-medium">
              faixa etária principal nos filmes adultos, além de muitas crianças
              e famílias nas sessões infantis
            </p>
          </div>
          <div className="bg-white shadow-card rounded-lg p-6 flex flex-col items-center text-center gap-2">
            <FaCar size={"32px"} className="text-primary" />
            <p className="text-2xl font-bold text-primary">1.500 a 2.000</p>
            <p className="text-sm font-medium">
              carros por mês, ou seja, de 375 a 500 carros por semana
            </p>
          </div>
        </div>
      </RevealOnScroll>

      <hr className="text-primary" />

      <RevealOnScroll className="flex flex-col gap-4 w-full">
        <h1 className="text-center self-center text-primary font-semibold text-3xl">
          ENTRE EM CONTATO
        </h1>
        <p className="font-medium">
          Gostaria de promover sua marca em um ambiente único e cheio de
          tradição? Anuncie no Cine Drive-In e alcance milhares de pessoas todos
          os meses! Para mais informações sobre como se tornar um anunciante,
          entre em contato conosco:
        </p>
        <Link
          className="bg-color-primary shadow-lg px-3 py-2 rounded-xl font-semibold text-lg text-white self-center underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
          href="mailto:cinedrivein@cinedrivein.com"
          target="_blank"
        >
          cinedrivein@cinedrivein.com
        </Link>
        <p className="font-medium self-center">
          Estamos prontos para discutir as melhores opções de parceria para
          você!
        </p>
      </RevealOnScroll>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element */
import { FaLocationDot, FaFilm } from "react-icons/fa6";
import { FaDesktop, FaCar } from "react-icons/fa";
import Link from "next/link";

export default function BecomeAnAdvertiser() {
  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      <div className="min-h-[2000px] hidden md:flex flex-col absolute top-0 left-0 pointer-events-none overflow-hidden">
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
      </div>

      <img
        className="shadow-card rounded-lg contrast-[1.1] brightness-110 saturate-[1.1]"
        src={"/images/cine-drivein.png"}
        alt={"Cine Drive-in"}
      />

      <div className="relative">
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
      </div>

      <div className="flex justify-center lg:justify-between gap-4 text-center font-semibold text-xs sm:text-sm my-6">
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
      </div>

      <hr className="text-primary" />

      <div className="flex flex-col gap-6 my-6">
        <h1 className="text-center self-center text-primary font-semibold text-3xl">
          EMPRESAS QUE JÁ ANUNCIARAM
        </h1>
        <div className="grid grid-cols-4 grid-rows-2 md:grid-rows-1 md:grid-cols-8 gap-8 items-center w-full">
          <img src={"/images/organizations/amil.png"} alt={"amil"} />
          <img
            src={"/images/organizations/clubeTerapia.png"}
            alt={"clubeTerapia"}
          />
          <img src={"/images/organizations/drogavet.png"} alt={"drogavet"} />
          <img src={"/images/organizations/gov.png"} alt={"gov"} />
          <img src={"/images/organizations/honda.png"} alt={"honda"} />
          <img src={"/images/organizations/jaguar.png"} alt={"jaguar"} />
          <img src={"/images/organizations/medcar.png"} alt={"medcar"} />
          <img src={"/images/organizations/wizard.png"} alt={"wizard"} />
        </div>
      </div>

      <hr className="text-primary" />

      <div className="flex justify-center flex-wrap-reverse items-center gap-8 my-6">
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
      </div>

      <hr className="text-primary" />

      <div className="flex flex-col items-center gap-3 my-6">
        <h1 className="text-center self-center text-primary font-semibold text-3xl">
          NOSSOS FILMES
        </h1>
        <p className="text-center font-medium max-w-[600px]">
          Os filmes exibidos são, geralmente, voltados para a família e casais,
          com filmes de animação e comédias românticas.
        </p>
        <p className="text-center text-lg font-semibold max-w-[600px]">
          O Cine Drive-in conta atualmente com três sessões:
        </p>
        <div className="grid grid-cols-3 items-center gap-3 text-center mt-4">
          <div className="flex flex-col items-center justify-center gap-1 max-w-[200px]">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="font-semibold">18:30</p>
            <p className="text-sm max-w-[250px]">
              <i>Filmes para o público infantil e familiar</i>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 max-w-[200px]">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="font-semibold">20:20</p>
            <p className="text-sm max-w-[250px]">
              <i>Filmes para público jovem/adulto</i>
            </p>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 max-w-[200px]">
            <FaFilm size={"32px"} className="text-primary" />
            <p className="font-semibold">22:10</p>
            <p className="text-sm max-w-[250px]">
              <i>Filmes para público jovem/adulto</i>
            </p>
          </div>
        </div>
      </div>

      <hr className="text-primary" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
        <img className="hidden md:block" src="images/people.png" alt="people" />
        <article className="flex flex-col gap-2">
          <h1 className="text-center self-center text-primary font-semibold text-3xl">
            PÚBLICO ATUAL
          </h1>
          <article className="flex items-center flex-1">
            <p>
              <span className="font-semibold">
                {" "}
                Público presencial no cinema está entre 6 a 8 mil pessoas por
                mês.
              </span>
              <br />
              <br />A principal faixa etária para os filmes adultos está entre{" "}
              <span className="font-semibold">20 e 50</span> anos. Nos filmes
              infantis sempre há muitas crianças com seus familiares.
              <br />
              <br />O número de carros está entre{" "}
              <span className="font-semibold">1500 e 2000 ao mês</span>, ou
              seja, de{" "}
              <span className="font-semibold">375 a 500 carros por semana</span>
              .
            </p>
          </article>
        </article>
      </div>

      <hr className="text-primary" />

      <div className="flex flex-col gap-4">
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
          className="font-semibold text-lg text-primary self-center underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
          href="mailto:cinedrivein@cinedrivein.com"
          target="_blank"
        >
          cinedrivein@cinedrivein.com
        </Link>
        <p className="font-medium self-center">
          Estamos prontos para discutir as melhores opções de parceria para
          você!
        </p>
      </div>
    </section>
  );
}

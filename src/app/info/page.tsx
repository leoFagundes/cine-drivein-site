import Link from "next/link";
import {
  FaDog,
  FaCarSide,
  FaShieldAlt,
  FaBroadcastTower,
  FaUtensils,
  FaRestroom,
  FaCarBattery,
  FaEnvelope,
} from "react-icons/fa";
import RevealOnScroll from "@/components/revealOnScroll";

export default function HowItWorks() {
  const items = [
    {
      icon: FaDog,
      title: "Experiência Única no Cine Drive-in",
      description: (
        <>
          No Cine Drive-in, você pode curtir o filme do seu jeito! Traga a
          família, amigos, seu pet{" "}
          <span className="text-primary">(somos pet-friendly)</span> e até o
          papagaio! Aqui, você pode assistir ao filme no conforto do seu carro,
          sem preocupações. Venha de chinelo, bermuda e aproveite a liberdade de
          comer, conversar e até atender o telefone enquanto o filme rola na
          tela. É cinema como você nunca viu!
        </>
      ),
    },
    {
      icon: FaCarSide,
      title: "Cuidados com os Faróis",
      description: (
        <>
          Quando o filme começar, lembre-se de manter os faróis do carro{" "}
          <span className="text-primary">apagados</span>. Acender os faróis pode
          interferir na projeção, assim como acender a luz dentro de um cinema
          comum. Em caso de emergência, utilize o{" "}
          <span className="text-primary"> pisca alerta</span>.
        </>
      ),
    },
    {
      icon: FaShieldAlt,
      title: "Segurança no Estacionamento",
      description: (
        <>
          A segurança é prioridade no Cine Drive-in. Temos porteiros, seguranças
          circulando pelo cinema, e até uma ronda da polícia passando
          regularmente. Aproveite o filme com tranquilidade, sabendo que você e
          sua família estão em boas mãos.
        </>
      ),
    },
    {
      icon: FaBroadcastTower,
      title: "Como faço para escutar o filme?",
      description: (
        <>
          Ao começar o filme, basta sintonizar o rádio do seu carro na
          frequência <span className="text-primary">FM 88,7</span> para ouvir o
          som direto da cabine de projeção, com qualidade estéreo. Ajuste o
          volume ao seu gosto e aproveite a experiência completa. Caso seu carro
          não tenha rádio, temos duas caixas de som externas disponíveis na
          lateral da nossa lanchonete.
        </>
      ),
    },
    {
      icon: FaUtensils,
      title: "Lanchonete e Cardápio",
      description: (
        <>
          Nosso cardápio variado é distribuído na entrada do cinema e oferece
          desde snacks rápidos até lanches completos. Para fazer seu pedido,
          basta acessar o site{" "}
          <Link
            target="_blank"
            className="text-primary underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
            href={"https://app.cinedrivein.com"}
          >
            https://app.cinedrivein.com
          </Link>
          . E lembre-se: ao final do filme, deposite o seu lixo nos tonéis
          localizados na saída do cinema.
        </>
      ),
    },
    {
      icon: FaRestroom,
      title: "Banheiros de Fácil Acesso",
      description: (
        <>
          Os banheiros estão{" "}
          <span className="text-primary">
            {" "}
            localizados na parte direita do cinema{" "}
          </span>{" "}
          e são acessíveis para todos os nossos visitantes.
        </>
      ),
    },
    {
      icon: FaCarBattery,
      title: "Serviço de Auxílio de Bateria",
      description: (
        <>
          Preocupado com a bateria do carro? Não se preocupe! Se a bateria do
          seu carro acabar durante a sessão, oferecemos um serviço de {'"'}
          chupeta{'"'} para garantir que você possa sair sem problemas. Basta
          acender o farolete ou o pisca alerta, e um de nossos atendentes irá
          ajudá-lo.
        </>
      ),
    },
    {
      icon: FaEnvelope,
      title: "Dúvidas ou Sugestões?",
      description: (
        <>
          Caso tenha alguma dúvida ou sugestão, não hesite em{" "}
          <span className="text-primary">entrar em contato conosco</span> pelo
          email{" "}
          <Link
            className="text-primary underline sm:decoration-transparent sm:hover:decoration-inherit sm:hover:underline"
            href="mailto:cinedrivein@cinedrivein.com"
            target="_blank"
          >
            cinedrivein@cinedrivein.com
          </Link>
          . Estamos aqui para ajudar!
        </>
      ),
    },
  ];

  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      <RevealOnScroll>
        <h1 className="text-4xl font-semibold text-primary text-center sm:text-left">
          Como funcionamos?
        </h1>
      </RevealOnScroll>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(({ icon: Icon, title, description }, index) => (
          <RevealOnScroll key={index} delay={index * 75}>
            <article className="bg-white shadow-card rounded-lg p-6 flex flex-col gap-2 h-full">
              <div className="flex items-center gap-3">
                <Icon className="text-primary" size={"24px"} />
                <h3 className="text-primary font-semibold text-xl">{title}</h3>
              </div>
              <p className="font-medium text-sm">{description}</p>
            </article>
          </RevealOnScroll>
        ))}
      </div>
    </section>
  );
}

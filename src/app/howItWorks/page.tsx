import Link from "next/link";

export default function HowItWorks() {
  const items = [
    {
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
      title: "Como escuto o filme?",
      description: (
        <>
          Ao começar o filme, basta sintonizar o rádio do seu carro na
          frequência <span className="text-primary">FM 88,7</span> para ouvir o
          som direto da cabine de projeção, com qualidade estéreo. Ajuste o
          volume ao seu gosto e aproveite a experiência completa.
        </>
      ),
    },
    {
      title: "Lanchonete e Cardápio",
      description: (
        <>
          Nosso cardápio variado é distribuído na entrada do cinema e oferece
          desde snacks rápidos até lanches completas. Para fazer seu pedido,
          basta acessar o site{" "}
          <Link
            target="_blank"
            className="text-primary hover:underline"
            href={"https://app.cinedrivein.com"}
          >
            https://app.cinedrivein.com
          </Link>
          . E lembre-se: ao final do filme, deposite o lixo no saco plástico
          fornecido e deixe-o nos tonéis localizados na saída do cinema.
        </>
      ),
    },
    {
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
      title: "Dúvidas ou Sugestões?",
      description: (
        <>
          Caso tenha alguma dúvida ou sugestão, não hesite em{" "}
          <span className="text-primary">entrar em contato conosco</span> pelo
          email{" "}
          <Link
            className="text-primary hover:underline"
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
      <h1 className="text-4xl font-semibold text-primary">Como funcionamos?</h1>
      {items.map(({ title, description }, index) => (
        <article className="flex flex-col gap-2" key={index}>
          <h3 className="text-primary font-semibold text-xl">{title}</h3>
          <p className="font-medium text-sm">{description}</p>
        </article>
      ))}
    </section>
  );
}

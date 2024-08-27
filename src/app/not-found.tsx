import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center justify-around">
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-2xl">
          Ups...
          <br /> Parece que essa página não existe!
        </h2>
        <h2 className="font-semibold text-primary text-xl underline hover:cursor-pointer">
          <Link href={"/"}>Voltar ao início</Link>
        </h2>
      </div>
      <Image
        src={"page-not-found.svg"}
        width={528}
        height={472}
        alt="page-not-found"
        className="scale-110"
      />
    </section>
  );
}

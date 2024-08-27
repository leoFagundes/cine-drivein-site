import Image from "next/image";
import Link from "next/link";
import { BiError } from "react-icons/bi";

export default function NotFound() {
  return (
    <section
      className="flex flex-1 items-center gap-8 justify-around flex-wrap"
      style={{ minHeight: "calc(100vh - 326px)" }}
    >
      <div className="relative flex items-center flex-col gap-4">
        <div className="absolute flex items-center justify-center h-full w-full">
          <BiError className="text-gray/20 scale-[15]" />
        </div>
        <div className="flex justify-center items-center flex-col gap-2 z-10 backdrop-blur-sm p-3 min-w-[400px] h-[200px] w-full">
          <h2 className="font-semibold text-2xl text-center">Ops...</h2>
          <h2 className="font-semibold text-2xl text-center">
            Parece que essa página não existe!
          </h2>
          <h2 className="font-semibold text-primary text-xl underline hover:cursor-pointer">
            <Link href={"/"}>Voltar ao início</Link>
          </h2>
        </div>
      </div>
      <Image
        src={"page-not-found.svg"}
        width={528}
        height={472}
        alt="page-not-found"
        className="scale-110 hidden sm:block"
      />
    </section>
  );
}

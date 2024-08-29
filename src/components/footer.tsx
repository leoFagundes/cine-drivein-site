import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";

export default function Footer() {
  return (
    <footer id="contact" className="pb-8 w-11/12 sm:w-10/12">
      <hr className="my-8" />

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:justify-around flex-wrap">
        <div className="flex flex-col items-center sm:items-start gap-2 w-52">
          <Image src={"/svg/logo.svg"} width={120} height={60} alt="logo" />
          <span className="font-semibold text-sm sm:text-start text-center">
            O único cinema drive-in da América Latina
          </span>
        </div>
        <div className="flex flex-col gap-4 w-full sm:w-auto items-center sm:items-start sm:p-0 p-2">
          <div className="flex flex-col gap-4 min-w-[230px]">
            <span className="font-semibold text-lg text-primary">
              Nossas Redes Sociais
            </span>
            <Link
              className="text-sm flex items-center gap-2 hover:underline"
              href={"https://www.instagram.com/cinedriveinoficial/"}
              target="_blank"
            >
              <FaInstagram size={"24px"} /> @cinedriveinoficial
            </Link>
            <Link
              className="text-sm flex items-center gap-2 hover:underline"
              href={"https://www.facebook.com/cinedrivein"}
              target="_blank"
            >
              <FaFacebookF size={"24px"} /> @cinedrivein
            </Link>
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full sm:w-auto items-center sm:items-start sm:p-0 p-2">
          <div className="flex flex-col gap-4 min-w-[230px]">
            <span className="font-semibold text-lg text-primary">Contato</span>
            <Link
              className="text-sm flex items-center gap-2 hover:underline"
              href="https://wa.me/5561999619114"
              target="_blank"
            >
              <FaWhatsapp size={"24px"} /> (61) 99961-9114
            </Link>
            <Link
              className="text-sm flex items-center gap-2 hover:underline"
              href="mailto:cinedrivein@cinedrivein.com"
              target="_blank"
            >
              <MdOutlineAlternateEmail size={"24px"} />{" "}
              cinedrivein@cinedrivein.com
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

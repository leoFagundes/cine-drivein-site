"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";
import { MdOutlineAlternateEmail } from "react-icons/md";
import { useLogoEasterEgg } from "@/hooks/useLogoEasterEgg";

const SOCIAL_LINKS = [
  {
    Icon: FaInstagram,
    label: "@cinedriveinoficial",
    href: "https://www.instagram.com/cinedriveinoficial/",
  },
  {
    Icon: FaFacebookF,
    label: "@cinedrivein",
    href: "https://www.facebook.com/cinedrivein",
  },
];

const CONTACT_LINKS = [
  {
    Icon: FaWhatsapp,
    label: "(61) 99961-9114",
    href: "https://wa.me/5561999619114",
  },
  {
    Icon: MdOutlineAlternateEmail,
    label: "cinedrivein@cinedrivein.com",
    href: "mailto:cinedrivein@cinedrivein.com",
  },
];

export default function Footer() {
  const onLogoClick = useLogoEasterEgg();
  const [pulseKey, setPulseKey] = useState(0);

  function handleLogoClick() {
    onLogoClick();
    setPulseKey((k) => k + 1);
  }

  return (
    <footer id="contact" className="w-11/12 sm:w-10/12 max-w-[1200px] py-6">
      <hr className="mb-6 border-gray-200" />

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
        <div className="flex flex-col items-center sm:items-start gap-1.5">
          <motion.div
            key={pulseKey}
            onClick={handleLogoClick}
            className="select-none cursor-pointer"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.88, 1.06, 1] }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/svg/logo.svg"
              width={90}
              height={45}
              alt="Cine Drive-In"
            />
          </motion.div>
          <span className="text-xs text-gray-400 text-center sm:text-start max-w-[180px] leading-relaxed">
            O único cinema drive-in da América Latina
          </span>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-6 sm:gap-10 px-4 sm:px-0">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Redes Sociais
            </span>
            {SOCIAL_LINKS.map(({ Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Icon size={14} className="shrink-0" />
                <span>{label}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
              Contato
            </span>
            {CONTACT_LINKS.map(({ Icon, label, href }) => (
              <Link
                key={href}
                href={href}
                target="_blank"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                <Icon size={14} className="shrink-0" />
                <span className="break-all sm:break-normal">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-6">
        © {new Date().getFullYear()} Cine Drive-In. Todos os direitos
        reservados.
      </p>
    </footer>
  );
}

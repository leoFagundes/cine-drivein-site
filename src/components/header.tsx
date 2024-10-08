"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import classNames from "classnames";
import {
  IoHomeOutline,
  IoPricetagsOutline,
  IoFastFoodOutline,
  IoInformationCircleOutline,
  IoFilmOutline,
  IoLocationOutline,
} from "react-icons/io5";
import { useRouter } from "next/navigation";

export default function Header() {
  const [opened, setOpened] = useState(false);
  const router = useRouter();

  const items = [
    {
      key: "home",
      label: "INÍCIO",
      link: "/",
      icon: <IoHomeOutline size={"16px"} />,
    },
    {
      key: "prices",
      label: "PREÇOS",
      link: "/#prices",
      icon: <IoPricetagsOutline size={"16px"} />,
    },
    {
      key: "snack",
      label: "LANCHONETE",
      link: "/#snack",
      icon: <IoFastFoodOutline size={"16px"} />,
    },
    {
      key: "location",
      label: "LOCALIZAÇÃO",
      link: "/#location",
      icon: <IoLocationOutline size={"16px"} />,
    },
    {
      key: "how-it-works",
      label: "COMO FUNCIONA",
      link: "/info",
      icon: <IoInformationCircleOutline size={"16px"} />,
    },
    {
      key: "advertiser",
      label: "SEJA UM ANUNCIANTE",
      link: "/advertiser",
      icon: <IoFilmOutline size={"16px"} />,
    },
  ];

  return (
    <>
      <div className="h-[100px] bg-red-200 lg:h-[80px]" />
      <section className="fixed flex justify-center w-full z-40 bg-primary/85 backdrop-blur-sm">
        <nav className="flex items-center justify-between h-20 py-4 w-11/12 sm:w-10/12 max-w-[1200px]">
          <Link href={"/"}>
            {" "}
            <Image src={"/svg/logo.svg"} width={120} height={60} alt="logo" />
          </Link>

          <ul className="items-center gap-7 font-semibold text-xs hidden lg:flex">
            {items.map((item) => (
              <li
                key={item.key}
                className="text-xs hover:opacity-70"
                onClick={() => setOpened(false)}
              >
                <Link href={item.link}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <div
            onClick={() => setOpened(!opened)}
            className={classNames(
              `lg:hidden block tham tham-e-squeeze tham-w-6 scale-110 hover:opacity-100 md:hover:opacity-80`,
              {
                "tham-active": opened,
              }
            )}
          >
            <div className="tham-box">
              <div className="tham-inner bg-gray" />
            </div>
          </div>
          {opened && (
            <div className="absolute lg:hidden block right-0 bottom-0 translate-y-40 p-3 border border-gray/50 rounded-md z-10 bg-primary shadow-xl">
              <ul className="flex flex-col gap-3 font-semibold">
                {items.map((item) => (
                  <li
                    key={item.key}
                    className="text-xs"
                    onClick={() => setOpened(false)}
                  >
                    <Link className="flex gap-2 items-center" href={item.link}>
                      {item.icon}
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </section>
    </>
  );
}

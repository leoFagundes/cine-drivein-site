"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  IoHomeOutline,
  IoPricetagsOutline,
  IoFastFoodOutline,
  IoInformationCircleOutline,
  IoFilmOutline,
  IoLocationOutline,
  IoStarOutline,
  IoClose,
} from "react-icons/io5";
import { usePathname } from "next/navigation";
import { trackEvent, PageClickKey } from "@/lib/analytics";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 32 },
  },
  exit: {
    x: "100%",
    transition: { type: "tween", duration: 0.25, ease: "easeIn" },
  },
};

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
};

const ANALYTICS_KEYS: Record<string, PageClickKey> = {
  "how-it-works": "comoFunciona",
  "advertiser":   "anunciante",
  "feedback":     "avaliacao",
};

export default function Header() {
  const [opened, setOpened] = useState(false);
  const [hasMoreScroll, setHasMoreScroll] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const pathname = usePathname();
  const { data: siteConfig } = useSiteConfig();

  function checkScroll() {
    const el = listRef.current;
    if (!el) return;
    setHasMoreScroll(el.scrollTop + el.clientHeight < el.scrollHeight - 4);
  }

  useEffect(() => {
    document.body.style.overflow = opened ? "hidden" : "";
    if (opened) setTimeout(() => checkScroll(), 180);
    else setHasMoreScroll(false);
    return () => {
      document.body.style.overflow = "";
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  const items = [
    {
      key: "home",
      label: "INÍCIO",
      link: "/",
      icon: <IoHomeOutline size={"20px"} />,
    },
    {
      key: "prices",
      label: "PREÇOS",
      link: "/#prices",
      icon: <IoPricetagsOutline size={"20px"} />,
    },
    {
      key: "snack",
      label: "LANCHONETE",
      link: "/#snack",
      icon: <IoFastFoodOutline size={"20px"} />,
    },
    {
      key: "location",
      label: "LOCALIZAÇÃO",
      link: "/#location",
      icon: <IoLocationOutline size={"20px"} />,
    },
    {
      key: "how-it-works",
      label: "COMO FUNCIONA",
      link: "/info",
      icon: <IoInformationCircleOutline size={"20px"} />,
    },
    {
      key: "advertiser",
      label: "SEJA UM ANUNCIANTE",
      link: "/advertiser",
      icon: <IoFilmOutline size={"20px"} />,
    },
    {
      key: "feedback",
      label: "AVALIAÇÃO",
      link: "/feedback",
      icon: <IoStarOutline size={"20px"} />,
    },
  ].filter((item) =>
    item.key === "feedback" ? !siteConfig?.hideFeedbackNavLink : true,
  );

  return (
    <>
      <div className="h-[100px] lg:h-[80px]" />
      <section className="fixed left-0 top-0 flex justify-center w-full z-40 bg-secondary/85 backdrop-blur-sm px-3">
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
                onClick={() => {
                  setOpened(false);
                  const aKey = ANALYTICS_KEYS[item.key];
                  if (aKey) void trackEvent({ type: "pageClick", key: aKey });
                }}
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
              },
            )}
          >
            <div className="tham-box">
              <div className="tham-inner bg-gray" />
            </div>
          </div>
        </nav>
      </section>

      <AnimatePresence>
        {opened && (
          <>
            <motion.div
              key="overlay"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.25 }}
              className="fixed inset-0 lg:hidden z-40 bg-black/50 backdrop-blur-[2px]"
              onClick={() => setOpened(false)}
            />
            <motion.aside
              key="drawer"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed lg:hidden top-0 right-0 bottom-0 z-50 w-[82%] max-w-[320px] flex flex-col bg-white shadow-2xl rounded-l-3xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-5 border-b border-gray/10">
                <Image
                  src={"/svg/logo.svg"}
                  width={100}
                  height={50}
                  alt="logo"
                />
                <button
                  type="button"
                  aria-label="Fechar menu"
                  onClick={() => setOpened(false)}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900 transition-colors"
                >
                  <IoClose size={"20px"} />
                </button>
              </div>

              <div className="relative flex-1 min-h-0">
                <motion.ul
                  ref={listRef}
                  onScroll={checkScroll}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-1 p-3 h-full overflow-y-auto"
                >
                  {items.map((item) => {
                    const isActive = pathname === item.link;

                    return (
                      <motion.li key={item.key} variants={itemVariants}>
                        <Link
                          className={classNames(
                            "flex items-center gap-3.5 px-4 py-3.5 rounded-2xl font-semibold text-sm transition-colors duration-150",
                            isActive
                              ? "bg-color-primary/10 text-color-primary"
                              : "text-stone-700 hover:bg-stone-100",
                          )}
                          href={item.link}
                          onClick={() => {
                            setOpened(false);
                            const aKey = ANALYTICS_KEYS[item.key];
                            if (aKey) void trackEvent({ type: "pageClick", key: aKey });
                          }}
                        >
                          <span
                            className={classNames(
                              "flex items-center justify-center w-10 h-10 rounded-full",
                              isActive
                                ? "bg-color-primary text-white"
                                : "bg-stone-100 text-color-primary",
                            )}
                          >
                            {item.icon}
                          </span>
                          {item.label}
                        </Link>
                      </motion.li>
                    );
                  })}
                </motion.ul>

                {hasMoreScroll && (
                  <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-gradient-to-t from-white to-transparent" />
                )}
              </div>

              <div className="shrink-0 px-5 py-5 border-t border-gray/10 text-center">
                <p className="text-xs text-stone-400 font-medium">
                  Cine Drive-In • Brasília
                </p>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

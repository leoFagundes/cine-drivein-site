/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSiteConfig } from "@/hooks/useSiteConfig";

const HIDE_POPUP_STORAGE_KEY = "hidePopupUntil";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const { data: siteConfig } = useSiteConfig();

  useEffect(() => {
    if (!siteConfig || !siteConfig.popUpEnabled) return;

    const hideUntil = localStorage.getItem(HIDE_POPUP_STORAGE_KEY);
    if (hideUntil && Number(hideUntil) > Date.now()) return;

    if (
      siteConfig.popUpImage ||
      siteConfig.popUpTitle ||
      (siteConfig.popUpDescriptions && siteConfig.popUpDescriptions.length > 0)
    ) {
      setIsOpen(true);
    }
  }, [siteConfig]);

  const handleClose = () => {
    if (dontShowAgain) {
      const oneHourFromNow = Date.now() + 60 * 60 * 1000;
      localStorage.setItem(HIDE_POPUP_STORAGE_KEY, String(oneHourFromNow));
    }
    setIsOpen(false);
  };

  if (!isOpen || !siteConfig) return null;

  const title = siteConfig.popUpTitle ?? "";
  const messages = siteConfig.popUpDescriptions ?? [];
  const image = siteConfig.popUpImage ?? "";
  const hasText = title || messages.length > 0;

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn hover:cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] max-w-[480px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl hover:cursor-default flex flex-col"
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all hover:cursor-pointer"
        >
          <CgClose size={16} />
        </button>

        {image && (
          <img
            src={image}
            alt={title || "Popup"}
            className="w-full object-cover"
          />
        )}

        {hasText && (
          <div className="bg-white px-5 py-4 flex flex-col gap-1.5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col gap-0.5 min-w-0">
                {title && (
                  <span className="text-sm font-semibold text-stone-800 truncate">
                    {title}
                  </span>
                )}

                {messages[0] && (
                  <span className="text-xs text-stone-400 truncate">
                    {messages[0]}
                  </span>
                )}
              </div>

              <button
                onClick={handleClose}
                className="shrink-0 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors hover:cursor-pointer whitespace-nowrap"
              >
                Fechar
              </button>
            </div>

            <label className="flex items-center gap-1.5 text-[11px] text-stone-300 hover:text-stone-400 transition-colors hover:cursor-pointer select-none w-fit">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-3 w-3 accent-stone-400 hover:cursor-pointer"
              />
              Não mostrar novamente por 1 hora
            </label>
          </div>
        )}

        {!hasText && (
          <label className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white transition-colors hover:cursor-pointer select-none bg-black/30 rounded-full px-2.5 py-1">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="h-3 w-3 accent-white hover:cursor-pointer"
            />
            Não mostrar novamente por 1 hora
          </label>
        )}
      </div>
    </div>
  );
}

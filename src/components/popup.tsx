/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { useSiteConfig } from "@/hooks/useSiteConfig";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: siteConfig } = useSiteConfig();

  useEffect(() => {
    if (!siteConfig || !siteConfig.popUpEnabled) return;

    if (
      siteConfig.popUpImage ||
      siteConfig.popUpTitle ||
      (siteConfig.popUpDescriptions && siteConfig.popUpDescriptions.length > 0)
    ) {
      setIsOpen(true);
    }
  }, [siteConfig]);

  if (!isOpen || !siteConfig) return null;

  const title = siteConfig.popUpTitle ?? "";
  const messages = siteConfig.popUpDescriptions ?? [];
  const image = siteConfig.popUpImage ?? "";
  const hasText = title || messages.length > 0;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn hover:cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] max-w-[480px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl hover:cursor-default flex flex-col"
      >
        <button
          onClick={() => setIsOpen(false)}
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
          <div className="bg-white px-5 py-4 flex items-center justify-between gap-4">
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
              onClick={() => setIsOpen(false)}
              className="shrink-0 text-xs font-medium text-stone-400 hover:text-stone-700 transition-colors hover:cursor-pointer whitespace-nowrap"
            >
              Fechar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable @next/next/no-img-element */
"use client";

import { SiteConfig } from "@/types/Types";
import { useEffect, useState } from "react";
import { CgClose } from "react-icons/cg";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export default function Popup() {
  const [isOpen, setIsOpen] = useState(false);
  const [popupInfo, setPopupInfo] = useState({
    title: "",
    messages: [] as string[],
    image: "",
  });

  useEffect(() => {
    async function fetchPopUpInfo() {
      try {
        const ref = doc(db, "siteConfig", "main");
        const snap = await getDoc(ref);

        if (!snap.exists()) return;

        const config = snap.data() as SiteConfig;

        if (!config.popUpEnabled) return;

        setPopupInfo({
          image: config.popUpImage ?? "",
          title: config.popUpTitle ?? "",
          messages: config.popUpDescriptions ?? [],
        });

        if (
          config.popUpImage ||
          config.popUpTitle ||
          (config.popUpDescriptions && config.popUpDescriptions.length > 0)
        ) {
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Erro ao carregar popup:", error);
      }
    }

    fetchPopUpInfo();
  }, []);

  if (!isOpen) return null;

  const hasText = popupInfo.title || popupInfo.messages.length > 0;

  return (
    <div
      onClick={() => setIsOpen(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fadeIn hover:cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[90%] max-w-[480px] max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl hover:cursor-default flex flex-col"
      >
        {/* Botão fechar — sempre flutuando */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-3 right-3 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-1.5 transition-all hover:cursor-pointer"
        >
          <CgClose size={16} />
        </button>

        {/* Imagem */}
        {popupInfo.image && (
          <img
            src={popupInfo.image}
            alt={popupInfo.title || "Popup"}
            className="w-full object-cover"
          />
        )}

        {/* Rodapé minimalista — só aparece se tiver texto */}
        {hasText && (
          <div className="bg-white px-5 py-4 flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5 min-w-0">
              {popupInfo.title && (
                <span className="text-sm font-semibold text-stone-800 truncate">
                  {popupInfo.title}
                </span>
              )}

              {popupInfo.messages[0] && (
                <span className="text-xs text-stone-400 truncate">
                  {popupInfo.messages[0]}
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

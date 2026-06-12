"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <section
      onClick={onClose}
      className="z-50 fixed h-screen w-screen top-0 left-0 flex items-center justify-center bg-gray/30 backdrop-blur-md animate-fadeIn"
    >
      {children}
    </section>,
    document.body
  );
}

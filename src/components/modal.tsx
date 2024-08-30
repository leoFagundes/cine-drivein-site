import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: VoidFunction;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  return (
    <>
      {isOpen && (
        <section
          onClick={onClose}
          className="z-50 fixed h-screen w-screen top-0 left-0 flex items-center justify-center bg-gray/30 backdrop-blur-sm"
        >
          {children}
        </section>
      )}
    </>
  );
}

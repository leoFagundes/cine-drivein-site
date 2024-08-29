import React, { ReactNode } from "react";
import { IoMdClose } from "react-icons/io";

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
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex items-center justify-center w-[600px] h-[600px] max-w-[90%] max-h-[90%] overflow-y-scroll"
          >
            {children}
          </div>
          <IoMdClose
            onClick={onClose}
            size={"32px"}
            className="absolute top-4 right-4 hover:cursor-pointer drop-shadow-md text-white"
          />
        </section>
      )}
    </>
  );
}

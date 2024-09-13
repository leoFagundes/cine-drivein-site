import React, { ComponentProps, ReactNode } from "react";

interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export default function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="p-3 bg-color-primary text-white font-semibold rounded-md hover:cursor-pointer hover:saturate-150 duration-300"
    >
      {children}
    </button>
  );
}

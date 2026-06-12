import React, { ComponentProps, ReactNode } from "react";
import classNames from "classnames";

interface ButtonProps extends ComponentProps<"button"> {
  children: ReactNode;
}

export default function Button({
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      className={classNames(
        "p-3 bg-color-primary text-white font-semibold rounded-md hover:cursor-pointer hover:saturate-150 duration-300",
        className
      )}
    >
      {children}
    </button>
  );
}

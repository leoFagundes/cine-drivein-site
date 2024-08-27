import React, { ReactNode } from "react";

interface SectionContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function SectionContainer({
  children,
  title,
  subtitle,
}: SectionContainerProps) {
  return (
    <section className="flex flex-col items-center w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-center text-4xl font-semibold">
          {title}
        </h1>
        <p className=" text-center font-semibold">{subtitle}</p>
      </div>
      <div className="my-12 bg-red-200 flex w-full h-full">{children}</div>
    </section>
  );
}

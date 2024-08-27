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
    <section className="flex flex-col items-center gap-8 w-full my-8 relative min-h-[60vh]">
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-center text-4xl font-semibold">
          {title}
        </h1>
        <p className=" text-center font-semibold">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

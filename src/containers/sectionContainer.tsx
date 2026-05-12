"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";

interface SectionContainerProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  id?: string;
}

export default function SectionContainer({
  children,
  title,
  subtitle,
  id = "",
}: SectionContainerProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const timeout = setTimeout(() => setVisible(true), 600);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          clearTimeout(timeout);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section
      id={id}
      ref={ref}
      className={`flex flex-col items-center gap-8 w-full my-8 relative transition-[opacity,transform] duration-700 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex flex-col gap-2">
        <h1 className="text-primary text-center text-4xl font-semibold">
          {title}
        </h1>
        <p className="text-center font-semibold">{subtitle}</p>
      </div>
      {children}
    </section>
  );
}

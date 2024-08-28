import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollUp from "@/components/scrollUp";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cine Drive-in",
  description:
    "O Cine Drive-in de Brasília oferece a melhor experiência de cinema ao ar livre, combinando nostalgia e inovação em exibições cinematográficas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${montserrat.className} w-screen bg-primary flex flex-col items-center text-gray min-h-screen overflow-x-hidden`}
      >
        <Header />
        <section className="flex justify-center w-full">{children}</section>
        <Footer />
        <ScrollUp />
      </body>
    </html>
  );
}

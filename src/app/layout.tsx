import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import "./seasonal.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScrollUp from "@/components/scrollUp";
import AnalyticsProvider from "@/components/analyticsProvider";
import SeasonalProvider from "@/components/seasonal/SeasonalProvider";
import { SEASONAL_BOOT_SCRIPT } from "@/lib/seasonal";

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
    // data-seasonal é aplicado pelo script abaixo antes da hidratação.
    <html lang="pt-br" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: SEASONAL_BOOT_SCRIPT }} />
      </head>
      <body
        className={`${montserrat.className} w-screen bg-primary flex flex-col items-center text-gray min-h-screen overflow-x-hidden`}
      >
        <SeasonalProvider>
          <AnalyticsProvider />
          <Header />
          <section className="flex justify-center w-full">{children}</section>
          <Footer />
          <ScrollUp />
        </SeasonalProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import ScoreboardClient from "./ScoreboardClient";

/** Página interna (sem link no site): placar completo com nome e telefone. */
export const metadata: Metadata = {
  title: "Placar completo · Snake",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false },
  },
};

export default function SnakeScoreboardPage() {
  return <ScoreboardClient />;
}

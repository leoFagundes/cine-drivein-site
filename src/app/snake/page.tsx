"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import ClapperBoard from "./ClapperBoard";
import SnakeGame from "./SnakeGame";
import { useSiteSnakeLeaderboard } from "./useSiteSnakeLeaderboard";
import {
  getOrCreatePlayerId,
  getSavedPlayerName,
  savePlayerName,
} from "@/lib/snakeIdentity";

export default function SnakePage() {
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [playerName, setPlayerNameState] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [score, setScore] = useState(0);

  useEffect(() => {
    setPlayerId(getOrCreatePlayerId());
    setPlayerNameState(getSavedPlayerName());
  }, []);

  const { highScore, leaderboard, rank, submitScore } = useSiteSnakeLeaderboard(
    playerId,
    playerName,
  );
  const isInTopTen = leaderboard.some((e) => e.id === playerId);

  const handleGameOver = useCallback(
    (finalScore: number) => {
      void submitScore(finalScore);
    },
    [submitScore],
  );

  function handleNameSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    savePlayerName(trimmed);
    setPlayerNameState(trimmed);
  }

  return (
    <section className="flex flex-col gap-6 w-11/12 sm:w-10/12 max-w-[1200px] my-8 items-center">
      <div className="flex flex-col items-center gap-2 text-center">
        <ClapperBoard />
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary mt-1">
          Sessão secreta
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
          Você encontrou o easter egg!
        </h1>
        <p className="text-sm text-stone-500 max-w-md">
          Já que chegou até aqui, que tal uma partida de Snake?
        </p>
      </div>

      {!playerName ? (
        <form
          onSubmit={handleNameSubmit}
          className="flex flex-col items-center gap-3 w-full max-w-xs px-6 py-8 rounded-2xl bg-white border border-stone-200 shadow-sm"
        >
          <p className="text-sm font-semibold text-stone-800 text-center">
            Escolha um nome pro placar
          </p>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            maxLength={24}
            placeholder="Seu nome"
            autoFocus
            className="w-full h-11 px-3 rounded-xl border border-stone-200 text-sm outline-none focus:border-primary"
          />
          <button
            type="submit"
            disabled={!nameInput.trim()}
            className="w-full h-11 rounded-xl bg-stone-900 text-white text-sm font-semibold disabled:opacity-40"
          >
            Jogar
          </button>
        </form>
      ) : (
        <div className="flex flex-wrap items-start justify-center gap-5 sm:gap-8 w-full">
          <SnakeGame onScoreChange={setScore} onGameOver={handleGameOver} />

          <div className="flex flex-col gap-5 w-full max-w-xs text-center sm:max-w-none sm:w-56 sm:text-left">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                Pontuação
              </p>
              <p className="text-2xl font-bold text-stone-900">{score}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-stone-400">
                Seu recorde
              </p>
              <p className="text-lg font-semibold text-primary">
                {Math.max(highScore, score)}
              </p>
            </div>

            {leaderboard.length > 0 && (
              <div className="rounded-xl px-3 py-3 bg-white border border-stone-200">
                <p className="text-[10px] uppercase tracking-[0.3em] mb-2 text-stone-400">
                  Melhores
                </p>
                <div className="flex flex-col gap-1.5">
                  {leaderboard.map((entry, i) => (
                    <div
                      key={entry.id}
                      className={`flex items-center justify-between text-xs ${
                        entry.id === playerId
                          ? "font-semibold text-stone-900"
                          : "text-stone-500"
                      }`}
                    >
                      <span className="truncate">
                        {i + 1}. {entry.name}
                      </span>
                      <span className="flex-shrink-0 ml-2">
                        {entry.highScore}
                      </span>
                    </div>
                  ))}
                </div>

                {!isInTopTen && rank != null && (
                  <p className="text-xs mt-2 pt-2 border-t border-stone-100 font-semibold text-stone-900">
                    Você está em #{rank}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-600"
      >
        <IoArrowBack size={12} />
        Voltar para o site
      </Link>
    </section>
  );
}

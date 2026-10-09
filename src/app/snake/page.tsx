"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { IoArrowBack, IoCreateOutline } from "react-icons/io5";
import SnakeGame from "./SnakeGame";
import PlayerForm from "./PlayerForm";
import Leaderboard from "./Leaderboard";
import { useSiteSnakeLeaderboard } from "./useSiteSnakeLeaderboard";
import { SNAKE_THEME } from "./snakeConfig";
import { SNAKE_THEMES, SNAKE_THEME_PREVIEW, type SnakeThemeId } from "./themes";
import {
  getLegacyPlayerName,
  getOrCreatePlayerId,
  getSavedProfile,
  saveProfile as saveProfileLocally,
  toDisplayName,
  type PlayerProfile,
} from "@/lib/snakeIdentity";
import "./snake.css";

export default function SnakePage() {
  const [themeId, setThemeId] = useState<SnakeThemeId>(SNAKE_THEME);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [profile, setProfile] = useState<PlayerProfile | null>(null);
  const [legacyName, setLegacyName] = useState("");
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState(false);

  const theme = SNAKE_THEMES[themeId];
  const { copy, HeroArt, HeroBackdrop } = theme;

  useEffect(() => {
    const preview = new URLSearchParams(window.location.search).get("cobrinha");
    const previewTheme = preview ? SNAKE_THEME_PREVIEW[preview.toLowerCase()] : undefined;
    if (previewTheme) setThemeId(previewTheme);

    setPlayerId(getOrCreatePlayerId());
    setProfile(getSavedProfile());
    setLegacyName(getLegacyPlayerName() ?? "");
    setReady(true);
  }, []);

  const { highScore, leaderboard, leaderboardLoaded, rank, submitScore, saveProfile } =
    useSiteSnakeLeaderboard(playerId, profile);

  function handleProfile(next: PlayerProfile) {
    saveProfileLocally(next);
    setProfile(next);
    setEditing(false);
    void saveProfile(next);
  }

  const handleGameOver = useCallback(
    (score: number, durationMs: number) => {
      void submitScore(score, durationMs);
    },
    [submitScore],
  );

  return (
    <main data-sk-theme={theme.id} className="sk-page w-full flex justify-center">
      <div className="flex flex-col gap-5 w-11/12 sm:w-10/12 max-w-[1100px] my-6 sm:my-10">
        <header className="sk-hero">
          {HeroBackdrop && <HeroBackdrop />}
          <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <HeroArt />
            <div className="flex flex-col items-center sm:items-start gap-1.5 text-center sm:text-left">
              <span className="sk-hero__eyebrow">{copy.eyebrow}</span>
              <h1 className="sk-hero__title">{copy.title}</h1>
              <p className="sk-hero__subtitle">{copy.subtitle}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px] items-start">
          <div className="flex flex-col gap-3 w-full max-w-[560px] mx-auto lg:mx-0 lg:max-w-none">
            {!ready ? (
              <div className="sk-card sk-placeholder" aria-hidden="true" />
            ) : !profile ? (
              <PlayerForm
                mode="register"
                copy={copy}
                initialName={legacyName}
                onSubmit={handleProfile}
              />
            ) : (
              <>
                <div className="sk-player">
                  <span className="sk-player__label">{copy.playingAs}</span>
                  <strong className="sk-player__name">{toDisplayName(profile.fullName)}</strong>
                  {!editing && (
                    <button
                      type="button"
                      className="sk-player__edit"
                      onClick={() => setEditing(true)}
                    >
                      <IoCreateOutline size={15} /> Editar
                    </button>
                  )}
                </div>
                {editing && (
                  <PlayerForm
                    mode="edit"
                    copy={copy}
                    initialName={profile.fullName}
                    initialPhone={profile.phone}
                    onSubmit={handleProfile}
                    onCancel={() => setEditing(false)}
                  />
                )}
                <SnakeGame
                  theme={theme}
                  record={highScore}
                  rank={rank}
                  suspended={editing}
                  onGameOver={handleGameOver}
                />
              </>
            )}
          </div>

          <Leaderboard
            title={copy.leaderboardTitle}
            emptyText={copy.leaderboardEmpty}
            entries={leaderboard}
            loaded={leaderboardLoaded}
            playerId={playerId}
            rank={rank}
            highScore={highScore}
          />
        </div>

        <Link href="/" className="sk-back">
          <IoArrowBack size={13} />
          Voltar para o site
        </Link>
      </div>
    </main>
  );
}

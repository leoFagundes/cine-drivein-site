"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { toDisplayName, type PlayerProfile } from "@/lib/snakeIdentity";

/** Placar público: só nome de exibição + pontuação (é o que todo visitante baixa). */
export const SCORES_COLLECTION = "siteSnakeScores";
/**
 * Cadastro dos jogadores (nome completo + telefone). Só a página
 * /snake/scoreboard lê esta coleção — a /snake pública nunca baixa telefones.
 */
export const PLAYERS_COLLECTION = "siteSnakePlayers";
const MAX_SCORE = 500;

export interface LeaderboardEntry {
  id: string;
  name: string;
  highScore: number;
}

interface UseSiteSnakeLeaderboardResult {
  highScore: number;
  loaded: boolean;
  leaderboardLoaded: boolean;
  leaderboard: LeaderboardEntry[];
  rank: number | null;
  submitScore: (score: number, durationMs: number) => Promise<boolean>;
  saveProfile: (profile: PlayerProfile) => Promise<void>;
}

/**
 * Placar global da Snake do site. Sem login: a identidade é um UUID anônimo
 * gerado no navegador (ver `snakeIdentity.ts`), usado como id dos dois docs.
 */
export function useSiteSnakeLeaderboard(
  playerId: string | null,
  profile: PlayerProfile | null,
): UseSiteSnakeLeaderboardResult {
  const [highScore, setHighScore] = useState(0);
  const [loaded, setLoaded] = useState(() => !playerId);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoaded, setLeaderboardLoaded] = useState(false);
  const [rank, setRank] = useState<number | null>(null);
  const highScoreRef = useRef(0);

  const refreshLeaderboard = useCallback(() => {
    const q = query(
      collection(db, SCORES_COLLECTION),
      orderBy("highScore", "desc"),
      limit(10),
    );
    getDocs(q)
      .then((snap) => {
        setLeaderboard(
          snap.docs.map((d) => ({
            id: d.id,
            name: (d.data().name as string) ?? "Jogador",
            highScore: (d.data().highScore as number) ?? 0,
          })),
        );
      })
      .catch(() => {})
      .finally(() => setLeaderboardLoaded(true));
  }, []);

  const refreshRank = useCallback(
    (score: number) => {
      if (!playerId || score <= 0) {
        setRank(null);
        return;
      }
      const q = query(
        collection(db, SCORES_COLLECTION),
        where("highScore", ">", score),
      );
      getCountFromServer(q)
        .then((snap) => setRank(snap.data().count + 1))
        .catch(() => setRank(null));
    },
    [playerId],
  );

  useEffect(() => {
    if (!playerId) return;
    let cancelled = false;
    getDoc(doc(db, SCORES_COLLECTION, playerId))
      .then((snap) => {
        if (cancelled) return;
        const value = snap.exists() ? ((snap.data().highScore as number) ?? 0) : 0;
        highScoreRef.current = value;
        setHighScore(value);
        setLoaded(true);
        refreshRank(value);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [playerId, refreshRank]);

  useEffect(() => {
    refreshLeaderboard();
  }, [refreshLeaderboard]);

  const submitScore = useCallback(
    async (score: number, durationMs: number) => {
      if (!playerId || !profile || score <= highScoreRef.current) return false;
      const clamped = Math.min(score, MAX_SCORE);
      highScoreRef.current = clamped;
      setHighScore(clamped);
      // Independentes: se uma falhar (ex.: regra ainda não publicada), a outra segue.
      await Promise.allSettled([
        setDoc(
          doc(db, SCORES_COLLECTION, playerId),
          {
            name: toDisplayName(profile.fullName),
            highScore: clamped,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
        setDoc(
          doc(db, PLAYERS_COLLECTION, playerId),
          {
            fullName: profile.fullName,
            phone: profile.phone,
            bestScore: clamped,
            bestDurationMs: Math.max(0, Math.round(durationMs)),
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ]);
      refreshLeaderboard();
      refreshRank(clamped);
      return true;
    },
    [playerId, profile, refreshLeaderboard, refreshRank],
  );

  /** Grava o cadastro e, se já houver recorde, atualiza o nome no placar. */
  const saveProfile = useCallback(
    async (next: PlayerProfile) => {
      if (!playerId) return;
      const writes: Promise<void>[] = [
        setDoc(
          doc(db, PLAYERS_COLLECTION, playerId),
          {
            fullName: next.fullName,
            phone: next.phone,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        ),
      ];
      if (highScoreRef.current > 0) {
        writes.push(
          setDoc(
            doc(db, SCORES_COLLECTION, playerId),
            { name: toDisplayName(next.fullName) },
            { merge: true },
          ),
        );
      }
      await Promise.allSettled(writes);
      refreshLeaderboard();
    },
    [playerId, refreshLeaderboard],
  );

  return {
    highScore,
    loaded,
    leaderboardLoaded,
    leaderboard,
    rank,
    submitScore,
    saveProfile,
  };
}

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

const COLLECTION = "siteSnakeScores";
const MAX_SCORE = 500;

export interface LeaderboardEntry {
  id: string;
  name: string;
  highScore: number;
}

interface UseSiteSnakeLeaderboardResult {
  highScore: number;
  loaded: boolean;
  leaderboard: LeaderboardEntry[];
  rank: number | null;
  submitScore: (score: number) => Promise<boolean>;
}

/**
 * Placar público e global da Snake do site — coleção `siteSnakeScores`,
 * separada da `snakeScores` do admin. Sem login: a identidade é um UUID
 * anônimo gerado no navegador (ver `snakeIdentity.ts`).
 */
export function useSiteSnakeLeaderboard(
  playerId: string | null,
  playerName: string | null,
): UseSiteSnakeLeaderboardResult {
  const [highScore, setHighScore] = useState(0);
  const [loaded, setLoaded] = useState(() => !playerId);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const highScoreRef = useRef(0);

  const refreshLeaderboard = useCallback(() => {
    const q = query(
      collection(db, COLLECTION),
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
      .catch(() => {});
  }, []);

  const refreshRank = useCallback(
    (score: number) => {
      if (!playerId || score <= 0) {
        setRank(null);
        return;
      }
      const q = query(collection(db, COLLECTION), where("highScore", ">", score));
      getCountFromServer(q)
        .then((snap) => setRank(snap.data().count + 1))
        .catch(() => setRank(null));
    },
    [playerId],
  );

  useEffect(() => {
    if (!playerId) return;
    let cancelled = false;
    getDoc(doc(db, COLLECTION, playerId))
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
    async (score: number) => {
      if (!playerId || score <= highScoreRef.current) return false;
      const clamped = Math.min(score, MAX_SCORE);
      highScoreRef.current = clamped;
      setHighScore(clamped);
      try {
        await setDoc(
          doc(db, COLLECTION, playerId),
          {
            name: playerName ?? "Jogador",
            highScore: clamped,
            updatedAt: serverTimestamp(),
          },
          { merge: true },
        );
        refreshLeaderboard();
        refreshRank(clamped);
      } catch {}
      return true;
    },
    [playerId, playerName, refreshLeaderboard, refreshRank],
  );

  return { highScore, loaded, leaderboard, rank, submitScore };
}

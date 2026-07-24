"use client";

import { useEffect, useState } from "react";
import { FaStar, FaUserCircle } from "react-icons/fa";
import FeedbackRepositories from "@/services/repositories/FeedbackRepositories";
import { FeedbackEntry } from "@/types/Types";

const STORAGE_KEY = "@cinedrive:myFeedbacks";
const MAX_STORED = 20;

/** Guarda o id da avaliação recém-enviada — usado para mostrá-la (translúcida,
 * "em análise") só pra quem enviou, enquanto ainda não foi aprovada. */
export function saveMyFeedbackId(id: string) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const ids: string[] = raw ? JSON.parse(raw) : [];
    const next = [id, ...ids.filter((x) => x !== id)].slice(0, MAX_STORED);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    /* localStorage indisponível — segue sem marcar, sem quebrar o envio */
  }
}

function loadMyFeedbackIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function timeAgo(date: Date): string {
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  const hr = Math.floor(diff / 3600000);
  const day = Math.floor(diff / 86400000);
  if (diff < 60000) return "agora mesmo";
  if (min < 60) return `há ${min} minuto${min !== 1 ? "s" : ""}`;
  if (hr < 24) return `há ${hr} hora${hr !== 1 ? "s" : ""}`;
  if (day < 30) return `há ${day} dia${day !== 1 ? "s" : ""}`;
  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function Stars({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`${rating} de 5 estrelas`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          size={13}
          aria-hidden="true"
          className={star <= rating ? "text-amber-400" : "text-stone-300"}
        />
      ))}
    </div>
  );
}

function FeedbackItem({
  feedback,
  isMine,
}: {
  feedback: FeedbackEntry;
  isMine: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-2.5 rounded-lg border border-stone-200 bg-white p-4 shadow-card transition-opacity ${
        isMine ? "opacity-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <FaUserCircle className="text-stone-300 flex-shrink-0" size={26} />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {feedback.name?.trim() || "Anônimo"}
            </p>
            <Stars rating={feedback.rating} />
          </div>
        </div>
        {isMine && (
          <span className="flex-shrink-0 text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5 whitespace-nowrap">
            Em análise
          </span>
        )}
      </div>

      <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
        {feedback.message}
      </p>

      <p className="text-xs text-stone-400">{timeAgo(feedback.createdAt)}</p>

      {feedback.reply && (
        <div className="rounded-lg bg-stone-50 border border-stone-200 p-3 flex flex-col gap-1">
          <p className="text-xs font-semibold text-primary">
            Resposta do Cine Drive-in
          </p>
          <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-wrap">
            {feedback.reply}
          </p>
        </div>
      )}
    </div>
  );
}

function StatsHeader({
  approved,
}: {
  approved: FeedbackEntry[];
}) {
  if (approved.length === 0) return null;
  const avg = approved.reduce((sum, f) => sum + f.rating, 0) / approved.length;
  return (
    <div className="flex items-center justify-center gap-1.5 text-sm">
      <FaStar className="text-amber-400" size={15} />
      <span className="font-semibold">{avg.toFixed(1)}</span>
      <span className="text-stone-400">
        · baseado em {approved.length}{" "}
        {approved.length === 1 ? "avaliação" : "avaliações"}
      </span>
    </div>
  );
}

export default function FeedbackList({ refreshKey }: { refreshKey: number }) {
  const [items, setItems] = useState<
    { feedback: FeedbackEntry; isMine: boolean }[]
  >([]);
  const [approvedForStats, setApprovedForStats] = useState<FeedbackEntry[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setLoadError(false);
      try {
        const all = await FeedbackRepositories.getAllFeedbacks();
        if (cancelled) return;
        const myIds = loadMyFeedbackIds();

        const approved = all.filter((f) => f.status === "approved");
        const visible = [
          ...approved,
          ...all.filter(
            (f) => f.status === "pending" && myIds.has(f.id),
          ),
        ];
        visible.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setApprovedForStats(approved);
        setItems(
          visible.map((f) => ({
            feedback: f,
            isMine: f.status === "pending" && myIds.has(f.id),
          })),
        );
      } catch (err) {
        console.error("Erro ao carregar avaliações:", err);
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  if (loading) {
    return (
      <p className="text-sm text-stone-400 text-center py-6">
        Carregando avaliações...
      </p>
    );
  }

  if (loadError) {
    return (
      <p className="text-sm text-stone-400 text-center py-6">
        Não foi possível carregar as avaliações. Recarregue a página pra
        tentar de novo.
      </p>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-stone-400 text-center py-6">
        Nenhuma avaliação por aqui ainda. Seja o primeiro a avaliar!
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <StatsHeader approved={approvedForStats} />
      {items.map(({ feedback, isMine }) => (
        <FeedbackItem key={feedback.id} feedback={feedback} isMine={isMine} />
      ))}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { IoDownloadOutline, IoLogoWhatsapp, IoRefresh, IoSearch } from "react-icons/io5";
import { db } from "@/services/firebase";
import { digitsOnly, formatPhone, toDisplayName } from "@/lib/snakeIdentity";
import { PLAYERS_COLLECTION, SCORES_COLLECTION } from "../useSiteSnakeLeaderboard";

interface Row {
  id: string;
  rank: number;
  displayName: string;
  fullName: string | null;
  phone: string | null;
  score: number;
  durationMs: number | null;
  updatedAt: Date | null;
  /** Quantos cadastros (aparelhos) usam o mesmo telefone. */
  entries: number;
}

type BaseRow = Omit<Row, "rank" | "entries">;

function toDate(value: unknown): Date | null {
  const v = value as { toDate?: () => Date } | null | undefined;
  return typeof v?.toDate === "function" ? v.toDate() : null;
}

/** Mais pontos vence; no empate, quem chegou primeiro. */
function isBetter(a: BaseRow, b: BaseRow) {
  if (a.score !== b.score) return a.score > b.score;
  return (a.updatedAt?.getTime() ?? Infinity) < (b.updatedAt?.getTime() ?? Infinity);
}

async function loadRows(): Promise<Row[]> {
  const [scoresSnap, playersSnap] = await Promise.all([
    getDocs(query(collection(db, SCORES_COLLECTION), orderBy("highScore", "desc"), limit(2000))),
    getDocs(collection(db, PLAYERS_COLLECTION)),
  ]);

  const players = new Map(playersSnap.docs.map((d) => [d.id, d.data()]));
  const base = new Map<string, BaseRow>();

  for (const d of scoresSnap.docs) {
    const s = d.data();
    const p = players.get(d.id);
    const score = (s.highScore as number) ?? 0;
    base.set(d.id, {
      id: d.id,
      displayName: (s.name as string) ?? "Jogador",
      fullName: (p?.fullName as string) ?? null,
      phone: (p?.phone as string) ?? null,
      score,
      durationMs: p && p.bestScore === score ? ((p.bestDurationMs as number) ?? null) : null,
      updatedAt: toDate(s.updatedAt),
    });
  }

  // Cadastrados que ainda não pontuaram também entram (útil para contato).
  players.forEach((p, id) => {
    if (base.has(id)) return;
    base.set(id, {
      id,
      displayName: toDisplayName((p.fullName as string) ?? ""),
      fullName: (p.fullName as string) ?? null,
      phone: (p.phone as string) ?? null,
      score: 0,
      durationMs: null,
      updatedAt: toDate(p.updatedAt),
    });
  });

  // Mesma pessoa em vários aparelhos (mesmo telefone): fica o melhor resultado.
  const grouped = new Map<string, { best: BaseRow; entries: number }>();
  base.forEach((row) => {
    const key = row.phone ? `tel:${row.phone}` : `id:${row.id}`;
    const current = grouped.get(key);
    if (!current) grouped.set(key, { best: row, entries: 1 });
    else {
      current.entries += 1;
      if (isBetter(row, current.best)) current.best = row;
    }
  });

  return Array.from(grouped.values())
    .sort((a, b) => (isBetter(a.best, b.best) ? -1 : isBetter(b.best, a.best) ? 1 : 0))
    .map(({ best, entries }, i) => ({ ...best, rank: i + 1, entries }));
}

function formatDuration(ms: number | null) {
  if (ms === null) return "—";
  const total = Math.round(ms / 1000);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function formatDate(date: Date | null) {
  return date
    ? date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })
    : "—";
}

function downloadCsv(rows: Row[]) {
  const header = [
    "Posição",
    "Nome completo",
    "Nome no placar",
    "Telefone",
    "Pontos",
    "Tempo da melhor partida",
    "Atualizado em",
    "Cadastros com o mesmo telefone",
  ];
  const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;
  const lines = rows.map((r) =>
    [
      r.rank,
      r.fullName ?? "",
      r.displayName,
      r.phone ? formatPhone(r.phone) : "",
      r.score,
      formatDuration(r.durationMs),
      formatDate(r.updatedAt),
      r.entries,
    ]
      .map(escape)
      .join(";"),
  );
  // BOM + ";" para o Excel em português abrir com acentos e colunas certas.
  const csv = `﻿${[header.map(escape).join(";"), ...lines].join("\r\n")}`;
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `placar-snake-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function ScoreboardClient() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const refresh = useCallback(() => {
    setLoading(true);
    setError(false);
    loadRows()
      .then(setRows)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    const digits = digitsOnly(term);
    return rows.filter(
      (r) =>
        (r.fullName ?? r.displayName).toLowerCase().includes(term) ||
        (digits.length > 0 && (r.phone ?? "").includes(digits)),
    );
  }, [rows, search]);

  const withPhone = rows?.filter((r) => r.phone).length ?? 0;

  return (
    <section className="flex flex-col gap-5 w-11/12 sm:w-10/12 max-w-[1200px] my-8">
      <header className="flex flex-col gap-1">
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-400">
          Página interna · não divulgue este link
        </span>
        <h1 className="text-3xl font-bold text-stone-900">Placar completo da Snake</h1>
        <p className="text-sm text-stone-500">
          {rows
            ? `${rows.length} participantes · ${withPhone} com telefone cadastrado`
            : "Carregando participantes…"}
        </p>
      </header>

      <div className="flex flex-col sm:flex-row gap-2">
        <label className="relative flex-1">
          <IoSearch
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone"
            className="w-full h-11 pl-9 pr-3 rounded-xl border border-stone-200 bg-white text-sm outline-none focus:border-stone-400"
          />
        </label>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:opacity-50"
        >
          <IoRefresh size={16} className={loading ? "animate-spin" : ""} /> Atualizar
        </button>
        <button
          type="button"
          onClick={() => downloadCsv(filtered)}
          disabled={filtered.length === 0}
          className="h-11 px-4 inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 text-sm font-semibold text-white hover:bg-stone-800 disabled:opacity-40"
        >
          <IoDownloadOutline size={16} /> Baixar CSV
        </button>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-medium text-red-700">
          Não foi possível carregar o placar. Tente atualizar.
        </p>
      )}

      <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white shadow-sm">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-stone-400 border-b border-stone-200">
              <th className="px-4 py-3 font-semibold w-14">#</th>
              <th className="px-4 py-3 font-semibold">Nome completo</th>
              <th className="px-4 py-3 font-semibold">Telefone</th>
              <th className="px-4 py-3 font-semibold text-right">Pontos</th>
              <th className="px-4 py-3 font-semibold text-right">Tempo</th>
              <th className="px-4 py-3 font-semibold">Atualizado em</th>
            </tr>
          </thead>
          <tbody>
            {rows === null && !error
              ? Array.from({ length: 6 }, (_, i) => (
                  <tr key={i} className="border-b border-stone-100 last:border-0">
                    <td colSpan={6} className="px-4 py-3">
                      <div className="h-4 rounded bg-stone-100 animate-pulse" />
                    </td>
                  </tr>
                ))
              : filtered.map((r) => (
                  <tr key={r.id} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                    <td className="px-4 py-3 font-bold text-stone-500">{r.rank}º</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-stone-900">
                        {r.fullName ?? r.displayName}
                      </div>
                      <div className="text-xs text-stone-400">
                        No placar: {r.displayName}
                        {r.entries > 1 && ` · ${r.entries} aparelhos`}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {r.phone ? (
                        <a
                          href={`https://wa.me/55${r.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 font-medium text-emerald-700 hover:underline"
                        >
                          <IoLogoWhatsapp size={15} />
                          {formatPhone(r.phone)}
                        </a>
                      ) : (
                        <span className="text-xs text-stone-400">sem cadastro</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-bold tabular-nums text-stone-900">
                      {r.score}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-stone-500">
                      {formatDuration(r.durationMs)}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{formatDate(r.updatedAt)}</td>
                  </tr>
                ))}
            {rows !== null && filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-stone-400">
                  Nenhum participante encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-stone-400">
        Empates ficam com quem fez a pontuação primeiro. &quot;Tempo&quot; é a duração da
        melhor partida — ajuda a identificar pontuações impossíveis.
      </p>
    </section>
  );
}

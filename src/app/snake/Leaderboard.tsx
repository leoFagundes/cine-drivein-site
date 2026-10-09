import type { LeaderboardEntry } from "./useSiteSnakeLeaderboard";

const MEDALS = ["🥇", "🥈", "🥉"];

/** Placar público — só nome de exibição e pontuação. */
export default function Leaderboard({
  title,
  emptyText,
  entries,
  loaded,
  playerId,
  rank,
  highScore,
}: {
  title: string;
  emptyText: string;
  entries: LeaderboardEntry[];
  loaded: boolean;
  playerId: string | null;
  rank: number | null;
  highScore: number;
}) {
  const inTop = entries.some((e) => e.id === playerId);

  return (
    <section className="sk-card sk-board-list" aria-labelledby="sk-leaderboard-title">
      <div className="flex items-center justify-between gap-2">
        <h2 id="sk-leaderboard-title" className="sk-list__title">
          {title}
        </h2>
        <span className="sk-list__tag">Top 10</span>
      </div>

      {!loaded ? (
        <ol className="sk-list" aria-busy="true">
          {Array.from({ length: 5 }, (_, i) => (
            <li key={i} className="sk-list__row is-skeleton" />
          ))}
        </ol>
      ) : entries.length === 0 ? (
        <p className="sk-list__empty">{emptyText}</p>
      ) : (
        <ol className="sk-list">
          {entries.map((entry, i) => (
            <li
              key={entry.id}
              className={`sk-list__row${entry.id === playerId ? " is-me" : ""}${i < 3 ? " is-podium" : ""}`}
            >
              <span className="sk-list__pos">{MEDALS[i] ?? `${i + 1}º`}</span>
              <span className="sk-list__name">
                <span className="sk-list__name-text">{entry.name}</span>
                {entry.id === playerId && <span className="sk-list__you">você</span>}
              </span>
              <span className="sk-list__score">{entry.highScore}</span>
            </li>
          ))}
        </ol>
      )}

      {!inTop && rank !== null && highScore > 0 && (
        <p className="sk-list__me">
          Você está em <strong>#{rank}</strong> com <strong>{highScore}</strong> pontos
        </p>
      )}
    </section>
  );
}

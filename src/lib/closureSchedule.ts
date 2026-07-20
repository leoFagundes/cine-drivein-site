import type { ClosureSchedule } from "@/types/Types";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function timeKey(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** A programação está em vigor agora? */
export function isScheduleActiveNow(schedule: ClosureSchedule, now: Date): boolean {
  if (!schedule.active) return false;

  const today = dateKey(now);
  if (today < schedule.fromDate || today > schedule.toDate) return false;

  if (schedule.allDay) return true;
  if (!schedule.startTime || !schedule.endTime) return false;

  const nowTime = timeKey(now);
  return nowTime >= schedule.startTime && nowTime < schedule.endTime;
}

/** Primeira programação ativa em vigor agora, ou null. */
export function getActiveClosure(
  schedules: ClosureSchedule[] | undefined,
  now: Date,
): ClosureSchedule | null {
  if (!schedules) return null;
  return schedules.find((s) => isScheduleActiveNow(s, now)) ?? null;
}

/**
 * Próxima programação futura (ainda não em vigor) visível aos clientes — para
 * um aviso sutil de "não vai ter sessão nesse dia", antes do dia do fechamento
 * (no dia do fechamento em si, quem assume é o modal de `getActiveClosure`).
 */
export function getNextUpcomingClosure(
  schedules: ClosureSchedule[] | undefined,
  now: Date,
): ClosureSchedule | null {
  if (!schedules) return null;

  const today = dateKey(now);
  const upcoming = schedules
    .filter(
      (s) =>
        s.active &&
        s.visibleToCustomers !== false &&
        s.fromDate > today,
    )
    .sort((a, b) => (a.fromDate < b.fromDate ? -1 : a.fromDate > b.fromDate ? 1 : 0));

  return upcoming[0] ?? null;
}

function formatBrDate(dateKey: string): string {
  const [, month, day] = dateKey.split("-");
  return `${day}/${month}`;
}

/** Texto curto pra exibir no aviso, ex: "dia 25/07" ou "de 25/07 a 27/07, das 20h às 23h". */
export function formatScheduleWindow(schedule: ClosureSchedule): string {
  const from = formatBrDate(schedule.fromDate);
  const to = formatBrDate(schedule.toDate);
  const dateLabel =
    schedule.fromDate === schedule.toDate ? `dia ${from}` : `de ${from} a ${to}`;

  if (schedule.allDay || !schedule.startTime || !schedule.endTime) {
    return dateLabel;
  }
  return `${dateLabel}, das ${schedule.startTime} às ${schedule.endTime}`;
}

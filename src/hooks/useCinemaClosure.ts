import { useEffect, useState } from "react";
import type { SiteConfig } from "@/types/Types";
import { getActiveClosure, getNextUpcomingClosure } from "@/lib/closureSchedule";

const CHECK_INTERVAL_MS = 60_000;

/**
 * Combina o toggle manual (`isClosed`) com as programações avançadas de
 * fechamento: fica "fechado" se qualquer um dos dois disser que sim. Também
 * expõe a próxima programação futura, pra um aviso sutil de "não vai ter
 * sessão nesse dia" nos dias antes do fechamento em si. Reavalia a cada
 * minuto para pegar o início/fim de uma janela sem precisar recarregar a
 * página.
 */
export function useCinemaClosure(config: SiteConfig | null) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), CHECK_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  const activeSchedule = getActiveClosure(config?.closureSchedules, now);
  const closed = Boolean(config?.isClosed) || Boolean(activeSchedule);
  const reason = activeSchedule?.reason ?? null;
  const upcoming = getNextUpcomingClosure(config?.closureSchedules, now);

  return { closed, reason, upcoming };
}

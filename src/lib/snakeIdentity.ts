const PLAYER_ID_KEY = "cdi_snake_player_id";
const PLAYER_NAME_KEY = "cdi_snake_player_name";

/** UUID anônimo estável por navegador — identidade do doc no placar público. */
export function getOrCreatePlayerId(): string {
  try {
    const existing = localStorage.getItem(PLAYER_ID_KEY);
    if (existing) return existing;
    const id = crypto.randomUUID();
    localStorage.setItem(PLAYER_ID_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

export function getSavedPlayerName(): string | null {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY);
  } catch {
    return null;
  }
}

export function savePlayerName(name: string): void {
  try {
    localStorage.setItem(PLAYER_NAME_KEY, name);
  } catch {
    // localStorage indisponível (modo privado restrito) — segue sem salvar
  }
}

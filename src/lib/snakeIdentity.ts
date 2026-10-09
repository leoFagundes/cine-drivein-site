const PLAYER_ID_KEY = "cdi_snake_player_id";
/** Formato antigo (só o nome) — lido apenas para pré-preencher o cadastro novo. */
const PLAYER_NAME_KEY = "cdi_snake_player_name";
const PLAYER_PROFILE_KEY = "cdi_snake_player_profile";

/** Limite de tamanho do nome no placar público (regra do Firestore). */
const DISPLAY_NAME_MAX = 24;

export interface PlayerProfile {
  fullName: string;
  /** Só dígitos, com DDD (10 ou 11). */
  phone: string;
}

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

export function getLegacyPlayerName(): string | null {
  try {
    return localStorage.getItem(PLAYER_NAME_KEY);
  } catch {
    return null;
  }
}

export function getSavedProfile(): PlayerProfile | null {
  try {
    const raw = localStorage.getItem(PLAYER_PROFILE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Partial<PlayerProfile>;
    if (
      typeof data.fullName === "string" &&
      typeof data.phone === "string" &&
      isValidFullName(data.fullName) &&
      isValidPhone(data.phone)
    ) {
      return { fullName: data.fullName, phone: data.phone };
    }
    return null;
  } catch {
    return null;
  }
}

export function saveProfile(profile: PlayerProfile): void {
  try {
    localStorage.setItem(PLAYER_PROFILE_KEY, JSON.stringify(profile));
    localStorage.setItem(PLAYER_NAME_KEY, toDisplayName(profile.fullName));
  } catch {
    // localStorage indisponível (modo privado restrito) — segue sem salvar
  }
}

/* ───────────── Nome ───────────── */

export function normalizeName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

/** Nome e sobrenome, cada um com pelo menos 2 letras. */
export function isValidFullName(name: string): boolean {
  const clean = normalizeName(name);
  if (clean.length > 80) return false;
  const parts = clean.split(" ");
  return (
    parts.length >= 2 &&
    parts[0].length >= 2 &&
    parts[parts.length - 1].length >= 2 &&
    /[A-Za-zÀ-ÿ]/.test(clean)
  );
}

/** Primeiro e último nome — é o que aparece no placar público. */
export function toDisplayName(fullName: string): string {
  const parts = normalizeName(fullName).split(" ");
  const short =
    parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1]}` : parts[0];
  return short.slice(0, DISPLAY_NAME_MAX).trim() || "Jogador";
}

/* ───────────── Telefone (BR, com DDD) ───────────── */

export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

/** Celular (DDD + 9 + 8 dígitos) ou fixo (DDD + 8 dígitos começando em 2–5). */
export function isValidPhone(digits: string): boolean {
  return /^[1-9]{2}(9\d{8}|[2-5]\d{7})$/.test(digits);
}

/** Máscara progressiva enquanto a pessoa digita: (61) 99999-9999. */
export function formatPhone(digits: string): string {
  const d = digitsOnly(digits).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  const ddd = d.slice(0, 2);
  const rest = d.slice(2);
  if (rest.length <= 4) return `(${ddd}) ${rest}`;
  if (d.length <= 10) return `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
  return `(${ddd}) ${rest.slice(0, 5)}-${rest.slice(5)}`;
}

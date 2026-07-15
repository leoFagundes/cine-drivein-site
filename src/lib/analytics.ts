import { doc, getDoc, increment, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

// ─── Enable/disable flag ──────────────────────────────────────────────────────
// Controlled via siteConfig/analyticsConfig { isEnabled: boolean } in Firestore.
// Defaults to true when the document doesn't exist yet.

const FLAG_TTL = 5 * 60 * 1000;
let _enabled: boolean | null = null;
let _enabledAt = 0;

async function isEnabled(): Promise<boolean> {
  if (_enabled !== null && Date.now() - _enabledAt < FLAG_TTL) return _enabled;
  try {
    const snap = await getDoc(doc(db, "siteConfig", "analyticsConfig"));
    _enabled = snap.exists() ? (snap.data().isEnabled ?? true) : true;
  } catch {
    _enabled = false;
  }
  _enabledAt = Date.now();
  return _enabled!;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function todayKey(): string {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getDevice(): "mobile" | "desktop" {
  return window.innerWidth < 768 ? "mobile" : "desktop";
}

function sessionCounted(): boolean {
  try { return !!sessionStorage.getItem("cin_visit"); } catch { return false; }
}

function markSession(): void {
  try { sessionStorage.setItem("cin_visit", "1"); } catch { /* noop */ }
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type PageClickKey =
  | "cardapio"
  | "vendasOnline"
  | "historia"
  | "mapa"
  | "comoFunciona"
  | "anunciante"
  | "avaliacao";

export type AnalyticsEvent =
  | { type: "visit" }
  | { type: "filmClick"; filmName: string; session: string }
  | { type: "pageClick"; key: PageClickKey };

// ─── Main ─────────────────────────────────────────────────────────────────────

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  if (typeof window === "undefined") return;
  if (!(await isEnabled())) return;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updates: Record<string, any> = {};

  if (event.type === "visit") {
    if (sessionCounted()) return;
    markSession();
    updates["visits"] = increment(1);
    updates[`devices.${getDevice()}`] = increment(1);
  } else if (event.type === "filmClick") {
    const safeName = event.filmName.replace(/[./[\]#$]/g, "_").slice(0, 100);
    updates[`filmClicks.${safeName}`] = increment(1);
    updates[`sessionClicks.${event.session}`] = increment(1);
  } else {
    updates[`pageClicks.${event.key}`] = increment(1);
  }

  // updateDoc treats dot-notation keys as nested paths (setDoc merge does not)
  const ref = doc(db, "analytics", todayKey());
  try {
    await updateDoc(ref, updates);
  } catch (e) {
    if ((e as { code?: string }).code === "not-found") {
      try {
        await setDoc(ref, {});
        await updateDoc(ref, updates);
      } catch (e2) {
        console.error("[analytics]", e2);
      }
    } else {
      console.error("[analytics]", e);
    }
  }
}

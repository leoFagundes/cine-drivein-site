import { SiteConfig } from "@/types/Types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";
import { useEffect, useState } from "react";

let cachedPromise: Promise<SiteConfig | null> | null = null;

function getSiteConfig(): Promise<SiteConfig | null> {
  if (!cachedPromise) {
    cachedPromise = getDoc(doc(db, "siteConfig", "main"))
      .then((snap) => (snap.exists() ? (snap.data() as SiteConfig) : null))
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }
  return cachedPromise;
}

export function invalidateSiteConfig() {
  cachedPromise = null;
}

export function useSiteConfig() {
  const [data, setData] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  function load() {
    setLoading(true);
    setError(false);
    getSiteConfig()
      .then((config) => {
        setData(config);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }

  useEffect(() => {
    load();
  }, []);

  function reload() {
    invalidateSiteConfig();
    load();
  }

  return { data, loading, error, reload };
}

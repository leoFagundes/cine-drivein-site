"use client";

import { useEffect } from "react";
import { ref, set, remove, onValue, onDisconnect } from "firebase/database";
import { rtdb } from "@/services/firebase";

const SESSION_KEY = "cin_presence_sid";

function getSessionId(): string {
  let sid = sessionStorage.getItem(SESSION_KEY);
  if (!sid) {
    sid = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, sid);
  }
  return sid;
}

export default function SitePresenceTracker() {
  useEffect(() => {
    const sid = getSessionId();
    const presenceRef = ref(rtdb, `sitePresence/${sid}`);
    const connectedRef = ref(rtdb, ".info/connected");

    const unsub = onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        onDisconnect(presenceRef).remove();
        set(presenceRef, { connectedAt: Date.now() });
      }
    });

    return () => {
      unsub();
      remove(presenceRef);
    };
  }, []);

  return null;
}

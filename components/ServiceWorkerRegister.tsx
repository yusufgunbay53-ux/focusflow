"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      /* kayıt başarısızsa uygulama normal çalışmaya devam eder */
    });
  }, []);

  return null;
}

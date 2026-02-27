import { useEffect, useState } from "react";

export function useTelegramUser() {
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState("");
  const [tg, setTg] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    if (!telegram) {
      console.warn("Telegram WebApp not available — running in browser mode");
      return;
    }
    telegram.ready();
    telegram.expand();
    setTg(telegram);
    setInitData(telegram.initData || "");
    setUser(telegram.initDataUnsafe?.user ?? null);
  }, []);

  return { user, initData, tg };
}

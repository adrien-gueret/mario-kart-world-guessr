import type { GameHistory } from "@/types/game";
import type { User } from "@/types/user";

const STORAGE_KEY = "mario-kart-world-guessr-store";

type Store = {
  daily: null | {
    history: GameHistory;
    nextDailyDate?: string;
  };
  currentUser: User | null;
};

function getDefaultStore(): Store {
  return {
    daily: null,
    currentUser: null,
  };
}

function getStore(): Store {
  const store = localStorage.getItem(STORAGE_KEY);

  try {
    return store ? JSON.parse(store) : getDefaultStore();
  } catch (e) {
    return getDefaultStore();
  }
}

function putStore(store: Store): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function storeKey<K extends keyof Store>(key: K, value: Store[K]): void {
  const store = getStore();

  putStore({
    ...store,
    [key]: value,
  });
}

export function getKey<K extends keyof Store>(key: K): Store[K] {
  const store = getStore();

  return store[key];
}

import type { Version } from "@/versions/types";
import type { Locale } from "@/i18n/types";
import type { User } from "@/types/user";

const STORAGE_KEY = "mario-kart-world-guessr-store";

type Store = {
  currentUser: User | null;
  lastSeenVersion: Version | null;
  locale: Locale | null;
  daily?: any;
};

function getDefaultStore(): Store {
  return {
    currentUser: null,
    locale: null,
    lastSeenVersion: null,
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

export function removeKey<K extends keyof Store>(key: K): void {
  const store = getStore();

  delete store[key];

  putStore(store);
}

import { createSignal, createEffect } from "solid-js";

import { isServer } from "solid-js/web";
/**
 * A helper to create a signal that stays synced with Local Storage
 */
export function createStoredSignal<T>(key: string, defaultValue: T) {
  if (isServer) return createSignal<T>(defaultValue);

  const stored = localStorage.getItem(key);
  const initial = stored ? (JSON.parse(stored) as T) : defaultValue;

  const [value, setValue] = createSignal<T>(initial);

  // 2. Automatically save to localStorage whenever the signal changes
  createEffect(() => {
    localStorage.setItem(key, JSON.stringify(value()));
  });

  return [value, setValue] as const;
}

/**
 * Permanent phone and browser storage utility for SSC CGL Register.
 *
 * Persists data across app reloads, app restarts, device reboots, and phone upgrades.
 * Uses:
 * 1. Android Native SharedPreferences via AndroidStorage bridge (if running as APK)
 * 2. Window localStorage (standard web persistence)
 * 3. In-memory cache fallback if storage APIs are restricted
 */

declare global {
  interface Window {
    AndroidStorage?: {
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
      removeItem: (key: string) => void;
      clear: () => void;
    };
  }
}

const memoryCache = new Map<string, string>();

export const persistentStorage = {
  getItem(key: string): string | null {
    // 1. Try Android Native SharedPreferences bridge first (survives any port/origin changes)
    try {
      if (typeof window !== 'undefined' && window.AndroidStorage?.getItem) {
        const nativeVal = window.AndroidStorage.getItem(key);
        if (nativeVal !== null && nativeVal !== undefined && nativeVal !== '') {
          // Keep localStorage in sync with native storage
          try {
            localStorage.setItem(key, nativeVal);
          } catch (_) {}
          return nativeVal;
        }
      }
    } catch (err) {
      console.warn('[Storage] AndroidStorage.getItem error:', err);
    }

    // 2. Try window.localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const localVal = window.localStorage.getItem(key);
        if (localVal !== null && localVal !== undefined && localVal !== '') {
          return localVal;
        }
      }
    } catch (err) {
      console.warn('[Storage] localStorage.getItem error:', err);
    }

    // 3. Fallback to in-memory cache
    return memoryCache.get(key) ?? null;
  },

  setItem(key: string, value: string): void {
    // Always update memory cache immediately
    memoryCache.set(key, value);

    // 1. Save to window.localStorage
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn('[Storage] localStorage.setItem error:', err);
    }

    // 2. Save to Android Native SharedPreferences bridge (permanent on-device storage)
    try {
      if (typeof window !== 'undefined' && window.AndroidStorage?.setItem) {
        window.AndroidStorage.setItem(key, value);
      }
    } catch (err) {
      console.warn('[Storage] AndroidStorage.setItem error:', err);
    }
  },

  removeItem(key: string): void {
    memoryCache.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch (_) {}
    try {
      if (typeof window !== 'undefined' && window.AndroidStorage?.removeItem) {
        window.AndroidStorage.removeItem(key);
      }
    } catch (_) {}
  },
};

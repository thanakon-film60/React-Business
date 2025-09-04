// package/src/components/LoadingContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
  ReactNode,
} from "react";

type LoadingCtx = {
  loading: boolean;
  setLoading: (v: boolean) => void;
  withLoading<T>(p: Promise<T>): Promise<T>;
};

const LoadingContext = createContext<LoadingCtx | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  const withLoading = useCallback(async <T,>(p: Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      return await p;
    } finally {
      setLoading(false);
    }
  }, []);

  const value = useMemo(
    () => ({ loading, setLoading, withLoading }),
    [loading, withLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within <LoadingProvider>");
  return ctx;
}

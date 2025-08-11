"use client";
import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";

type Ctx = {
  isLoading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
  withLoading: <T>(promise: Promise<T>) => Promise<T>;
};

const LoadingContext = createContext<Ctx | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const counterRef = useRef(0); // กันเคสเรียกซ้อนหลายครั้ง

  const showLoading = () => {
    counterRef.current += 1;
    if (!isLoading) setIsLoading(true);
  };

  const hideLoading = () => {
    counterRef.current = Math.max(0, counterRef.current - 1);
    if (counterRef.current === 0) setIsLoading(false);
  };

  const withLoading = async <T,>(promise: Promise<T>) => {
    showLoading();
    try {
      return await promise;
    } finally {
      hideLoading();
    }
  };

  const value = useMemo(
    () => ({ isLoading, showLoading, hideLoading, withLoading }),
    [isLoading]
  );

  return (
    <LoadingContext.Provider value={value}>{children}</LoadingContext.Provider>
  );
}

export function useLoading() {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
  return ctx;
}

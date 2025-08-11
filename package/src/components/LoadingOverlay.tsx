"use client";
import { useLoading } from "@/components/LoadingContext";

export default function LoadingOverlay() {
  const { isLoading } = useLoading();
  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 transition-opacity
        ${
          isLoading
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}>
      <div className="rounded-xl bg-white px-5 py-4 shadow">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-black/20 border-t-black mx-auto" />
        <div className="mt-2 text-sm">Loading…</div>
      </div>
    </div>
  );
}

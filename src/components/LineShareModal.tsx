"use client";
import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  ExternalLink,
  Smartphone,
  Monitor,
  Loader2,
  Play,
} from "lucide-react";

interface LineShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    id: number;
    name: string;
    type: "image" | "video" | "clip";
    thumbnail: string;
    description?: string;
    duration?: string;
  };
}

interface ShareLinks {
  shareUrl: string;
  webShareUrl: string;
  embedUrl: string;
}

const LineShareModal: React.FC<LineShareModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLinks | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate LINE share links
  const generateShareLinks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/line-share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mediaId: file.id,
          mediaType: file.type,
          title: file.name,
          description: file.description,
          thumbnailUrl: file.thumbnail,
          mediaUrl: file.thumbnail, // Will be replaced with actual URL
        }),
      });

      const result = await response.json();

      if (result.success) {
        setShareLinks({
          shareUrl: result.shareUrl,
          webShareUrl: result.webShareUrl,
          embedUrl: result.embedUrl,
        });
      } else {
        throw new Error(result.error || "Failed to generate share links");
      }
    } catch (err) {
      console.error("Error generating share links:", err);
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Open LINE share (same for both mobile and desktop)
  const openLineShare = () => {
    if (shareLinks?.webShareUrl) {
      window.open(shareLinks.webShareUrl, "_blank", "width=600,height=600");
    }
  };

  // Open LINE app directly (for mobile - using web share URL)
  const openLineApp = () => {
    if (shareLinks?.webShareUrl) {
      // On mobile, open the same web share URL
      // LINE will handle opening in app if installed
      window.location.href = shareLinks.webShareUrl;
    }
  };

  // Generate on open
  React.useEffect(() => {
    if (isOpen && !shareLinks) {
      generateShareLinks();
    }
  }, [isOpen]);

  // Reset on close
  React.useEffect(() => {
    if (!isOpen) {
      setShareLinks(null);
      setError(null);
      setCopied(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl shadow-2xl border border-green-500/30 overflow-hidden">
        {/* LINE Brand Header */}
        <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* LINE Logo */}
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shadow-lg">
                <svg
                  className="w-8 h-8 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.65 1.34 5.02 3.43 6.61.12.09.21.24.21.4l-.2 1.49c-.06.45.4.8.81.6l1.71-.85c.16-.08.34-.1.51-.06.89.21 1.83.32 2.8.32 5.52 0 10-3.82 10-8.5S17.52 2 12 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">แชร์ไปยัง LINE</h2>
                <p className="text-sm text-white/80">
                  ส่งวิดีโอให้เพื่อนดูได้ทันที
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* File Preview */}
          <div className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
            <div className="relative w-24 h-16 rounded-lg overflow-hidden bg-black/30 shrink-0">
              <img
                src={file.thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
              {(file.type === "video" || file.type === "clip") && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Play className="w-6 h-6 text-white" />
                </div>
              )}
              {file.duration && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white">
                  {file.duration}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white truncate">{file.name}</h3>
              <p className="text-sm text-purple-200/60 capitalize">
                {file.type === "clip"
                  ? "คลิปสั้น"
                  : file.type === "video"
                  ? "วิดีโอ"
                  : "รูปภาพ"}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-3" />
              <p className="text-purple-200/60">กำลังสร้างลิงก์แชร์...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
              <p>{error}</p>
              <button
                onClick={generateShareLinks}
                className="mt-2 text-sm text-red-200 underline hover:text-white"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Share Links */}
          {shareLinks && !isLoading && (
            <div className="space-y-4">
              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {/* Mobile Share */}
                <button
                  onClick={openLineApp}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-2xl transition-all group"
                >
                  <div className="p-3 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                    <Smartphone className="w-6 h-6 text-green-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    เปิดแอพ LINE
                  </span>
                  <span className="text-xs text-purple-200/50">
                    สำหรับมือถือ
                  </span>
                </button>

                {/* Web Share */}
                <button
                  onClick={openLineShare}
                  className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/30 rounded-2xl transition-all group"
                >
                  <div className="p-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                    <Monitor className="w-6 h-6 text-blue-400" />
                  </div>
                  <span className="text-sm font-medium text-white">
                    เปิดใน Browser
                  </span>
                  <span className="text-xs text-purple-200/50">
                    สำหรับคอมพิวเตอร์
                  </span>
                </button>
              </div>

              {/* Embed URL (for copying) */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-purple-200">
                  ลิงก์สำหรับแชร์
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={shareLinks.embedUrl}
                    readOnly
                    className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm"
                  />
                  <button
                    onClick={() =>
                      copyToClipboard(shareLinks.embedUrl, "embed")
                    }
                    className={`px-4 py-2.5 rounded-xl transition-all ${
                      copied === "embed"
                        ? "bg-green-500 text-white"
                        : "bg-white/10 hover:bg-white/20 text-purple-300"
                    }`}
                  >
                    {copied === "embed" ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-200/80 flex items-start gap-2">
                  <span className="shrink-0">💡</span>
                  <span>
                    เมื่อแชร์ลิงก์นี้ไปยัง LINE ผู้รับสามารถดู
                    {file.type === "image" ? "รูปภาพ" : "วิดีโอ"}
                    ได้ทันทีในแอพโดยไม่ต้องออกจาก LINE
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="flex items-center justify-center gap-6 text-xs text-purple-200/40">
            <span>✓ รองรับ iOS & Android</span>
            <span>✓ เล่นในแอพได้</span>
            <span>✓ แชร์ได้ไม่จำกัด</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineShareModal;

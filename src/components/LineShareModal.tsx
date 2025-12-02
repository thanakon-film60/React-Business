"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Video,
  Link,
  MessageCircle,
  Bot,
} from "lucide-react";
import liff from "@line/liff";

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
  videoUrl: string;
  thumbnailUrl: string;
}

// LIFF App ID - Created in LINE Developers Console
const LIFF_ID = process.env.NEXT_PUBLIC_LIFF_ID || "2008600295-3nnyKWlv";

// LINE Bot ID for native video sharing
// Get this from LINE Developers Console > Your Channel > Messaging API > Bot basic ID
const LINE_BOT_ID = process.env.NEXT_PUBLIC_LINE_BOT_ID || "@753uuxhp";

const LineShareModal: React.FC<LineShareModalProps> = ({
  isOpen,
  onClose,
  file,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiffReady, setIsLiffReady] = useState(false);
  const [isLiffLoggedIn, setIsLiffLoggedIn] = useState(false);
  const [shareLinks, setShareLinks] = useState<ShareLinks | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareMode, setShareMode] = useState<"native" | "link">("native");
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  // Initialize LIFF
  const initLiff = useCallback(async () => {
    try {
      console.log("🔄 Initializing LIFF...");
      await liff.init({ liffId: LIFF_ID });
      setIsLiffReady(true);
      setIsLiffLoggedIn(liff.isLoggedIn());
      console.log("✅ LIFF initialized, logged in:", liff.isLoggedIn());
    } catch (err) {
      console.error("❌ LIFF initialization failed:", err);
      // Fall back to link sharing mode
      setShareMode("link");
    }
  }, []);

  // Generate share links by fetching from API
  const generateShareLinks = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch video data from API to get proper URLs
      const response = await fetch(`/api/line-share/video/${file.id}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to get video info");
      }

      const videoData = result.data;
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

      // Use URLs from API response
      // For LINE native video, we need direct MP4 URL
      const videoUrl =
        videoData.url || `${baseUrl}/api/video-stream/${file.id}`;
      const thumbnailUrl =
        videoData.thumbnail || `${baseUrl}/api/video-thumbnail/${file.id}`;
      const embedUrl = videoData.pageUrl || `${baseUrl}/share/video/${file.id}`;

      // LINE web share URL (fallback)
      const webShareUrl = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
        embedUrl
      )}`;

      setShareLinks({
        shareUrl: embedUrl,
        webShareUrl: webShareUrl,
        embedUrl: embedUrl,
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
      });
    } catch (err) {
      console.error("Error generating share links:", err);
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setIsLoading(false);
    }
  };

  // Share as native video message using LIFF
  const shareAsNativeVideo = async () => {
    if (!isLiffReady || !shareLinks) {
      setError("LIFF ยังไม่พร้อม กรุณาลองใหม่");
      return;
    }

    setShareStatus("กำลังเปิด LINE...");

    try {
      // Check if shareTargetPicker is available
      if (!liff.isApiAvailable("shareTargetPicker")) {
        console.log(
          "shareTargetPicker not available, falling back to link share"
        );
        setShareMode("link");
        openLineShare();
        return;
      }

      // For video type, send video message
      if (file.type === "video" || file.type === "clip") {
        const result = await liff.shareTargetPicker([
          {
            type: "video",
            originalContentUrl: shareLinks.videoUrl,
            previewImageUrl: shareLinks.thumbnailUrl,
          },
        ]);

        if (result) {
          setShareStatus("✅ ส่งวิดีโอสำเร็จ!");
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setShareStatus("ยกเลิกการแชร์");
        }
      } else {
        // For images
        const result = await liff.shareTargetPicker([
          {
            type: "image",
            originalContentUrl: shareLinks.thumbnailUrl,
            previewImageUrl: shareLinks.thumbnailUrl,
          },
        ]);

        if (result) {
          setShareStatus("✅ ส่งรูปภาพสำเร็จ!");
          setTimeout(() => {
            onClose();
          }, 1500);
        } else {
          setShareStatus("ยกเลิกการแชร์");
        }
      }
    } catch (err) {
      console.error("Error sharing via LIFF:", err);
      setError("ไม่สามารถแชร์ได้ กรุณาลองใช้วิธีอื่น");
      setShareMode("link");
    } finally {
      setShareStatus(null);
    }
  };

  // Share with Flex Message (alternative method)
  const shareAsFlexMessage = async () => {
    if (!isLiffReady || !shareLinks) {
      setError("LIFF ยังไม่พร้อม กรุณาลองใหม่");
      return;
    }

    setShareStatus("กำลังเปิด LINE...");

    try {
      if (!liff.isApiAvailable("shareTargetPicker")) {
        setShareMode("link");
        openLineShare();
        return;
      }

      // Create a Flex Message with video preview
      // Using type assertion for LIFF SDK compatibility
      const flexMessage = {
        type: "flex",
        altText: `🎬 ${file.name}`,
        contents: {
          type: "bubble",
          hero: {
            type: "image",
            url: shareLinks.thumbnailUrl,
            size: "full",
            aspectRatio: "16:9",
            aspectMode: "cover",
            action: {
              type: "uri",
              uri: shareLinks.embedUrl,
            },
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: file.name,
                weight: "bold",
                size: "lg",
                wrap: true,
              },
              {
                type: "box",
                layout: "horizontal",
                contents: [
                  {
                    type: "text",
                    text: file.type === "clip" ? "🎬 คลิป" : "📹 วิดีโอ",
                    size: "sm",
                    color: "#888888",
                  },
                  ...(file.duration
                    ? [
                        {
                          type: "text",
                          text: `⏱️ ${file.duration}`,
                          size: "sm",
                          color: "#888888",
                          align: "end",
                        },
                      ]
                    : []),
                ],
              },
            ],
          },
          footer: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "button",
                style: "primary",
                color: "#00B900",
                action: {
                  type: "uri",
                  label: "▶️ ดูวิดีโอ",
                  uri: shareLinks.embedUrl,
                },
              },
            ],
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any;

      const result = await liff.shareTargetPicker([flexMessage]);

      if (result) {
        setShareStatus("✅ ส่งสำเร็จ!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setShareStatus("ยกเลิกการแชร์");
      }
    } catch (err) {
      console.error("Error sharing Flex Message:", err);
      // Try simple text message as last resort
      try {
        await liff.shareTargetPicker([
          {
            type: "text",
            text: `🎬 ${file.name}\n\n▶️ ดูวิดีโอ: ${shareLinks.embedUrl}`,
          },
        ]);
        setShareStatus("✅ ส่งสำเร็จ!");
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch {
        setError("ไม่สามารถแชร์ได้ กรุณาลองใช้วิธีอื่น");
        setShareMode("link");
      }
    } finally {
      setShareStatus(null);
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

  // Open LINE share via web (fallback)
  const openLineShare = () => {
    if (shareLinks?.webShareUrl) {
      window.open(shareLinks.webShareUrl, "_blank", "width=600,height=600");
    }
  };

  // Share via LINE Bot (Native Video Playback!)
  const shareViaBot = () => {
    if (!shareLinks) return;

    // Create message to send to bot
    const videoLink = shareLinks.embedUrl;

    // Open LINE chat with Bot and pre-fill the video link
    // Using LINE's URL scheme to open chat with the bot
    const botChatUrl = `https://line.me/R/oaMessage/${LINE_BOT_ID}/?${encodeURIComponent(
      videoLink
    )}`;

    window.open(botChatUrl, "_blank");

    setShareStatus("✅ เปิด LINE แล้ว! ส่งข้อความเพื่อรับวิดีโอ");
    setTimeout(() => {
      setShareStatus(null);
    }, 3000);
  };

  // Initialize on open
  useEffect(() => {
    if (isOpen) {
      initLiff();
      generateShareLinks();
    }
  }, [isOpen, initLiff]);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      setShareLinks(null);
      setError(null);
      setCopied(null);
      setShareStatus(null);
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
                  {shareMode === "native"
                    ? "ส่งวิดีโอแบบ Native"
                    : "แชร์ลิงก์วิดีโอ"}
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

          {/* Share Status */}
          {shareStatus && (
            <div className="flex items-center justify-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
              <Loader2 className="w-5 h-5 text-green-400 animate-spin" />
              <p className="text-green-200">{shareStatus}</p>
            </div>
          )}

          {/* Loading State */}
          {isLoading && !shareStatus && (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="w-10 h-10 text-green-400 animate-spin mb-3" />
              <p className="text-purple-200/60">กำลังเตรียมข้อมูล...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 text-center">
              <p>{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  generateShareLinks();
                }}
                className="mt-2 text-sm text-red-200 underline hover:text-white"
              >
                ลองใหม่
              </button>
            </div>
          )}

          {/* Share Options */}
          {shareLinks && !isLoading && !shareStatus && (
            <div className="space-y-4">
              {/* Bot Share - Best Option for Native Video! */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-purple-200">
                  🤖 ส่งผ่าน Bot (แนะนำ!)
                </p>
                <button
                  onClick={shareViaBot}
                  className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white rounded-2xl transition-all shadow-lg shadow-green-500/30"
                >
                  <div className="p-3 rounded-full bg-white/20">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div className="flex-1 text-left">
                    <span className="block font-bold">
                      ส่งผ่าน Bot → เล่นวิดีโอใน LINE
                    </span>
                    <span className="text-sm text-white/80">
                      วิดีโอจะเล่นได้โดยตรง ไม่ต้องเปิด browser!
                    </span>
                  </div>
                  <ExternalLink className="w-5 h-5" />
                </button>
                <p className="text-xs text-center text-purple-200/50">
                  💡 Bot จะส่งวิดีโอกลับมาให้ดูได้เลยใน LINE
                </p>
              </div>

              {/* Native Video Share (Main Option) */}
              {shareMode === "native" && isLiffReady && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-purple-200">
                    📹 ส่งเป็นวิดีโอใน LINE
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {/* Send as Video */}
                    <button
                      onClick={shareAsNativeVideo}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-500/30 rounded-2xl transition-all group"
                    >
                      <div className="p-3 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                        <Video className="w-6 h-6 text-green-400" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        ส่งวิดีโอ
                      </span>
                      <span className="text-xs text-purple-200/50">
                        เล่นได้ทันที
                      </span>
                    </button>

                    {/* Send as Flex Message */}
                    <button
                      onClick={shareAsFlexMessage}
                      className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 hover:from-blue-500/30 hover:to-indigo-500/30 border border-blue-500/30 rounded-2xl transition-all group"
                    >
                      <div className="p-3 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                        <MessageCircle className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className="text-sm font-medium text-white">
                        ส่งการ์ด
                      </span>
                      <span className="text-xs text-purple-200/50">
                        พร้อมปุ่มดู
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {/* Link Share (Fallback or alternative) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-purple-200">
                    🔗 แชร์ลิงก์
                  </p>
                  {shareMode === "native" && (
                    <button
                      onClick={() => setShareMode("link")}
                      className="text-xs text-purple-300 hover:text-white underline"
                    >
                      ใช้วิธีนี้แทน
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Mobile Share */}
                  <button
                    onClick={openLineShare}
                    className="flex flex-col items-center gap-2 p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all group"
                  >
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Smartphone className="w-6 h-6 text-purple-300" />
                    </div>
                    <span className="text-sm font-medium text-white">
                      เปิด LINE
                    </span>
                    <span className="text-xs text-purple-200/50">มือถือ</span>
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() =>
                      copyToClipboard(shareLinks.embedUrl, "embed")
                    }
                    className={`flex flex-col items-center gap-2 p-4 border rounded-2xl transition-all group ${
                      copied === "embed"
                        ? "bg-green-500/20 border-green-500/30"
                        : "bg-white/5 hover:bg-white/10 border-white/10"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-full transition-colors ${
                        copied === "embed"
                          ? "bg-green-500/20"
                          : "bg-white/5 group-hover:bg-white/10"
                      }`}
                    >
                      {copied === "embed" ? (
                        <Check className="w-6 h-6 text-green-400" />
                      ) : (
                        <Copy className="w-6 h-6 text-purple-300" />
                      )}
                    </div>
                    <span className="text-sm font-medium text-white">
                      {copied === "embed" ? "คัดลอกแล้ว!" : "คัดลอกลิงก์"}
                    </span>
                    <span className="text-xs text-purple-200/50">
                      แปะที่ไหนก็ได้
                    </span>
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <p className="text-sm text-green-200/80 flex items-start gap-2">
                  <span className="shrink-0">💡</span>
                  <span>
                    {shareMode === "native"
                      ? "ส่งเป็นวิดีโอจะเล่นได้ทันทีใน LINE โดยไม่ต้องเปิด browser"
                      : "แชร์ลิงก์จะแสดงเป็น preview card ใน LINE"}
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
            <span>
              ✓ {shareMode === "native" ? "เล่นใน LINE" : "Preview Card"}
            </span>
            <span>✓ แชร์ได้ไม่จำกัด</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineShareModal;

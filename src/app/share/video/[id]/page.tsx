"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  RotateCcw,
  Share2,
  Download,
  Heart,
  Eye,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";

interface VideoData {
  id: number;
  name: string;
  description: string;
  type: "image" | "video" | "clip";
  url: string;
  streamUrl: string;
  pageUrl: string;
  thumbnail: string;
  mimeType: string;
  size: string;
  duration: string;
  durationSeconds: number;
  width: number;
  height: number;
  category: string;
  views: number;
}

export default function VideoSharePage() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id as string;

  const [video, setVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Video player state
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/line-share/video/${videoId}`);
        const result = await response.json();

        if (result.success) {
          setVideo(result.data);
        } else {
          setError(result.error || "Video not found");
        }
      } catch (err) {
        setError("Failed to load video");
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  // Video player controls
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleMouseMove = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (isPlaying) {
          setShowControls(false);
        }
      }, 3000);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timeout);
    };
  }, [isPlaying]);

  // Share via LINE - use the proper LINE share URL format
  const shareToLine = () => {
    const shareText = encodeURIComponent(`🎬 ${video?.name}\n\n▶️ ดูวิดีโอ:`);
    const shareUrl = encodeURIComponent(window.location.href);

    // Use LINE's social plugin URL for proper preview
    const lineShareUrl = `https://social-plugins.line.me/lineit/share?url=${shareUrl}&text=${shareText}`;

    // Open in new window for desktop, or redirect for mobile
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = `line://msg/text/${shareText}%0A${shareUrl}`;
    } else {
      window.open(lineShareUrl, "_blank", "width=600,height=600");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-400 animate-spin mx-auto mb-4" />
          <p className="text-white/60">กำลังโหลดวิดีโอ...</p>
        </div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
            <Play className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">ไม่พบวิดีโอ</h1>
          <p className="text-purple-200/60 mb-6">
            {error || "วิดีโอนี้อาจถูกลบหรือไม่พร้อมใช้งาน"}
          </p>
          <button
            onClick={() => router.push("/all-files-gallery")}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl"
          >
            ไปยังแกลเลอรี่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Video Player Container */}
      <div className="relative w-full h-screen max-h-[100svh]">
        {/* Video Element */}
        {video.type === "image" ? (
          <img
            src={video.url}
            alt={video.name}
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            src={video.streamUrl || video.url}
            poster={video.thumbnail}
            className="w-full h-full object-contain"
            playsInline
            webkit-playsinline="true"
            preload="metadata"
            crossOrigin="anonymous"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          >
            <source
              src={video.streamUrl || video.url}
              type={video.mimeType || "video/mp4"}
            />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Play Button Overlay (when paused) */}
        {!isPlaying && video.type !== "image" && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
              <Play className="w-16 h-16 text-white" fill="white" />
            </div>
          </div>
        )}

        {/* Controls Overlay */}
        {video.type !== "image" && (
          <div
            className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${
              showControls ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Progress Bar */}
            <div className="px-4 pt-16">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-400"
                style={{
                  background: `linear-gradient(to right, #4ade80 ${
                    (currentTime / duration) * 100
                  }%, rgba(255,255,255,0.3) ${
                    (currentTime / duration) * 100
                  }%)`,
                }}
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-4">
                {/* Play/Pause */}
                <button
                  onClick={togglePlay}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 text-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white" />
                  )}
                </button>

                {/* Restart */}
                <button
                  onClick={restartVideo}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-5 h-5 text-white" />
                </button>

                {/* Mute */}
                <button
                  onClick={toggleMute}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                  ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                  )}
                </button>

                {/* Time */}
                <span className="text-sm text-white/80">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Fullscreen */}
                <button
                  onClick={handleFullscreen}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <Maximize2 className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <div
          className={`absolute inset-x-0 top-0 bg-gradient-to-b from-black/90 via-black/50 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <div className="flex items-center gap-3">
              {/* Share to LINE */}
              <button
                onClick={shareToLine}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white font-medium rounded-full transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">แชร์ LINE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info (below player on mobile) */}
      <div className="bg-gradient-to-br from-slate-900 to-purple-900 p-6">
        <h1 className="text-xl font-bold text-white mb-2">{video.name}</h1>

        {video.description && (
          <p className="text-purple-200/70 mb-4">{video.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-sm text-purple-200/60">
          <span className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            {video.views.toLocaleString()} views
          </span>
          {video.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {video.duration}
            </span>
          )}
          <span className="px-2 py-1 bg-purple-500/20 rounded-full text-purple-300">
            {video.category}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={shareToLine}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-xl shadow-lg shadow-green-500/30"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.65 1.34 5.02 3.43 6.61.12.09.21.24.21.4l-.2 1.49c-.06.45.4.8.81.6l1.71-.85c.16-.08.34-.1.51-.06.89.21 1.83.32 2.8.32 5.52 0 10-3.82 10-8.5S17.52 2 12 2z" />
            </svg>
            แชร์ไปยัง LINE
          </button>
          <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
            <Heart className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors">
            <Download className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { Play, Loader2 } from "lucide-react";

/**
 * Video Embed Page for LINE Inline Playback
 *
 * This is a minimal video player designed to be embedded in an iframe
 * when LINE or other platforms load the twitter:player URL.
 *
 * Features:
 * - Minimal UI for inline playback
 * - Auto-plays when visible (muted for autoplay policy)
 * - Touch-friendly controls
 * - Fullscreen support
 */

interface VideoData {
  id: number;
  name: string;
  streamUrl: string;
  thumbnail: string;
  mimeType: string;
}

export default function VideoEmbedPage() {
  const params = useParams();
  const videoId = params.id as string;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [video, setVideo] = useState<VideoData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await fetch(`/api/line-share/video/${videoId}`);
        const result = await response.json();

        if (result.success) {
          setVideo({
            id: result.data.id,
            name: result.data.name,
            streamUrl: result.data.streamUrl,
            thumbnail: result.data.thumbnail,
            mimeType: result.data.mimeType || "video/mp4",
          });
        }
      } catch (err) {
        console.error("Failed to load video:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if (videoId) {
      fetchVideo();
    }
  }, [videoId]);

  // Handle play/pause
  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  // Video event handlers
  const handleVideoPlay = () => {
    setIsPlaying(true);
    setShowPlayButton(false);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    setShowPlayButton(true);
  };

  if (isLoading) {
    return (
      <div className="w-full h-full min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-white animate-spin" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="w-full h-full min-h-screen bg-black flex items-center justify-center text-white">
        Video not found
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-screen bg-black relative overflow-hidden">
      {/* Video Element */}
      <video
        ref={videoRef}
        src={video.streamUrl}
        poster={video.thumbnail}
        className="w-full h-full object-contain"
        playsInline
        webkit-playsinline="true"
        preload="auto"
        controls
        controlsList="nodownload"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        onEnded={handleVideoEnded}
      >
        <source src={video.streamUrl} type={video.mimeType} />
        Your browser does not support the video tag.
      </video>

      {/* Play Button Overlay (before first play) */}
      {showPlayButton && !isPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
          onClick={handlePlay}
        >
          {/* Thumbnail as background */}
          {video.thumbnail && (
            <img
              src={video.thumbnail}
              alt={video.name}
              className="absolute inset-0 w-full h-full object-contain opacity-50"
            />
          )}

          {/* Play button */}
          <div className="relative z-10 p-5 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-all hover:scale-110">
            <Play className="w-12 h-12 text-white" fill="white" />
          </div>

          {/* Video title */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white text-sm font-medium truncate">
              {video.name}
            </p>
          </div>
        </div>
      )}

      {/* Minimal styles */}
      <style jsx global>{`
        html,
        body {
          margin: 0;
          padding: 0;
          background: #000;
          overflow: hidden;
        }

        video::-webkit-media-controls-panel {
          background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
        }

        video::-webkit-media-controls-play-button,
        video::-webkit-media-controls-mute-button,
        video::-webkit-media-controls-fullscreen-button {
          filter: invert(1);
        }
      `}</style>
    </div>
  );
}

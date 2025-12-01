"use client";
import React, { useState, useRef, useCallback } from "react";
import {
  X,
  Upload,
  FileVideo,
  Image as ImageIcon,
  Film,
  CheckCircle,
  AlertCircle,
  Loader2,
  Plus,
} from "lucide-react";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadComplete: (file: UploadedFile) => void;
}

interface UploadedFile {
  id: number;
  name: string;
  type: "image" | "video" | "clip";
  size: string;
  mimeType: string;
}

interface UploadProgress {
  status:
    | "idle"
    | "preparing"
    | "uploading"
    | "processing"
    | "complete"
    | "error";
  progress: number;
  message: string;
}

const VideoUploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onUploadComplete,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    status: "idle",
    progress: 0,
    message: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    tags: "",
    isClip: false,
  });
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [thumbnailBlob, setThumbnailBlob] = useState<Blob | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Supported video formats optimized for LINE
  const SUPPORTED_FORMATS = {
    video: ["video/mp4", "video/quicktime", "video/webm", "video/x-m4v"],
    image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
  };

  const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  // Categories for organization
  const categories = [
    "Before/After",
    "Surgery Videos",
    "Promo Clips",
    "Consultations",
    "Training",
    "Social Media",
    "Testimonials",
    "Products",
    "Events",
    "Marketing",
  ];

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate file type
      const isVideo = SUPPORTED_FORMATS.video.includes(file.type);
      const isImage = SUPPORTED_FORMATS.image.includes(file.type);

      if (!isVideo && !isImage) {
        setUploadProgress({
          status: "error",
          progress: 0,
          message: "ไฟล์ไม่รองรับ กรุณาเลือกไฟล์ MP4, MOV, WebM หรือรูปภาพ",
        });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setUploadProgress({
          status: "error",
          progress: 0,
          message: "ไฟล์ใหญ่เกินไป ขนาดสูงสุด 50MB",
        });
        return;
      }

      setSelectedFile(file);
      setFormData((prev) => ({
        ...prev,
        name: file.name.replace(/\.[^/.]+$/, ""),
      }));

      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      // If video, get duration and generate thumbnail
      if (isVideo) {
        const video = document.createElement("video");
        video.src = objectUrl;
        video.load();

        video.onloadedmetadata = () => {
          setVideoDuration(video.duration);
          // Auto-detect clip (under 60 seconds)
          setFormData((prev) => ({
            ...prev,
            isClip: video.duration <= 60,
          }));

          // Generate thumbnail at 1 second
          video.currentTime = Math.min(1, video.duration / 2);
        };

        video.onseeked = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  setThumbnailBlob(blob);
                }
              },
              "image/jpeg",
              0.8
            );
          }
        };
      }

      setUploadProgress({ status: "idle", progress: 0, message: "" });
    },
    []
  );

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploadProgress({
        status: "preparing",
        progress: 10,
        message: "กำลังเตรียมไฟล์...",
      });

      const formDataToSend = new FormData();
      formDataToSend.append("file", selectedFile);

      if (thumbnailBlob) {
        formDataToSend.append("thumbnail", thumbnailBlob, "thumbnail.jpg");
      }

      formDataToSend.append("name", formData.name || selectedFile.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("tags", formData.tags);

      // Get user info from localStorage
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        formDataToSend.append("uploadedBy", user.id?.toString() || "");
        formDataToSend.append(
          "uploadedByName",
          user.name || user.username || ""
        );
      }

      setUploadProgress({
        status: "uploading",
        progress: 30,
        message: "กำลังอัพโหลด...",
      });

      // Simulate upload progress (real XHR would have progress events)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev.progress < 80) {
            return { ...prev, progress: prev.progress + 10 };
          }
          return prev;
        });
      }, 500);

      const response = await fetch("/api/media-files/upload", {
        method: "POST",
        body: formDataToSend,
      });

      clearInterval(progressInterval);

      const result = await response.json();

      if (result.success) {
        setUploadProgress({
          status: "complete",
          progress: 100,
          message: "อัพโหลดสำเร็จ!",
        });

        // Call callback after short delay
        setTimeout(() => {
          onUploadComplete({
            id: result.data.id,
            name: result.data.name,
            type: result.data.type,
            size: result.data.size,
            mimeType: result.data.mimeType,
          });
          handleClose();
        }, 1500);
      } else {
        throw new Error(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadProgress({
        status: "error",
        progress: 0,
        message:
          error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการอัพโหลด",
      });
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setThumbnailBlob(null);
    setVideoDuration(0);
    setFormData({
      name: "",
      description: "",
      category: "",
      tags: "",
      isClip: false,
    });
    setUploadProgress({ status: "idle", progress: 0, message: "" });
    onClose();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && fileInputRef.current) {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      fileInputRef.current.files = dataTransfer.files;
      fileInputRef.current.dispatchEvent(
        new Event("change", { bubbles: true })
      );
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 rounded-3xl shadow-2xl border border-purple-500/30 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">อัพโหลดไฟล์</h2>
              <p className="text-sm text-purple-200/60">
                รองรับ MP4, MOV, WebM และรูปภาพ (สูงสุด 50MB)
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Upload Area */}
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-purple-500/40 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-500/5 transition-all group"
            >
              <div className="flex justify-center gap-4 mb-4">
                <div className="p-4 rounded-full bg-blue-500/20 group-hover:bg-blue-500/30 transition-colors">
                  <FileVideo className="w-8 h-8 text-blue-400" />
                </div>
                <div className="p-4 rounded-full bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                  <Film className="w-8 h-8 text-pink-400" />
                </div>
                <div className="p-4 rounded-full bg-green-500/20 group-hover:bg-green-500/30 transition-colors">
                  <ImageIcon className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <p className="text-lg font-medium text-white mb-2">
                ลากไฟล์มาวางที่นี่ หรือคลิกเพื่อเลือกไฟล์
              </p>
              <p className="text-sm text-purple-200/60">
                รองรับวิดีโอ MP4, MOV, WebM และรูปภาพ JPG, PNG, GIF
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/x-m4v,image/jpeg,image/png,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview Section */}
              <div className="flex gap-6">
                {/* File Preview */}
                <div className="w-48 shrink-0">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black/50 shadow-lg">
                    {selectedFile.type.startsWith("video/") ? (
                      <video
                        ref={videoRef}
                        src={preview || undefined}
                        className="w-full h-full object-cover"
                        muted
                        playsInline
                        onMouseEnter={(e) => e.currentTarget.play()}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                    ) : (
                      <img
                        src={preview || undefined}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    )}
                    {/* Type Badge */}
                    <div
                      className={`absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        formData.isClip
                          ? "bg-pink-500 text-white"
                          : selectedFile.type.startsWith("video/")
                          ? "bg-purple-500 text-white"
                          : "bg-green-500 text-white"
                      }`}
                    >
                      {formData.isClip ? (
                        <Film className="w-3 h-3" />
                      ) : selectedFile.type.startsWith("video/") ? (
                        <FileVideo className="w-3 h-3" />
                      ) : (
                        <ImageIcon className="w-3 h-3" />
                      )}
                      <span>
                        {formData.isClip
                          ? "CLIP"
                          : selectedFile.type.startsWith("video/")
                          ? "VIDEO"
                          : "IMAGE"}
                      </span>
                    </div>
                    {/* Duration */}
                    {videoDuration > 0 && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                        {formatDuration(videoDuration)}
                      </div>
                    )}
                  </div>
                  <div className="mt-2 text-center text-sm text-purple-200/60">
                    {formatFileSize(selectedFile.size)}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      ชื่อไฟล์
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="ตั้งชื่อไฟล์..."
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      หมวดหมู่
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 cursor-pointer"
                    >
                      <option value="" className="bg-slate-800">
                        เลือกหมวดหมู่
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="bg-slate-800">
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      คำอธิบาย
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={2}
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="เพิ่มคำอธิบาย..."
                    />
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-purple-200 mb-1">
                      แท็ก (คั่นด้วยเครื่องหมาย ,)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) =>
                        setFormData({ ...formData, tags: e.target.value })
                      }
                      className="w-full px-4 py-2.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/40 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="เช่น: Before/After, Face, Surgery"
                    />
                  </div>

                  {/* Clip Toggle for videos */}
                  {selectedFile.type.startsWith("video/") && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          setFormData({ ...formData, isClip: !formData.isClip })
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          formData.isClip ? "bg-pink-500" : "bg-white/20"
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            formData.isClip ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-purple-200">
                        บันทึกเป็นคลิปสั้น (สำหรับ Social Media)
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Progress */}
              {uploadProgress.status !== "idle" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className={`flex items-center gap-2 ${
                        uploadProgress.status === "error"
                          ? "text-red-400"
                          : uploadProgress.status === "complete"
                          ? "text-green-400"
                          : "text-purple-200"
                      }`}
                    >
                      {uploadProgress.status === "error" && (
                        <AlertCircle className="w-4 h-4" />
                      )}
                      {uploadProgress.status === "complete" && (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      {(uploadProgress.status === "uploading" ||
                        uploadProgress.status === "preparing" ||
                        uploadProgress.status === "processing") && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {uploadProgress.message}
                    </span>
                    <span className="text-purple-200/60">
                      {uploadProgress.progress}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        uploadProgress.status === "error"
                          ? "bg-red-500"
                          : uploadProgress.status === "complete"
                          ? "bg-green-500"
                          : "bg-gradient-to-r from-purple-500 to-pink-500"
                      }`}
                      style={{ width: `${uploadProgress.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-purple-500/20">
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreview(null);
                    setUploadProgress({
                      status: "idle",
                      progress: 0,
                      message: "",
                    });
                  }}
                  className="px-4 py-2 text-purple-300 hover:text-white transition-colors"
                >
                  เลือกไฟล์ใหม่
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                    disabled={uploadProgress.status === "uploading"}
                  >
                    ยกเลิก
                  </button>
                  <button
                    onClick={handleUpload}
                    disabled={
                      !selectedFile ||
                      uploadProgress.status === "uploading" ||
                      uploadProgress.status === "complete"
                    }
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white font-medium rounded-xl transition-all shadow-lg shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {uploadProgress.status === "uploading" ||
                    uploadProgress.status === "preparing" ||
                    uploadProgress.status === "processing" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        กำลังอัพโหลด...
                      </>
                    ) : uploadProgress.status === "complete" ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        สำเร็จ!
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        อัพโหลด
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {uploadProgress.status === "error" && !selectedFile && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{uploadProgress.message}</span>
            </div>
          )}
        </div>

        {/* LINE Share Info */}
        <div className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-t border-green-500/20">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <svg
                className="w-5 h-5 text-green-400"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 5.82 2 10.5c0 2.65 1.34 5.02 3.43 6.61.12.09.21.24.21.4l-.2 1.49c-.06.45.4.8.81.6l1.71-.85c.16-.08.34-.1.51-.06.89.21 1.83.32 2.8.32 5.52 0 10-3.82 10-8.5S17.52 2 12 2z" />
              </svg>
            </div>
            <p className="text-sm text-green-200/80">
              💡 วิดีโอที่อัพโหลดจะรองรับการแชร์ผ่าน LINE
              พร้อมเล่นได้ในแอพโดยตรง
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoUploadModal;

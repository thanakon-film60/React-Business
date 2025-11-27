"use client";

import { useState, useEffect, useCallback } from "react";

interface UploadedFile {
  fileName: string;
  originalName: string;
  size: number;
  sizeDisplay: string;
  url: string;
  isImage: boolean;
  isVideo: boolean;
  type: string;
  uploadedAt: string;
}

export default function FileUploadTestPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // ดึงรายการไฟล์เมื่อโหลดหน้า
  const fetchFiles = useCallback(async () => {
    try {
      const response = await fetch("/api/file-upload");
      const result = await response.json();
      if (result.success) {
        setUploadedFiles(result.data);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      setFiles(droppedFiles);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };

  // อัปโหลดไฟล์
  const handleUpload = async () => {
    if (files.length === 0) {
      setError("กรุณาเลือกไฟล์ก่อน");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/file-upload", {
          method: "POST",
          body: formData,
        });

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error);
        }
      }

      setSuccess(`อัปโหลด ${files.length} ไฟล์สำเร็จ!`);
      setFiles([]);
      fetchFiles(); // รีเฟรชรายการ
    } catch (err) {
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      setUploading(false);
    }
  };

  // ลบไฟล์
  const handleDelete = async (fileName: string) => {
    if (!confirm("ต้องการลบไฟล์นี้?")) return;

    try {
      const response = await fetch("/api/file-upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("ลบไฟล์สำเร็จ");
        fetchFiles();
        if (selectedFile?.fileName === fileName) {
          setSelectedFile(null);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("ไม่สามารถลบไฟล์ได้");
    }
  };

  // Format date
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            📁 ทดสอบอัปโหลดไฟล์
          </h1>
          <p className="text-gray-400">
            อัปโหลดไฟล์ไปเก็บบนเซิร์ฟเวอร์ และตรวจสอบผ่าน FileZilla Pro
          </p>
          <p className="text-sm text-blue-400 mt-2">
            📂 ไฟล์จะถูกเก็บที่:{" "}
            <code className="bg-gray-800 px-2 py-1 rounded">
              /public/uploads/
            </code>
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Section */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span>📤</span> อัปโหลดไฟล์
            </h2>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? "border-blue-500 bg-blue-500/20"
                  : "border-gray-600 hover:border-blue-400 hover:bg-gray-700/30"
              }`}
            >
              <input
                type="file"
                id="fileInput"
                multiple
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
              />
              <label htmlFor="fileInput" className="cursor-pointer">
                <div className="text-5xl mb-4">{isDragging ? "📥" : "📁"}</div>
                <p className="text-lg font-medium mb-2">
                  {isDragging
                    ? "วางไฟล์ที่นี่!"
                    : "ลากไฟล์มาวาง หรือคลิกเพื่อเลือก"}
                </p>
                <p className="text-gray-400 text-sm">
                  รองรับ: รูปภาพ, วิดีโอ, PDF, Word, Excel (สูงสุด 50MB)
                </p>
              </label>
            </div>

            {/* Selected Files */}
            {files.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm text-gray-400">ไฟล์ที่เลือก:</p>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 bg-gray-700/50 rounded-lg p-3"
                  >
                    <span className="text-2xl">
                      {file.type.startsWith("image/")
                        ? "🖼️"
                        : file.type.startsWith("video/")
                        ? "🎬"
                        : "📄"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">{file.name}</p>
                      <p className="text-sm text-gray-400">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFiles(files.filter((_, i) => i !== index))
                      }
                      className="text-red-400 hover:text-red-300"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            {error && (
              <div className="mt-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
                ❌ {error}
              </div>
            )}
            {success && (
              <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-300">
                ✅ {success}
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading || files.length === 0}
              className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                uploading || files.length === 0
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
              }`}
            >
              {uploading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  กำลังอัปโหลด...
                </span>
              ) : (
                `📤 อัปโหลด ${files.length > 0 ? `(${files.length} ไฟล์)` : ""}`
              )}
            </button>

            {/* Server Info */}
            <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-700">
              <h3 className="font-semibold mb-2">
                📋 วิธีตรวจสอบใน FileZilla Pro:
              </h3>
              <ol className="text-sm text-gray-300 space-y-1 list-decimal list-inside">
                <li>เชื่อมต่อกับเซิร์ฟเวอร์ 192.168.1.10</li>
                <li>
                  ไปที่โฟลเดอร์{" "}
                  <code className="bg-gray-800 px-1 rounded">
                    /public/uploads/
                  </code>
                </li>
                <li>จะเห็นไฟล์ที่อัปโหลดอยู่ในนั้น</li>
              </ol>
            </div>
          </div>

          {/* File List Section */}
          <div className="bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span>📂</span> ไฟล์ที่อัปโหลดแล้ว
              </h2>
              <button
                onClick={fetchFiles}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                🔄 รีเฟรช
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-gray-400">
                <div className="animate-spin text-4xl mb-2">⏳</div>
                กำลังโหลด...
              </div>
            ) : uploadedFiles.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-2">📭</div>
                ยังไม่มีไฟล์ที่อัปโหลด
              </div>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                {uploadedFiles.map((file) => (
                  <div
                    key={file.fileName}
                    onClick={() => setSelectedFile(file)}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                      selectedFile?.fileName === file.fileName
                        ? "bg-blue-600/30 border border-blue-500"
                        : "bg-gray-700/30 hover:bg-gray-700/50 border border-transparent"
                    }`}
                  >
                    {/* Thumbnail */}
                    {file.isImage ? (
                      <img
                        src={file.url}
                        alt={file.originalName}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center text-2xl">
                        {file.isVideo ? "🎬" : "📄"}
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="truncate font-medium">
                        {file.originalName}
                      </p>
                      <p className="text-sm text-gray-400">
                        {file.sizeDisplay} • {formatDate(file.uploadedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
                        title="เปิดดู"
                      >
                        👁️
                      </a>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(file.fileName);
                        }}
                        className="p-2 bg-red-600 hover:bg-red-500 rounded-lg transition-colors"
                        title="ลบ"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-700 text-sm text-gray-400">
                รวม {uploadedFiles.length} ไฟล์
              </div>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        {selectedFile && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-gray-700">
                <h3 className="font-semibold truncate">
                  {selectedFile.originalName}
                </h3>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <div className="p-4 flex items-center justify-center bg-gray-900 min-h-[300px]">
                {selectedFile.isImage ? (
                  <img
                    src={selectedFile.url}
                    alt={selectedFile.originalName}
                    className="max-w-full max-h-[60vh] object-contain"
                  />
                ) : selectedFile.isVideo ? (
                  <video
                    src={selectedFile.url}
                    controls
                    className="max-w-full max-h-[60vh]"
                  />
                ) : (
                  <div className="text-center">
                    <div className="text-6xl mb-4">📄</div>
                    <p>ไม่สามารถแสดงตัวอย่างได้</p>
                    <a
                      href={selectedFile.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-4 px-4 py-2 bg-blue-600 rounded-lg"
                    >
                      ดาวน์โหลด
                    </a>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-gray-700 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">ขนาด</p>
                  <p className="font-medium">{selectedFile.sizeDisplay}</p>
                </div>
                <div>
                  <p className="text-gray-400">ประเภท</p>
                  <p className="font-medium">{selectedFile.type}</p>
                </div>
                <div>
                  <p className="text-gray-400">อัปโหลดเมื่อ</p>
                  <p className="font-medium">
                    {formatDate(selectedFile.uploadedAt)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400">URL</p>
                  <p className="font-medium truncate text-blue-400">
                    {selectedFile.url}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

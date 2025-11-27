import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat, unlink } from "fs/promises";
import path from "path";
import { existsSync } from "fs";

// โฟลเดอร์เก็บไฟล์
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// สร้างโฟลเดอร์ถ้ายังไม่มี
async function ensureUploadDir() {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }
}

// POST - อัปโหลดไฟล์
export async function POST(request: NextRequest) {
  try {
    await ensureUploadDir();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: "ไม่พบไฟล์" },
        { status: 400 }
      );
    }

    // ตรวจสอบขนาดไฟล์ (สูงสุด 50MB)
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: "ไฟล์ใหญ่เกิน 50MB" },
        { status: 400 }
      );
    }

    // สร้างชื่อไฟล์ใหม่ (ป้องกันชื่อซ้ำ)
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}_${originalName}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // บันทึกไฟล์
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    await writeFile(filePath, uint8Array);

    console.log(`✅ ไฟล์ถูกบันทึกที่: ${filePath}`);

    return NextResponse.json({
      success: true,
      data: {
        fileName: fileName,
        originalName: file.name,
        size: file.size,
        sizeDisplay: formatFileSize(file.size),
        type: file.type,
        url: `/uploads/${fileName}`,
        uploadedAt: new Date().toISOString(),
      },
      message: "อัปโหลดสำเร็จ!",
    });
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return NextResponse.json(
      { success: false, error: "เกิดข้อผิดพลาดในการอัปโหลด" },
      { status: 500 }
    );
  }
}

// GET - ดึงรายการไฟล์ทั้งหมด
export async function GET() {
  try {
    await ensureUploadDir();

    const files = await readdir(UPLOAD_DIR);
    const fileList = await Promise.all(
      files.map(async (fileName) => {
        const filePath = path.join(UPLOAD_DIR, fileName);
        const fileStat = await stat(filePath);

        // ดึงชื่อไฟล์เดิม (ตัด timestamp ออก)
        const originalName = fileName.replace(/^\d+_/, "");

        // ตรวจสอบประเภทไฟล์
        const ext = path.extname(fileName).toLowerCase();
        const isImage = [
          ".jpg",
          ".jpeg",
          ".png",
          ".gif",
          ".webp",
          ".svg",
        ].includes(ext);
        const isVideo = [".mp4", ".webm", ".mov", ".avi"].includes(ext);

        return {
          fileName,
          originalName,
          size: fileStat.size,
          sizeDisplay: formatFileSize(fileStat.size),
          url: `/uploads/${fileName}`,
          isImage,
          isVideo,
          type: isImage ? "image" : isVideo ? "video" : "file",
          uploadedAt: fileStat.mtime.toISOString(),
        };
      })
    );

    // เรียงตามเวลาอัปโหลด (ใหม่สุดก่อน)
    fileList.sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: fileList,
      total: fileList.length,
      uploadDir: "/uploads/",
    });
  } catch (error) {
    console.error("❌ Error listing files:", error);
    return NextResponse.json(
      { success: false, error: "ไม่สามารถดึงรายการไฟล์ได้" },
      { status: 500 }
    );
  }
}

// DELETE - ลบไฟล์
export async function DELETE(request: NextRequest) {
  try {
    const { fileName } = await request.json();

    if (!fileName) {
      return NextResponse.json(
        { success: false, error: "ไม่ได้ระบุชื่อไฟล์" },
        { status: 400 }
      );
    }

    const filePath = path.join(UPLOAD_DIR, fileName);

    if (!existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: "ไม่พบไฟล์" },
        { status: 404 }
      );
    }

    await unlink(filePath);
    console.log(`🗑️ ลบไฟล์: ${fileName}`);

    return NextResponse.json({
      success: true,
      message: "ลบไฟล์สำเร็จ",
    });
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return NextResponse.json(
      { success: false, error: "ไม่สามารถลบไฟล์ได้" },
      { status: 500 }
    );
  }
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}

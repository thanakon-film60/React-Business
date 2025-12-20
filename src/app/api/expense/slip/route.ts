import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";

// ใช้ Google Cloud Vision API สำหรับ OCR
// หรือใช้ Tesseract.js สำหรับ free option

interface SlipData {
  transaction_type: string;
  amount: number;
  account_number: string | null;
  transaction_datetime: string;
  recipient: string | null;
  bank: string | null;
  raw_text: string;
}

// Parse Thai datetime
function parseThaiDateTime(text: string): string {
  const thaiMonths: Record<string, number> = {
    "ม.ค.": 0,
    มกราคม: 0,
    "ก.พ.": 1,
    กุมภาพันธ์: 1,
    "มี.ค.": 2,
    มีนาคม: 2,
    "เม.ย.": 3,
    เมษายน: 3,
    "พ.ค.": 4,
    พฤษภาคม: 4,
    "มิ.ย.": 5,
    มิถุนายน: 5,
    "ก.ค.": 6,
    กรกฎาคม: 6,
    "ส.ค.": 7,
    สิงหาคม: 7,
    "ก.ย.": 8,
    กันยายน: 8,
    "ต.ค.": 9,
    ตุลาคม: 9,
    "พ.ย.": 10,
    พฤศจิกายน: 10,
    "ธ.ค.": 11,
    ธันวาคม: 11,
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  // Pattern: 20 ธ.ค. 68 15:27 หรือ 20/12/2025 15:27
  const thaiPattern =
    /(\d{1,2})\s*([ก-ฮ]+\.?[ก-ฮ]*\.?|[A-Za-z]+)\s*(\d{2,4})\s*(\d{1,2}):(\d{2})/;
  const numPattern =
    /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\s*(\d{1,2}):(\d{2})/;

  let match = text.match(thaiPattern);
  if (match) {
    const day = parseInt(match[1]);
    const monthStr = match[2].replace(".", "");
    const month = thaiMonths[match[2]] ?? thaiMonths[monthStr] ?? 0;
    let year = parseInt(match[3]);
    if (year < 100) year += 2500;
    if (year > 2500) year -= 543;
    const hour = parseInt(match[4]);
    const minute = parseInt(match[5]);
    return new Date(year, month, day, hour, minute).toISOString();
  }

  match = text.match(numPattern);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    let year = parseInt(match[3]);
    if (year < 100) year += 2000;
    if (year > 2500) year -= 543;
    const hour = parseInt(match[4]);
    const minute = parseInt(match[5]);
    return new Date(year, month, day, hour, minute).toISOString();
  }

  return new Date().toISOString();
}

// Parse slip text to extract transaction data
function parseSlipText(text: string): SlipData | null {
  try {
    const lines = text
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    const fullText = text.toLowerCase();

    // หาจำนวนเงิน (หลายรูปแบบ)
    let amount = 0;
    const amountPatterns = [
      /จำนวน[เงิน]*\s*:?\s*([0-9,]+\.?\d*)/i,
      /amount\s*:?\s*([0-9,]+\.?\d*)/i,
      /([0-9,]+\.?\d*)\s*(?:บาท|THB|฿)/i,
      /฿\s*([0-9,]+\.?\d*)/,
      /THB\s*([0-9,]+\.?\d*)/i,
    ];

    for (const pattern of amountPatterns) {
      const match = text.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ""));
        if (amount > 0) break;
      }
    }

    if (amount === 0) return null;

    // หาประเภทรายการ
    let transaction_type = "โอนเงิน";
    if (fullText.includes("ถอน")) {
      transaction_type = "ถอนเงิน";
    } else if (fullText.includes("โอน") || fullText.includes("transfer")) {
      transaction_type = "โอนเงิน";
    } else if (fullText.includes("รับ") || fullText.includes("เข้า")) {
      transaction_type = "รับเงิน";
    } else if (fullText.includes("จ่าย") || fullText.includes("ชำระ")) {
      transaction_type = "จ่ายเงิน";
    } else if (fullText.includes("เติม")) {
      transaction_type = "เติมเงิน";
    }

    // หาเลขบัญชี
    let account_number = null;
    const accountPatterns = [
      /(?:บัญชี|เลขที่|account)[^\d]*(\d{3}[-\s]?\d{1}[-\s]?\d{5}[-\s]?\d{1})/i,
      /(\d{3}[-\s]?\d{1}[-\s]?\d{5}[-\s]?\d{1})/,
      /[xX*]+[-]?[xX*]+[-]?(\d{4})[-]?[xX*]*/,
      /\*{2,}(\d{4})/,
    ];

    for (const pattern of accountPatterns) {
      const match = text.match(pattern);
      if (match) {
        account_number = match[1] || match[0];
        break;
      }
    }

    // หาวันเวลา
    const transaction_datetime = parseThaiDateTime(text);

    // หาชื่อผู้รับ
    let recipient = null;
    const recipientPatterns = [
      /(?:ผู้รับ|ไปยัง|to|recipient)[:\s]*([ก-๙a-zA-Z\s]+)/i,
      /(?:ชื่อ)[:\s]*([ก-๙a-zA-Z\s]+)/i,
    ];

    for (const pattern of recipientPatterns) {
      const match = text.match(pattern);
      if (match) {
        recipient = match[1].trim().substring(0, 50);
        break;
      }
    }

    // หาธนาคาร
    let bank = null;
    const banks = [
      { keywords: ["กสิกร", "kbank", "kasikorn"], name: "กสิกรไทย" },
      { keywords: ["กรุงเทพ", "bbl", "bangkok bank"], name: "กรุงเทพ" },
      { keywords: ["ไทยพาณิชย์", "scb"], name: "ไทยพาณิชย์" },
      { keywords: ["กรุงไทย", "ktb"], name: "กรุงไทย" },
      { keywords: ["กรุงศรี", "bay", "krungsri"], name: "กรุงศรี" },
      { keywords: ["ทหารไทยธนชาต", "ttb"], name: "ทหารไทยธนชาต" },
      { keywords: ["ออมสิน", "gsb"], name: "ออมสิน" },
      { keywords: ["uob"], name: "UOB" },
      { keywords: ["cimb"], name: "CIMB" },
      { keywords: ["truemoney", "true money", "ทรูมันนี่"], name: "TrueMoney" },
      { keywords: ["promptpay", "พร้อมเพย์"], name: "PromptPay" },
    ];

    for (const { keywords, name } of banks) {
      if (keywords.some((k) => fullText.includes(k))) {
        bank = name;
        break;
      }
    }

    return {
      transaction_type,
      amount,
      account_number,
      transaction_datetime,
      recipient,
      bank,
      raw_text: text,
    };
  } catch (error) {
    console.error("Error parsing slip:", error);
    return null;
  }
}

// OCR using Google Cloud Vision API
async function ocrWithGoogleVision(imageBase64: string): Promise<string> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  if (!apiKey) {
    throw new Error("Google Cloud Vision API key not configured");
  }

  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requests: [
          {
            image: { content: imageBase64 },
            features: [{ type: "TEXT_DETECTION", maxResults: 1 }],
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error.message);
  }

  const textAnnotations = data.responses?.[0]?.textAnnotations;
  if (!textAnnotations || textAnnotations.length === 0) {
    return "";
  }

  return textAnnotations[0].description || "";
}

// POST - อัพโหลดสลิปและอ่านข้อมูล
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    let imageBase64 = "";
    let manualText = "";

    if (contentType.includes("multipart/form-data")) {
      // รับไฟล์รูป
      const formData = await request.formData();
      const file = formData.get("slip") as File | null;
      const text = formData.get("text") as string | null;

      if (text) {
        // ถ้าส่ง text มาโดยตรง ไม่ต้อง OCR
        manualText = text;
      } else if (file) {
        const bytes = await file.arrayBuffer();
        imageBase64 = Buffer.from(bytes).toString("base64");
      } else {
        return NextResponse.json(
          { success: false, error: "No slip image or text provided" },
          { status: 400 }
        );
      }
    } else if (contentType.includes("application/json")) {
      const body = await request.json();

      if (body.text) {
        manualText = body.text;
      } else if (body.image) {
        // Base64 image
        imageBase64 = body.image.replace(/^data:image\/\w+;base64,/, "");
      } else {
        return NextResponse.json(
          { success: false, error: "No slip image or text provided" },
          { status: 400 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid content type" },
        { status: 400 }
      );
    }

    let extractedText = manualText;

    // ถ้ามีรูป ให้ OCR
    if (imageBase64 && !manualText) {
      try {
        extractedText = await ocrWithGoogleVision(imageBase64);
      } catch (ocrError) {
        console.error("OCR Error:", ocrError);
        return NextResponse.json(
          {
            success: false,
            error:
              "OCR failed. กรุณาตั้งค่า GOOGLE_CLOUD_VISION_API_KEY หรือกรอกข้อมูลเอง",
            needsManualInput: true,
          },
          { status: 400 }
        );
      }
    }

    if (!extractedText) {
      return NextResponse.json(
        { success: false, error: "Could not extract text from slip" },
        { status: 400 }
      );
    }

    // Parse ข้อมูลจาก text
    const slipData = parseSlipText(extractedText);

    if (!slipData || slipData.amount === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Could not parse slip data",
          extracted_text: extractedText,
          needsManualInput: true,
        },
        { status: 400 }
      );
    }

    // บันทึกลง pending_transactions
    const result = await pool.query(
      `INSERT INTO pending_transactions 
        (transaction_type, amount, account_number, transaction_datetime, source, raw_message, description, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
       RETURNING *`,
      [
        slipData.transaction_type,
        slipData.amount,
        slipData.account_number,
        slipData.transaction_datetime,
        "Slip OCR",
        slipData.raw_text,
        slipData.recipient
          ? `${slipData.bank || ""} - ${slipData.recipient}`
          : slipData.bank,
      ]
    );

    return NextResponse.json({
      success: true,
      message: "Slip processed successfully",
      data: {
        id: result.rows[0].id,
        ...slipData,
      },
    });
  } catch (error) {
    console.error("Slip processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process slip" },
      { status: 500 }
    );
  }
}

// GET - ข้อมูล API
export async function GET() {
  return NextResponse.json({
    status: "Slip OCR API is ready",
    usage: {
      method: "POST",
      contentType: "multipart/form-data",
      body: {
        slip: "Image file (PNG, JPG)",
        text: "Or paste slip text directly (optional)",
      },
    },
    note: "ต้องตั้งค่า GOOGLE_CLOUD_VISION_API_KEY ใน environment variables",
  });
}

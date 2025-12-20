import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";

// API Key for authentication (ตั้งใน .env)
const API_KEY = process.env.EXPENSE_API_KEY || "";

// Parse Thai datetime (20 ธ.ค. 68 15:27) to ISO string
function parseThaiDateTime(thaiDate: string): string {
  const thaiMonths: Record<string, number> = {
    "ม.ค.": 0,
    "ก.พ.": 1,
    "มี.ค.": 2,
    "เม.ย.": 3,
    "พ.ค.": 4,
    "มิ.ย.": 5,
    "ก.ค.": 6,
    "ส.ค.": 7,
    "ก.ย.": 8,
    "ต.ค.": 9,
    "พ.ย.": 10,
    "ธ.ค.": 11,
  };

  const match = thaiDate.match(
    /(\d{1,2})\s*(\S+\.?)\s*(\d{2,4})\s*(\d{1,2}):(\d{2})/
  );
  if (!match) return new Date().toISOString();

  const day = parseInt(match[1]);
  const month = thaiMonths[match[2]] ?? 0;
  let year = parseInt(match[3]);
  if (year < 100) year += 2500;
  if (year > 2500) year -= 543;
  const hour = parseInt(match[4]);
  const minute = parseInt(match[5]);

  return new Date(year, month, day, hour, minute).toISOString();
}

// Parse notification text from LINE BK
function parseLineBKNotification(text: string): {
  transaction_type: string;
  amount: number;
  account_number: string | null;
  transaction_datetime: string;
} | null {
  try {
    // หาจำนวนเงิน
    const amountMatch = text.match(/([0-9,]+\.?\d*)\s*บาท/);
    if (!amountMatch) return null;

    const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
    if (amount <= 0) return null;

    // หาประเภทรายการ
    let transaction_type = "รายการ";
    if (
      text.includes("ถอน") ||
      text.includes("โอนเงิน") ||
      text.includes("โอน")
    ) {
      transaction_type = "ถอน/โอนเงิน";
    } else if (text.includes("รับเงิน") || text.includes("เงินเข้า")) {
      transaction_type = "รับเงิน";
    } else if (text.includes("จ่ายบิล") || text.includes("ชำระ")) {
      transaction_type = "จ่ายบิล";
    } else if (text.includes("เติมเงิน")) {
      transaction_type = "เติมเงิน";
    }

    // หาเลขบัญชี
    const accountMatch = text.match(/\*?(\d{4})|([x\d\-]+)/i);
    const account_number = accountMatch ? accountMatch[0] : null;

    // หาวันเวลา
    const dateMatch = text.match(
      /(\d{1,2}\s*\S+\.?\s*\d{2,4}\s*\d{1,2}:\d{2})/
    );
    const transaction_datetime = dateMatch
      ? parseThaiDateTime(dateMatch[1])
      : new Date().toISOString();

    return {
      transaction_type,
      amount,
      account_number,
      transaction_datetime,
    };
  } catch (error) {
    console.error("Error parsing notification:", error);
    return null;
  }
}

// POST - รับข้อมูลจาก Tasker/IFTTT/Automate
export async function POST(request: NextRequest) {
  try {
    // ตรวจสอบ API Key
    const authHeader = request.headers.get("authorization");
    const providedKey =
      authHeader?.replace("Bearer ", "") ||
      request.headers.get("x-api-key") ||
      "";

    if (API_KEY && providedKey !== API_KEY) {
      return NextResponse.json(
        { success: false, error: "Invalid API key" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // รองรับหลายรูปแบบ
    // 1. notification text โดยตรง: { text: "ถอน/โอนเงิน 120.00 บาท..." }
    // 2. parsed data: { amount: 120, type: "ถอน/โอนเงิน", ... }
    // 3. raw notification: { title: "LINE BK", content: "ถอน/โอนเงิน..." }

    let transaction_type = "";
    let amount = 0;
    let account_number = null;
    let transaction_datetime = new Date().toISOString();
    let raw_message = "";

    if (body.text || body.content || body.message) {
      // Parse from notification text
      const text = body.text || body.content || body.message;
      raw_message = text;

      const parsed = parseLineBKNotification(text);
      if (parsed) {
        transaction_type = parsed.transaction_type;
        amount = parsed.amount;
        account_number = parsed.account_number;
        transaction_datetime = parsed.transaction_datetime;
      } else {
        return NextResponse.json(
          { success: false, error: "Could not parse notification text" },
          { status: 400 }
        );
      }
    } else if (body.amount) {
      // Direct parsed data
      transaction_type = body.transaction_type || body.type || "รายการ";
      amount = parseFloat(body.amount);
      account_number = body.account_number || body.account || null;
      transaction_datetime =
        body.datetime || body.transaction_datetime || new Date().toISOString();
      raw_message = JSON.stringify(body);
    } else {
      return NextResponse.json(
        { success: false, error: "Missing required fields: text or amount" },
        { status: 400 }
      );
    }

    // บันทึกลง pending_transactions
    const result = await pool.query(
      `INSERT INTO pending_transactions 
        (transaction_type, amount, account_number, transaction_datetime, source, raw_message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        transaction_type,
        amount,
        account_number,
        transaction_datetime,
        body.source || "Tasker/Auto",
        raw_message,
      ]
    );

    const savedTransaction = result.rows[0];
    console.log("Auto-saved transaction:", savedTransaction);

    return NextResponse.json({
      success: true,
      message: "Transaction saved successfully",
      data: {
        id: savedTransaction.id,
        amount: savedTransaction.amount,
        type: savedTransaction.transaction_type,
        status: "pending",
      },
    });
  } catch (error) {
    console.error("Auto expense error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save transaction" },
      { status: 500 }
    );
  }
}

// GET - ทดสอบ endpoint
export async function GET() {
  return NextResponse.json({
    status: "Auto Expense API is ready",
    usage: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_API_KEY (optional)",
      },
      body: {
        option1: { text: "ถอน/โอนเงิน 120.00 บาท 20 ธ.ค. 68 15:27" },
        option2: { amount: 120, type: "ถอน/โอนเงิน" },
      },
    },
  });
}

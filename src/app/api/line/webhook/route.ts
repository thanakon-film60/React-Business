import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";
import crypto from "crypto";

// LINE Webhook signature verification
function verifySignature(body: string, signature: string): boolean {
  const channelSecret = process.env.LINE_CHANNEL_SECRET || "";
  const hash = crypto
    .createHmac("sha256", channelSecret)
    .update(body)
    .digest("base64");
  return hash === signature;
}

// Parse Thai datetime (19 ธ.ค. 68 14:40) to ISO string
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

// Parse LINE BK message to extract transaction data
function parseLineBKMessage(text: string): {
  type: "income" | "expense";
  amount: number;
  title: string;
  category: string;
  accountInfo: string | null;
  transactionTime: string | null;
} | null {
  // Pattern for LINE BK alerts
  // Example: "ถอน/โอนเงิน\n91.00 บาท\nโอนเงิน\n19 ธ.ค. 68 14:40\n\nจากบัญชี บัญชีหลัก(xxx-x-x6114-x)"

  const lines = text.split("\n").map((l) => l.trim());

  // Extract account info (บัญชีหลัก xxx-x-x6114-x)
  const accountMatch = text.match(/บัญชี[หลัก]*\s*\(?([x\d-]+)\)?/i);
  const accountInfo = accountMatch ? accountMatch[1] : null;

  // Extract transaction time (19 ธ.ค. 68 14:40)
  const timeMatch = text.match(/(\d{1,2}\s+\S+\.?\s+\d{2,4}\s+\d{1,2}:\d{2})/);
  const transactionTime = timeMatch ? timeMatch[1] : null;

  // Check for withdrawal/transfer (expense) - เงินออก
  if (
    text.includes("ถอน") ||
    text.includes("โอนเงิน") ||
    text.includes("จ่าย") ||
    text.includes("ชำระ") ||
    text.includes("โอนออก")
  ) {
    const amountMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)\s*บาท/);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      return {
        type: "expense",
        amount,
        title: lines[0] || "โอนเงินออก",
        category: "transport",
        accountInfo,
        transactionTime,
      };
    }
  }

  // Check for incoming money (income) - เงินเข้า
  if (
    text.includes("รับเงิน") ||
    text.includes("เงินเข้า") ||
    text.includes("โอนเข้า")
  ) {
    const amountMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)\s*บาท/);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      return {
        type: "income",
        amount,
        title: lines[0] || "รับเงินเข้า",
        category: "other-income",
        accountInfo,
        transactionTime,
      };
    }
  }

  return null;
}

// Save log to database
async function saveLog(
  transactionId: number | null,
  userId: string,
  rawMessage: string,
  transaction: { type: string; amount: number } | null,
  status: "success" | "failed" | "ignored",
  errorMessage: string | null = null
) {
  try {
    await pool.query(
      `INSERT INTO expense_logs 
        (transaction_id, user_id, source, raw_message, parsed_type, parsed_amount, status, error_message, created_at)
       VALUES ($1, $2, 'line_bk', $3, $4, $5, $6, $7, NOW())`,
      [
        transactionId,
        userId,
        rawMessage,
        transaction?.type || null,
        transaction?.amount || null,
        status,
        errorMessage,
      ]
    );
  } catch (error) {
    console.error("Failed to save log:", error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-line-signature") || "";

    // Verify LINE signature (skip in development)
    if (
      process.env.NODE_ENV === "production" &&
      process.env.LINE_CHANNEL_SECRET
    ) {
      if (!verifySignature(body, signature)) {
        console.error("Invalid LINE signature");
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 401 }
        );
      }
    }

    const data = JSON.parse(body);
    const events = data.events || [];

    for (const event of events) {
      // Only process message events
      if (event.type !== "message" || event.message.type !== "text") {
        continue;
      }

      const messageText = event.message.text;
      const sourceType = event.source.type; // user, group, room
      const userId = event.source.userId || "unknown";
      const groupId = event.source.groupId || event.source.roomId || null;

      console.log(
        `LINE Webhook - Source: ${sourceType}, Group: ${groupId}, User: ${userId}`
      );
      console.log("Message:", messageText);

      // Try to parse as LINE BK message (ตรวจจับข้อความแจ้งเตือนธนาคาร)
      const transaction = parseLineBKMessage(messageText);

      if (transaction) {
        // Save to pending_transactions (รอจัดสรร)
        const result = await pool.query(
          `INSERT INTO pending_transactions 
            (transaction_type, amount, account_number, transaction_datetime, source, raw_message, description, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
           RETURNING *`,
          [
            transaction.title,
            transaction.amount,
            transaction.accountInfo || null,
            transaction.transactionTime
              ? parseThaiDateTime(transaction.transactionTime)
              : new Date().toISOString(),
            groupId ? "LINE BK (Group Auto)" : "LINE BK (Auto)",
            messageText,
            transaction.title,
          ]
        );

        const savedTransaction = result.rows[0];
        console.log("Pending transaction saved:", savedTransaction);

        // Save log
        await saveLog(
          savedTransaction.id,
          userId,
          messageText,
          transaction,
          "success"
        );

        // Reply (ในกลุ่มอาจไม่ต้อง reply ทุกครั้ง)
        if (sourceType === "user") {
          await replyToUser(event.replyToken, transaction, savedTransaction.id);
        } else {
          // ในกลุ่ม ตอบสั้นๆ หรือไม่ตอบก็ได้
          await replyToGroup(
            event.replyToken,
            transaction,
            savedTransaction.id
          );
        }
      } else {
        // ไม่ใช่ข้อความธนาคาร
        // ในกลุ่ม: ไม่ต้องทำอะไร (ไม่ reply)
        // แชทส่วนตัว: ส่ง help message
        if (sourceType === "user") {
          await saveLog(null, userId, messageText, null, "ignored");
          await sendHelpMessage(event.replyToken);
        }
        // ถ้าเป็นกลุ่ม ไม่ต้อง reply ข้อความปกติ
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("LINE Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Reply with detailed transaction info
async function replyToUser(
  replyToken: string,
  transaction: {
    type: string;
    amount: number;
    title: string;
    accountInfo: string | null;
    transactionTime: string | null;
  },
  transactionId: number
) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken || !replyToken) return;

  const emoji = "📝";

  const messageLines = [
    `${emoji} บันทึกรายการสำเร็จ! (รอจัดสรร)`,
    ``,
    `💰 จำนวน: ${transaction.amount.toLocaleString("th-TH", {
      minimumFractionDigits: 2,
    })} บาท`,
    `📋 รายการ: ${transaction.title}`,
  ];

  if (transaction.accountInfo) {
    messageLines.push(`🏦 บัญชี: ${transaction.accountInfo}`);
  }

  if (transaction.transactionTime) {
    messageLines.push(`🕐 เวลา: ${transaction.transactionTime}`);
  }

  messageLines.push(``);
  messageLines.push(`🔢 รหัสรอจัดสรร: #${transactionId}`);
  messageLines.push(`⏳ สถานะ: รอระบุว่าใช้ไปกับอะไร`);
  messageLines.push(``);
  messageLines.push(`📊 จัดสรรรายการ:`);
  messageLines.push(`https://tpp-thanakon.store/expense/pending`);

  const message = {
    type: "text",
    text: messageLines.join("\n"),
  };

  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [message],
      }),
    });
  } catch (error) {
    console.error("LINE Reply error:", error);
  }
}

// Send help message for non-bank messages
async function sendHelpMessage(replyToken: string) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken || !replyToken) return;

  const message = {
    type: "text",
    text: `📊 Expense Tracker Bot\n\n💡 วิธีใช้งาน:\n1. Forward ข้อความแจ้งเตือนจาก LINE BK มาที่นี่\n2. Bot จะบันทึกรายรับ-รายจ่ายอัตโนมัติ\n\n🔗 ดูรายการทั้งหมด:\nhttps://tpp-thanakon.store/expense`,
  };

  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [message],
      }),
    });
  } catch (error) {
    console.error("LINE Reply error:", error);
  }
}

// Reply in group (short message)
async function replyToGroup(
  replyToken: string,
  transaction: {
    type: string;
    amount: number;
    title: string;
    accountInfo: string | null;
    transactionTime: string | null;
  },
  transactionId: number
) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken || !replyToken) return;

  // ข้อความสั้นๆ สำหรับกลุ่ม
  const message = {
    type: "text",
    text: `✅ บันทึกแล้ว #${transactionId}\n💰 ${transaction.amount.toLocaleString(
      "th-TH",
      { minimumFractionDigits: 2 }
    )} บาท`,
  };

  try {
    await fetch("https://api.line.me/v2/bot/message/reply", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        replyToken,
        messages: [message],
      }),
    });
  } catch (error) {
    console.error("LINE Group Reply error:", error);
  }
}

// GET for webhook verification
export async function GET() {
  return NextResponse.json({
    status: "LINE Expense Webhook is running",
    timestamp: new Date().toISOString(),
  });
}

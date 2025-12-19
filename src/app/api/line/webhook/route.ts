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

// Parse LINE BK message to extract transaction data
function parseLineBKMessage(text: string): {
  type: "income" | "expense";
  amount: number;
  title: string;
  category: string;
} | null {
  // Pattern for LINE BK alerts
  // Example: "ถอน/โอนเงิน\n91.00 บาท\nโอนเงิน\n19 ธ.ค. 68 14:40"
  // Example: "รับเงิน\n500.00 บาท\nโอนเงิน\n19 ธ.ค. 68 14:40"

  const lines = text.split("\n").map((l) => l.trim());

  // Check for withdrawal/transfer (expense)
  if (
    text.includes("ถอน") ||
    text.includes("โอนเงิน") ||
    text.includes("จ่าย") ||
    text.includes("ชำระ")
  ) {
    const amountMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)\s*บาท/);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      return {
        type: "expense",
        amount,
        title: lines[0] || "โอนเงินออก",
        category: "transport",
      };
    }
  }

  // Check for incoming money (income)
  if (text.includes("รับเงิน") || text.includes("เงินเข้า")) {
    const amountMatch = text.match(/(\d+(?:,\d{3})*(?:\.\d{2})?)\s*บาท/);
    if (amountMatch) {
      const amount = parseFloat(amountMatch[1].replace(/,/g, ""));
      return {
        type: "income",
        amount,
        title: lines[0] || "รับเงินเข้า",
        category: "other-income",
      };
    }
  }

  return null;
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
      const userId = event.source.userId;

      console.log("LINE Webhook - Received from", userId, ":", messageText);

      // Try to parse as LINE BK message
      const transaction = parseLineBKMessage(messageText);

      if (transaction) {
        // Save to database
        const result = await pool.query(
          `INSERT INTO expense_transactions 
            (type, title, amount, category, date, note, created_at, updated_at)
           VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, NOW(), NOW())
           RETURNING *`,
          [
            transaction.type,
            transaction.title,
            transaction.amount,
            transaction.category,
            `Auto-imported from LINE BK`,
          ]
        );

        console.log("Transaction saved:", result.rows[0]);

        // Reply to confirm
        await replyToUser(event.replyToken, transaction);
      } else {
        // Not a bank message - reply with help
        await sendHelpMessage(event.replyToken);
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

// Reply to confirm transaction saved
async function replyToUser(
  replyToken: string,
  transaction: { type: string; amount: number; title: string }
) {
  const accessToken = process.env.LINE_CHANNEL_ACCESS_TOKEN;
  if (!accessToken || !replyToken) return;

  const emoji = transaction.type === "income" ? "💵" : "💸";
  const typeText = transaction.type === "income" ? "รายรับ" : "รายจ่าย";

  const message = {
    type: "text",
    text: `${emoji} บันทึก${typeText}เรียบร้อย!\n\n📝 ${
      transaction.title
    }\n💰 ${transaction.amount.toLocaleString()} บาท\n\n✅ ดูรายการทั้งหมดได้ที่:\nhttps://tpp-thanakon.store/expense`,
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

// GET for webhook verification
export async function GET() {
  return NextResponse.json({
    status: "LINE Expense Webhook is running",
    timestamp: new Date().toISOString(),
  });
}

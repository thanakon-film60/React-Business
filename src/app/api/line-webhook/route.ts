import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

/**
 * LINE Webhook API for Native Video Playback
 *
 * เมื่อ user ส่ง link วิดีโอมาที่ Bot, Bot จะส่ง native video กลับไป
 * ทำให้วิดีโอเล่นได้โดยตรงใน LINE chat
 *
 * Setup:
 * 1. สร้าง LINE Official Account ที่ https://developers.line.biz/
 * 2. เปิดใช้งาน Messaging API
 * 3. ตั้ง Webhook URL เป็น: https://tpp-thanakon.store/api/line-webhook
 * 4. ใส่ Channel Access Token ใน environment variable
 */

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN || "";

// Verify webhook signature (optional but recommended)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    console.log("📨 LINE Webhook received:", JSON.stringify(body, null, 2));

    // Process each event
    const events = body.events || [];

    for (const event of events) {
      if (event.type === "message" && event.message.type === "text") {
        const userMessage = event.message.text;
        const replyToken = event.replyToken;

        // Check if message contains video share link
        const videoMatch = userMessage.match(/\/share\/video\/(\d+)/);

        if (videoMatch) {
          const videoId = videoMatch[1];
          await sendNativeVideo(replyToken, parseInt(videoId));
        } else if (
          userMessage.includes("วิดีโอ") ||
          userMessage.toLowerCase().includes("video")
        ) {
          // User asking for videos - send video list
          await sendVideoList(replyToken);
        } else {
          // Default reply
          await replyText(
            replyToken,
            "ส่ง link วิดีโอมาได้เลยครับ เช่น:\nhttps://tpp-thanakon.store/share/video/12\n\nBot จะส่งวิดีโอให้ดูได้เลยใน LINE!"
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ LINE Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// Send native video message
async function sendNativeVideo(replyToken: string, videoId: number) {
  const client = await pool.connect();

  try {
    // Get video info
    const result = await client.query(
      `
      SELECT id, name, description, duration
      FROM public.media_files
      WHERE id = $1 AND COALESCE(is_active, TRUE) = TRUE
    `,
      [videoId]
    );

    if (result.rows.length === 0) {
      await replyText(replyToken, "ไม่พบวิดีโอนี้ครับ");
      return;
    }

    const video = result.rows[0];
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://tpp-thanakon.store";

    // Send native video message
    // LINE จะแสดงเป็น video player ที่เล่นได้โดยตรง!
    const messages = [
      {
        type: "video",
        originalContentUrl: `${baseUrl}/api/video-stream/${videoId}`,
        previewImageUrl: `${baseUrl}/api/video-thumbnail/${videoId}`,
        trackingId: `video-${videoId}`,
      },
      {
        type: "text",
        text: `🎬 ${video.name}\n${video.description || ""}\n⏱️ ${
          video.duration || ""
        }`.trim(),
      },
    ];

    await callLineAPI(replyToken, messages);
  } finally {
    client.release();
  }
}

// Send video list as Flex Message
async function sendVideoList(replyToken: string) {
  const client = await pool.connect();

  try {
    const result = await client.query(`
      SELECT id, name, duration, category_name
      FROM public.media_files
      WHERE file_type IN ('video', 'clip') 
        AND COALESCE(is_active, TRUE) = TRUE
      ORDER BY created_at DESC
      LIMIT 5
    `);

    if (result.rows.length === 0) {
      await replyText(replyToken, "ยังไม่มีวิดีโอในระบบครับ");
      return;
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "https://tpp-thanakon.store";

    // Create Flex Message carousel
    const bubbles = result.rows.map((video) => ({
      type: "bubble",
      size: "micro",
      hero: {
        type: "image",
        url: `${baseUrl}/api/video-thumbnail/${video.id}`,
        size: "full",
        aspectRatio: "16:9",
        aspectMode: "cover",
        action: {
          type: "message",
          label: "ดูวิดีโอ",
          text: `${baseUrl}/share/video/${video.id}`,
        },
      },
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: video.name,
            weight: "bold",
            size: "sm",
            wrap: true,
            maxLines: 2,
          },
          {
            type: "text",
            text: video.duration || video.category_name || "วิดีโอ",
            size: "xs",
            color: "#888888",
          },
        ],
        spacing: "sm",
        paddingAll: "10px",
      },
    }));

    const flexMessage = {
      type: "flex",
      altText: "รายการวิดีโอ",
      contents: {
        type: "carousel",
        contents: bubbles,
      },
    };

    await callLineAPI(replyToken, [
      { type: "text", text: "🎬 วิดีโอล่าสุด - กดที่รูปเพื่อดูวิดีโอครับ" },
      flexMessage,
    ]);
  } finally {
    client.release();
  }
}

// Simple text reply
async function replyText(replyToken: string, text: string) {
  await callLineAPI(replyToken, [{ type: "text", text }]);
}

// Call LINE Messaging API
async function callLineAPI(replyToken: string, messages: any[]) {
  if (!LINE_CHANNEL_ACCESS_TOKEN) {
    console.error("❌ LINE_CHANNEL_ACCESS_TOKEN not set");
    return;
  }

  const response = await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("❌ LINE API error:", error);
  } else {
    console.log("✅ LINE message sent successfully");
  }
}

// Handle GET for webhook verification
export async function GET() {
  return NextResponse.json({
    status: "LINE Webhook is ready",
    message: "Send video links to get native video playback!",
  });
}

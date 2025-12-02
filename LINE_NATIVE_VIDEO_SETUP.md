# 🎬 วิธีทำให้วิดีโอเล่นได้โดยตรงใน LINE

## ปัญหา

LINE ไม่รองรับการส่ง native video จาก website โดยตรง (user-to-user sharing)

## ✅ Solution: LINE Official Account + Bot

### ขั้นตอนการ Setup

#### 1. สร้าง LINE Official Account

1. ไปที่ https://developers.line.biz/
2. Login ด้วย LINE account
3. กด "Create" → "Create a new channel"
4. เลือก "Messaging API"
5. กรอกข้อมูล:
   - Channel name: "BJH Video Gallery" (หรือชื่อที่ต้องการ)
   - Channel description: "ส่งวิดีโอดูได้เลยใน LINE"
   - Category: เลือกตามต้องการ
6. กด Create

#### 2. ตั้งค่า Messaging API

1. ในหน้า Channel settings → Messaging API tab
2. Copy **Channel access token** (กด Issue ถ้ายังไม่มี)
3. ตั้ง **Webhook URL**: `https://tpp-thanakon.store/api/line-webhook`
4. เปิด **Use webhook**: ON
5. ปิด **Auto-reply messages**: OFF (optional)

#### 3. เพิ่ม Environment Variable บน Vercel

1. ไปที่ Vercel Dashboard → Project Settings → Environment Variables
2. เพิ่ม:
   ```
   LINE_CHANNEL_ACCESS_TOKEN = [your_channel_access_token]
   ```
3. Redeploy

#### 4. ทดสอบ

1. เพิ่ม Bot เป็นเพื่อน (scan QR code ในหน้า Messaging API)
2. ส่งข้อความ: `https://tpp-thanakon.store/share/video/12`
3. Bot จะส่ง **native video** กลับมาที่เล่นได้เลยใน LINE! 🎉

---

## วิธีใช้งาน

### สำหรับ User

1. เพิ่ม Bot เป็นเพื่อน
2. ส่ง link วิดีโอ: `https://tpp-thanakon.store/share/video/12`
3. Bot จะส่งวิดีโอกลับมา → เล่นได้เลยใน LINE!

### สำหรับ Share ให้เพื่อน

1. Forward วิดีโอที่ Bot ส่งมาไปยัง chat อื่น
2. เพื่อนจะได้รับ native video ที่เล่นได้เลย

---

## API Endpoints

| Endpoint                 | Description                 |
| ------------------------ | --------------------------- |
| `POST /api/line-webhook` | รับ webhook events จาก LINE |
| `GET /api/line-webhook`  | ตรวจสอบ status              |

---

## Bot Commands

| ข้อความ                     | การตอบกลับ             |
| --------------------------- | ---------------------- |
| `https://...share/video/12` | ส่ง native video       |
| `วิดีโอ` หรือ `video`       | แสดงรายการวิดีโอล่าสุด |
| ข้อความอื่น                 | คำแนะนำการใช้งาน       |

---

## ข้อดีของวิธีนี้

✅ วิดีโอเล่นได้โดยตรงใน LINE (native player)  
✅ ไม่ต้องเปิด browser  
✅ Forward ให้เพื่อนได้ง่าย  
✅ มี preview thumbnail  
✅ รองรับ seeking/scrubbing

---

## Requirements

- LINE Official Account (ฟรี)
- Messaging API enabled
- HTTPS endpoint (Vercel มีอยู่แล้ว)
- Video format: MP4 (H.264)

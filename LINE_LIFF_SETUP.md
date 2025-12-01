# LINE LIFF Setup Guide - Native Video Sharing

## 🎯 วัตถุประสงค์

เพื่อให้สามารถส่ง **Native Video Message** ใน LINE ได้ (ไม่ใช่แค่ link preview)

![Native Video in LINE](https://i.imgur.com/example.png)

**ผลลัพธ์ที่ต้องการ:**
- ✅ วิดีโอแสดงพร้อมปุ่ม Play ใน LINE Chat
- ✅ กดเล่นได้ทันทีโดยไม่ต้องเปิด Browser
- ✅ มี Save/Share options
- ✅ แสดง duration (00:03, 00:11)

---

## 📋 ขั้นตอนการตั้งค่า

### Step 1: สร้าง LINE Developers Account

1. ไปที่ [LINE Developers Console](https://developers.line.biz/console/)
2. Login ด้วย LINE Account
3. สร้าง Provider ใหม่ (หรือใช้ที่มีอยู่)

### Step 2: สร้าง LINE Login Channel

1. ใน Provider → **Create a new channel**
2. เลือก **LINE Login**
3. กรอกข้อมูล:
   - Channel name: `TPP Video Share`
   - Channel description: `Video sharing for LINE`
   - App types: ✅ Web app
   - Email: อีเมลของคุณ

4. **สร้าง Channel**

### Step 3: สร้าง LIFF App

1. ไปที่ Channel ที่สร้าง → Tab **LIFF**
2. คลิก **Add** เพื่อสร้าง LIFF app

3. กรอกข้อมูล:
   ```
   LIFF app name: TPP Video Share
   Size: Full (หรือ Tall)
   Endpoint URL: https://tpp-thanakon.store
   Scope: ✅ openid, ✅ profile
   ```

4. **เปิดใช้งาน shareTargetPicker:**
   - ในหน้า LIFF app settings
   - เปิด "shareTargetPicker"
   - Save changes

5. **Copy LIFF ID** (เช่น `1234567890-abcdefgh`)

### Step 4: ตั้งค่า Environment Variables

เพิ่มใน `.env.local`:

```env
NEXT_PUBLIC_LIFF_ID=1234567890-abcdefgh
NEXT_PUBLIC_BASE_URL=https://tpp-thanakon.store
```

เพิ่มใน Vercel Dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_LIFF_ID = 1234567890-abcdefgh
NEXT_PUBLIC_BASE_URL = https://tpp-thanakon.store
```

### Step 5: ตั้งค่า Endpoint URL

ใน LIFF settings ต้องใส่ **Endpoint URL** ที่ถูกต้อง:

```
https://tpp-thanakon.store
```

**หมายเหตุ:** URL ต้อง:
- เป็น HTTPS
- ไม่มี trailing slash
- ต้อง deploy และ accessible จริง

### Step 6: Deploy และทดสอบ

1. Deploy ไปยัง Vercel:
   ```bash
   npm run build
   vercel --prod
   ```

2. ทดสอบ:
   - เปิด Gallery page
   - คลิก LINE Share บน video
   - กดปุ่ม "ส่งวิดีโอ"
   - เลือก chat/group ที่ต้องการส่ง

---

## 🔧 Troubleshooting

### Error: "shareTargetPicker is not available"

**สาเหตุ:** LIFF ไม่ได้เปิดผ่าน LINE app

**แก้ไข:**
1. ต้องเปิดหน้าเว็บผ่าน LINE app (ไม่ใช่ browser ภายนอก)
2. หรือใช้วิธี fallback (แชร์ link แทน)

### Error: "LIFF initialization failed"

**สาเหตุ:** LIFF ID ไม่ถูกต้อง หรือ endpoint URL ไม่ตรง

**แก้ไข:**
1. ตรวจสอบ LIFF ID ใน console
2. ตรวจสอบ Endpoint URL ตรงกับ domain ที่ใช้
3. ตรวจสอบว่า channel publish แล้ว

### Video ไม่แสดงใน LINE

**สาเหตุ:** URL ของ video ไม่ accessible หรือ format ไม่ถูกต้อง

**ข้อกำหนดของ LINE:**
- Video URL ต้องเป็น HTTPS
- Format: MP4 (H.264)
- ขนาดไม่เกิน 200MB
- Duration ไม่เกิน 1 นาที (สำหรับ preview)

---

## 📱 วิธีการทำงาน

### Native Video Share (แนะนำ)

```typescript
// ส่งเป็น video message
await liff.shareTargetPicker([
  {
    type: "video",
    originalContentUrl: "https://domain.com/video.mp4",
    previewImageUrl: "https://domain.com/thumbnail.jpg"
  }
]);
```

**ผลลัพธ์:** Video จะแสดงพร้อม play button ใน LINE chat

### Flex Message (Alternative)

```typescript
// ส่งเป็น Flex card พร้อมปุ่มดู
await liff.shareTargetPicker([
  {
    type: "flex",
    altText: "🎬 Video Title",
    contents: {
      type: "bubble",
      hero: { type: "image", url: thumbnailUrl },
      body: { type: "box", contents: [{ type: "text", text: "Title" }] },
      footer: {
        type: "box",
        contents: [{
          type: "button",
          action: { type: "uri", label: "ดูวิดีโอ", uri: videoPageUrl }
        }]
      }
    }
  }
]);
```

**ผลลัพธ์:** Card ที่สวยงามพร้อมปุ่ม "ดูวิดีโอ"

---

## 📊 ข้อจำกัด

| Feature | Limit |
|---------|-------|
| Video size | ≤ 200MB |
| Video duration | ≤ 1 minute (for auto-preview) |
| Thumbnail size | ≤ 1MB |
| Messages per share | ≤ 5 messages |
| Characters per text | ≤ 5000 |

---

## 🔗 Resources

- [LINE LIFF Documentation](https://developers.line.biz/en/docs/liff/)
- [shareTargetPicker API](https://developers.line.biz/en/reference/liff/#share-target-picker)
- [Message Types](https://developers.line.biz/en/reference/messaging-api/#message-objects)
- [LINE Developers Console](https://developers.line.biz/console/)

---

## ✅ Checklist

- [ ] สร้าง LINE Login Channel
- [ ] สร้าง LIFF App
- [ ] เปิดใช้งาน shareTargetPicker
- [ ] ตั้งค่า Endpoint URL
- [ ] เพิ่ม LIFF ID ใน environment variables
- [ ] Deploy และทดสอบ

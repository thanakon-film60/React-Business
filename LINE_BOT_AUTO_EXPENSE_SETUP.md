# 📱 ตั้งค่า LINE Bot รับข้อความจาก LINE BK อัตโนมัติ

ระบบนี้จะรับ Forward ข้อความจาก LINE BK แล้วบันทึกลง Database อัตโนมัติ

## 🔄 Flow การทำงาน

```
1. ได้รับแจ้งเตือน LINE BK (เช่น โอนเงิน 120 บาท)
   ↓
2. กดค้างที่ข้อความ → Share → เลือก Bot ของคุณ
   ↓
3. Bot รับข้อความ → Parse ข้อมูล → บันทึก pending_transactions
   ↓
4. Bot ตอบกลับว่าบันทึกสำเร็จ
   ↓
5. เข้าเว็บ /expense/pending → จัดสรรรายการ (ระบุว่าใช้ไปกับอะไร)
```

---

## ⚙️ ขั้นตอนการตั้งค่า

### 1. สร้าง LINE Bot ใน LINE Developers Console

1. ไปที่ https://developers.line.biz/console/
2. Login ด้วย LINE Account
3. สร้าง Provider (ถ้ายังไม่มี)
4. สร้าง Channel → **Messaging API**

### 2. ตั้งค่า Channel

**Basic Settings:**

- Channel name: `Expense Tracker` (หรือชื่อที่ต้องการ)
- Channel description: `บันทึกรายรับ-รายจ่ายอัตโนมัติ`

**Messaging API Settings:**

- Webhook URL: `https://your-domain.com/api/line/webhook`
- ✅ Use webhook: **Enabled**
- ✅ Allow bot to join group chats: **Optional**

### 3. คัดลอก Credentials

ใน LINE Developers Console:

1. **Channel Secret** (Basic Settings tab)
2. **Channel Access Token** (Messaging API tab → Issue)

### 4. ตั้งค่า Environment Variables

เพิ่มใน `.env.local` หรือ Vercel Environment Variables:

```env
LINE_CHANNEL_SECRET=your_channel_secret_here
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here
```

### 5. Deploy และ Verify Webhook

1. Deploy โปรเจค
2. ใน LINE Developers Console → Webhook URL → กด **Verify**
3. ถ้าขึ้น ✅ Success แสดงว่าเชื่อมต่อสำเร็จ

---

## 🧪 ทดสอบ

1. **เพิ่ม Bot เป็นเพื่อน**

   - ใน LINE Developers Console → Messaging API → QR Code
   - ใช้ LINE scan QR Code

2. **ทดสอบส่งข้อความ**

   - Copy ข้อความนี้ส่งให้ Bot:

   ```
   ถอน/โอนเงิน
   120.00 บาท
   โอนเงิน
   20 ธ.ค. 68 15:27

   จากบัญชี บัญชีหลัก(xxx-x-x6114-x)
   ```

3. **Bot ควรตอบกลับ:**

   ```
   📝 บันทึกรายการสำเร็จ! (รอจัดสรร)

   💰 จำนวน: 120.00 บาท
   📋 รายการ: ถอน/โอนเงิน
   🏦 บัญชี: xxx-x-x6114-x

   ⏳ สถานะ: รอระบุว่าใช้ไปกับอะไร
   ```

---

## 📲 วิธีใช้งานจริง

### Forward ข้อความจาก LINE BK:

1. เปิดแชท **LINE BK Alerts**
2. **กดค้าง** ที่ข้อความแจ้งเตือน
3. เลือก **Share** หรือ **ส่งต่อ**
4. เลือก **Bot ของคุณ**
5. กด **ส่ง**

Bot จะบันทึกอัตโนมัติ!

---

## 🗄️ Database

ข้อมูลจะถูกบันทึกใน `pending_transactions`:

| Column               | ค่าที่บันทึก               |
| -------------------- | -------------------------- |
| transaction_type     | ถอน/โอนเงิน, รับเงิน, etc. |
| amount               | 120.00                     |
| account_number       | xxx-x-x6114-x              |
| transaction_datetime | 2025-12-20T15:27:00        |
| source               | LINE BK (Auto)             |
| raw_message          | ข้อความดิบทั้งหมด          |
| status               | pending                    |

---

## 🔗 API Endpoint

**Webhook URL:**

```
POST /api/line/webhook
```

**Headers:**

- `x-line-signature`: HMAC-SHA256 signature

**ทดสอบ:**

```
GET /api/line/webhook
```

Response: `{ "status": "LINE Expense Webhook is running" }`

---

## ❓ FAQ

### Q: ทำไมต้อง Forward ด้วยตัวเอง?

A: LINE BK เป็น Official Account ของธนาคาร ไม่สามารถดึงข้อความโดยตรงได้ด้วยเหตุผลด้านความปลอดภัย

### Q: Bot ไม่ตอบกลับ?

A: ตรวจสอบ:

1. Webhook URL ถูกต้อง
2. Use webhook เปิดอยู่
3. Channel Access Token ยังไม่หมดอายุ

### Q: ข้อความ Parse ไม่ถูก?

A: ระบบจะบันทึกข้อความดิบไว้ใน `raw_message` สามารถแก้ไขได้ในหน้า `/expense/pending`

---

## 📁 Files

```
src/app/api/line/webhook/route.ts    # LINE Webhook handler
src/app/expense/pending/page.tsx     # หน้าจัดสรรรายการ
```

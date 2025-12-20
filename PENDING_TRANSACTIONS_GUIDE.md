# ระบบรายการรอจัดสรร (Pending Transactions)

ระบบนี้ใช้สำหรับบันทึกรายการธุรกรรมจาก LINE BK ที่ยังไม่ได้อธิบายว่าใช้ไปกับอะไร

## 📱 การใช้งาน

### 1. เพิ่มรายการจาก LINE BK

เมื่อได้รับแจ้งเตือนจาก LINE BK เช่น:

```
ถอน/โอนเงิน
120.00 บาท
20 ธ.ค. 68 15:27
จากบัญชี: บัญชีหลัก(xxx-x-x6114-x)
```

**วิธีการ:**

1. ไปที่ `/expense` > คลิก **"รายการรอจัดสรร"**
2. คลิก **"เพิ่มรายการใหม่"**
3. กรอกข้อมูล:
   - ประเภทรายการ: ถอน/โอนเงิน
   - จำนวนเงิน: 120.00
   - เลขบัญชี: xxx-x-x6114-x
   - วันเวลา: 2025-12-20 15:27
4. คลิก **"บันทึก"**

### 2. จัดสรรรายการ (อธิบายว่าใช้ไปกับอะไร)

1. ในหน้า "รายการรอจัดสรร" จะเห็นรายการที่รอจัดสรร
2. คลิก **"จัดสรรรายการ"** ที่รายการที่ต้องการ
3. กรอก:
   - **คำอธิบาย**: เช่น "ค่าอาหารกลางวัน", "ค่าแท็กซี่"
   - **หมวดหมู่**: เลือกหมวดหมู่ที่เหมาะสม
4. คลิก **"บันทึกเป็นรายจ่าย"**
5. ระบบจะ convert รายการนี้ไปยัง expense_transactions

### 3. ข้ามรายการ

สำหรับรายการที่ไม่ต้องการบันทึก (เช่น โอนเงินระหว่างบัญชีตัวเอง):

- คลิก **"ข้าม"** ระบบจะ mark เป็น ignored

---

## 🗄️ Database

### สร้างตาราง

รัน SQL ใน Supabase SQL Editor:

```sql
-- ไฟล์: create-pending-transactions-table.sql

CREATE TABLE IF NOT EXISTS pending_transactions (
    id SERIAL PRIMARY KEY,
    transaction_type VARCHAR(20) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    account_number VARCHAR(50),
    transaction_datetime TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(50) DEFAULT 'LINE BK',
    raw_message TEXT,
    description TEXT,
    category VARCHAR(50),
    assigned_to_transaction_id INTEGER REFERENCES expense_transactions(id),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_pending_transactions_status ON pending_transactions(status);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_created_at ON pending_transactions(created_at DESC);
```

---

## 🔌 API Endpoints

### GET `/api/expense/pending`

ดึงรายการ pending transactions

**Query Parameters:**

- `status`: filter by status (pending, assigned, ignored)
- `limit`: จำนวนรายการ (default: 50)
- `offset`: offset สำหรับ pagination

**Response:**

```json
{
  "success": true,
  "data": [...],
  "summary": {
    "pendingCount": 5,
    "pendingTotal": 1500.00,
    "assignedCount": 10,
    "assignedTotal": 8500.00,
    "ignoredCount": 2
  }
}
```

### POST `/api/expense/pending`

เพิ่มรายการใหม่

**Body:**

```json
{
  "transaction_type": "ถอน/โอนเงิน",
  "amount": 120.0,
  "account_number": "xxx-x-x6114-x",
  "transaction_datetime": "2025-12-20T15:27:00+07:00",
  "source": "LINE BK"
}
```

### PUT `/api/expense/pending/[id]`

อัพเดทหรือ convert รายการ

**Convert เป็น expense:**

```json
{
  "action": "convert",
  "description": "ค่าอาหารกลางวัน",
  "category": "food"
}
```

**ข้ามรายการ:**

```json
{
  "action": "ignore"
}
```

### DELETE `/api/expense/pending?id=[id]`

ลบรายการ

---

## 📊 หน้า UI

- **หน้าหลัก expense**: `/expense` (มีปุ่ม "รายการรอจัดสรร")
- **หน้า pending**: `/expense/pending`

---

## 🔄 Workflow

```
1. ได้รับแจ้งเตือน LINE BK
   ↓
2. บันทึกเป็น pending_transactions
   ↓
3. เมื่อมีเวลา → จัดสรรรายการ (กรอกคำอธิบาย + หมวดหมู่)
   ↓
4. ระบบ convert เป็น expense_transactions
   ↓
5. รายการแสดงในหน้า expense หลัก
```

---

## 📁 Files

```
src/app/api/expense/pending/
├── route.ts              # GET, POST, DELETE
└── [id]/route.ts         # GET, PUT (by ID)

src/app/expense/pending/
└── page.tsx              # หน้า UI

src/styles/expense.css    # CSS (เพิ่ม expense-btn-warning)

create-pending-transactions-table.sql  # SQL สร้างตาราง
```

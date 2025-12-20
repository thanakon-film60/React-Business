"use client";

import React, { useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

// SVG Icons
const UploadIcon = () => (
  <svg
    width="48"
    height="48"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const XIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Categories
const categories = {
  income: [
    { id: "salary", name: "เงินเดือน", icon: "💰" },
    { id: "bonus", name: "โบนัส", icon: "🎁" },
    { id: "freelance", name: "รายได้เสริม", icon: "💻" },
    { id: "investment", name: "การลงทุน", icon: "📈" },
    { id: "other-income", name: "อื่นๆ", icon: "💵" },
  ],
  expense: [
    { id: "food", name: "อาหาร", icon: "🍔" },
    { id: "transport", name: "ยานพาหนะ", icon: "🚗" },
    { id: "utilities", name: "สาธารณูปโภค", icon: "💡" },
    { id: "shopping", name: "ช้อปปิ้ง", icon: "🛒" },
    { id: "entertainment", name: "ความบันเทิง", icon: "🎬" },
    { id: "health", name: "สุขภาพ", icon: "🏥" },
    { id: "education", name: "การศึกษา", icon: "📚" },
    { id: "other-expense", name: "อื่นๆ", icon: "📝" },
  ],
};

function AddTransactionForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialType =
    searchParams.get("type") === "income" ? "income" : "expense";

  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    initialType
  );
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
    note: "",
  });
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const removeSlipImage = () => {
    setSlipPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/expense/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: transactionType,
          title: formData.title,
          amount: formData.amount,
          category: formData.category,
          date: formData.date,
          note: formData.note,
          slip_url: slipPreview || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/expense");
      } else {
        alert("เกิดข้อผิดพลาด: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategories = categories[transactionType];

  return (
    <div className="expense-add-container">
      <div className="expense-card">
        <div className="expense-card-header">
          <h2 className="expense-card-title">เพิ่มรายการใหม่</h2>
        </div>

        <div className="expense-card-body">
          <form onSubmit={handleSubmit}>
            {/* Transaction Type Tabs */}
            <div className="expense-tabs">
              <button
                type="button"
                className={`expense-tab income ${
                  transactionType === "income" ? "active" : ""
                }`}
                onClick={() => {
                  setTransactionType("income");
                  setFormData((prev) => ({ ...prev, category: "" }));
                }}
              >
                💵 รายรับ
              </button>
              <button
                type="button"
                className={`expense-tab expense ${
                  transactionType === "expense" ? "active" : ""
                }`}
                onClick={() => {
                  setTransactionType("expense");
                  setFormData((prev) => ({ ...prev, category: "" }));
                }}
              >
                💸 รายจ่าย
              </button>
            </div>

            {/* Amount */}
            <div className="expense-form-group">
              <label className="expense-form-label">จำนวนเงิน (บาท) *</label>
              <input
                type="number"
                name="amount"
                className="expense-form-input expense-amount-input"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleInputChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            {/* Title */}
            <div className="expense-form-group">
              <label className="expense-form-label">รายละเอียด *</label>
              <input
                type="text"
                name="title"
                className="expense-form-input"
                placeholder="เช่น เงินเดือนประจำเดือน, ค่าอาหารกลางวัน"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Category */}
            <div className="expense-form-group">
              <label className="expense-form-label">หมวดหมู่ *</label>
              <div className="expense-category-grid">
                {currentCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, category: cat.id }))
                    }
                    className={`expense-category-btn ${
                      formData.category === cat.id ? "selected" : ""
                    } ${transactionType}`}
                  >
                    <div className="expense-category-icon">{cat.icon}</div>
                    <div className="expense-category-name">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div className="expense-form-group">
              <label className="expense-form-label">วันที่ *</label>
              <input
                type="date"
                name="date"
                className="expense-form-input"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Slip Upload */}
            <div className="expense-form-group">
              <label className="expense-form-label">แนบสลิป (ถ้ามี)</label>

              {!slipPreview ? (
                <label
                  className={`expense-file-upload ${
                    isDragOver ? "dragover" : ""
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  htmlFor="slip-file-input"
                  style={{ cursor: "pointer" }}
                >
                  <div className="expense-file-upload-icon">
                    <UploadIcon />
                  </div>
                  <p className="expense-file-upload-text">
                    แตะเพื่อถ่ายรูป หรือเลือกจากแกลเลอรี
                  </p>
                  <p className="expense-file-upload-hint">รองรับ PNG, JPG</p>
                  <input
                    id="slip-file-input"
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg"
                    capture="environment"
                    onChange={handleFileInputChange}
                    style={{ display: "none" }}
                  />
                </label>
              ) : (
                <div className="expense-slip-preview">
                  <img src={slipPreview} alt="Preview" />
                  <button
                    type="button"
                    onClick={removeSlipImage}
                    className="expense-slip-remove"
                  >
                    <XIcon />
                  </button>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="expense-form-group">
              <label className="expense-form-label">หมายเหตุเพิ่มเติม</label>
              <textarea
                name="note"
                className="expense-form-textarea"
                placeholder="รายละเอียดเพิ่มเติม..."
                value={formData.note}
                onChange={handleInputChange}
                rows={3}
              />
            </div>

            {/* Submit Buttons */}
            <div className="expense-form-actions">
              <button
                type="button"
                className="expense-btn expense-btn-outline expense-btn-lg"
                onClick={() => router.back()}
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className={`expense-btn expense-btn-lg ${
                  transactionType === "income"
                    ? "expense-btn-success"
                    : "expense-btn-danger"
                }`}
                disabled={
                  isSubmitting ||
                  !formData.amount ||
                  !formData.title ||
                  !formData.category
                }
              >
                {isSubmitting ? (
                  <>บันทึก...</>
                ) : (
                  <>
                    <CheckIcon />
                    บันทึกรายการ
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function AddTransactionPage() {
  return (
    <Suspense
      fallback={
        <div className="expense-add-container">
          <div className="expense-card">
            <div
              className="expense-card-body"
              style={{ textAlign: "center", padding: "2rem" }}
            >
              กำลังโหลด...
            </div>
          </div>
        </div>
      }
    >
      <AddTransactionForm />
    </Suspense>
  );
}

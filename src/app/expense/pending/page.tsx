"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";

// SVG Icons
const ClockIcon = () => (
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
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
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

const PlusIcon = () => (
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const CameraIcon = () => (
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
      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const ArrowLeftIcon = () => (
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
      d="M10 19l-7-7m0 0l7-7m-7 7h18"
    />
  </svg>
);

const RefreshIcon = () => (
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
      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
    />
  </svg>
);

// Format number as Thai Baht
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Category options
const categoryOptions = [
  { value: "food", label: "อาหาร" },
  { value: "transport", label: "ยานพาหนะ" },
  { value: "utilities", label: "สาธารณูปโภค" },
  { value: "shopping", label: "ช้อปปิ้ง" },
  { value: "entertainment", label: "ความบันเทิง" },
  { value: "health", label: "สุขภาพ" },
  { value: "education", label: "การศึกษา" },
  { value: "transfer", label: "โอนเงิน" },
  { value: "salary", label: "เงินเดือน" },
  { value: "bonus", label: "โบนัส" },
  { value: "other-income", label: "รายรับอื่นๆ" },
  { value: "other-expense", label: "รายจ่ายอื่นๆ" },
];

interface PendingTransaction {
  id: number;
  transaction_type: string;
  amount: number;
  account_number: string;
  transaction_datetime: string;
  source: string;
  description: string | null;
  category: string | null;
  status: string;
  created_at: string;
}

interface Summary {
  pendingCount: number;
  pendingTotal: number;
  assignedCount: number;
  assignedTotal: number;
  ignoredCount: number;
}

export default function PendingTransactionsPage() {
  const [transactions, setTransactions] = useState<PendingTransaction[]>([]);
  const [summary, setSummary] = useState<Summary>({
    pendingCount: 0,
    pendingTotal: 0,
    assignedCount: 0,
    assignedTotal: 0,
    ignoredCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>("pending");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    description: "",
    category: "",
    type: "expense" as "income" | "expense",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSlipUpload, setShowSlipUpload] = useState(false);
  const [slipProcessing, setSlipProcessing] = useState(false);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [addForm, setAddForm] = useState({
    transaction_type: "ถอน/โอนเงิน",
    amount: "",
    account_number: "",
    transaction_datetime: new Date().toISOString().slice(0, 16),
  });

  const fetchTransactions = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/expense/pending?status=${filter}`);
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error fetching pending transactions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleConvert = async (id: number) => {
    if (!editForm.description) {
      alert("กรุณาระบุคำอธิบาย");
      return;
    }

    try {
      const response = await fetch(`/api/expense/pending/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "convert",
          description: editForm.description,
          category:
            editForm.category ||
            (editForm.type === "income" ? "other-income" : "other-expense"),
          type: editForm.type,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setEditingId(null);
        setEditForm({ description: "", category: "", type: "expense" });
        fetchTransactions();
        alert(
          editForm.type === "income"
            ? "บันทึกเป็นรายรับสำเร็จ!"
            : "บันทึกเป็นรายจ่ายสำเร็จ!"
        );
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error converting transaction:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const handleIgnore = async (id: number) => {
    if (!confirm("ต้องการข้ามรายการนี้หรือไม่?")) return;

    try {
      const response = await fetch(`/api/expense/pending/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "ignore" }),
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error ignoring transaction:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;

    try {
      const response = await fetch(`/api/expense/pending?id=${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      if (data.success) {
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.amount || !addForm.transaction_datetime) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    try {
      const response = await fetch("/api/expense/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaction_type: addForm.transaction_type,
          amount: parseFloat(addForm.amount),
          account_number: addForm.account_number,
          transaction_datetime: new Date(
            addForm.transaction_datetime
          ).toISOString(),
        }),
      });
      const data = await response.json();
      if (data.success) {
        setShowAddForm(false);
        setAddForm({
          transaction_type: "ถอน/โอนเงิน",
          amount: "",
          account_number: "",
          transaction_datetime: new Date().toISOString().slice(0, 16),
        });
        fetchTransactions();
        alert("เพิ่มรายการสำเร็จ!");
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  // Handle slip upload
  const handleSlipUpload = async (file: File) => {
    setSlipProcessing(true);

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setSlipPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const formData = new FormData();
      formData.append("slip", file);

      const response = await fetch("/api/expense/slip", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setShowSlipUpload(false);
        setSlipPreview(null);
        fetchTransactions();
        alert(
          `✅ บันทึกสำเร็จ!\n💰 ${data.data.amount.toLocaleString()} บาท\n📋 ${
            data.data.transaction_type
          }`
        );
      } else if (data.needsManualInput) {
        // OCR ไม่สำเร็จ ให้กรอกเอง
        alert(
          `ไม่สามารถอ่านสลิปอัตโนมัติได้\nกรุณากรอกข้อมูลเอง\n\nข้อความที่อ่านได้:\n${
            data.extracted_text || "ไม่พบ"
          }`
        );
        setShowSlipUpload(false);
        setShowAddForm(true);
      } else {
        alert(data.error || "เกิดข้อผิดพลาด");
      }
    } catch (error) {
      console.error("Error uploading slip:", error);
      alert("เกิดข้อผิดพลาดในการอัพโหลด");
    } finally {
      setSlipProcessing(false);
    }
  };

  const formatDateTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="badge badge-warning">รอจัดสรร</span>;
      case "assigned":
        return <span className="badge badge-success">จัดสรรแล้ว</span>;
      case "ignored":
        return <span className="badge badge-secondary">ข้าม</span>;
      default:
        return <span className="badge">{status}</span>;
    }
  };

  return (
    <div className="pending-transactions-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-left">
          <Link href="/expense" className="back-btn">
            <ArrowLeftIcon />
          </Link>
          <div>
            <h1>รายการรอจัดสรร</h1>
            <p className="subtitle">บันทึกรายการจาก LINE BK ที่รอการอธิบาย</p>
          </div>
        </div>
        <div className="header-actions">
          <button
            onClick={fetchTransactions}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            <RefreshIcon />
          </button>
          <button
            onClick={() => setShowSlipUpload(true)}
            className="btn btn-success"
          >
            <CameraIcon />
            สแกนสลิป
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <PlusIcon />
            กรอกเอง
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div
          className="summary-card pending"
          onClick={() => setFilter("pending")}
        >
          <div className="summary-icon">
            <ClockIcon />
          </div>
          <div className="summary-info">
            <span className="summary-label">รอจัดสรร</span>
            <span className="summary-count">{summary.pendingCount} รายการ</span>
            <span className="summary-amount">
              {formatCurrency(summary.pendingTotal)}
            </span>
          </div>
        </div>
        <div
          className="summary-card assigned"
          onClick={() => setFilter("assigned")}
        >
          <div className="summary-icon">
            <CheckIcon />
          </div>
          <div className="summary-info">
            <span className="summary-label">จัดสรรแล้ว</span>
            <span className="summary-count">
              {summary.assignedCount} รายการ
            </span>
            <span className="summary-amount">
              {formatCurrency(summary.assignedTotal)}
            </span>
          </div>
        </div>
        <div
          className="summary-card ignored"
          onClick={() => setFilter("ignored")}
        >
          <div className="summary-icon">
            <XIcon />
          </div>
          <div className="summary-info">
            <span className="summary-label">ข้าม</span>
            <span className="summary-count">{summary.ignoredCount} รายการ</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={`tab ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          รอจัดสรร
        </button>
        <button
          className={`tab ${filter === "assigned" ? "active" : ""}`}
          onClick={() => setFilter("assigned")}
        >
          จัดสรรแล้ว
        </button>
        <button
          className={`tab ${filter === "ignored" ? "active" : ""}`}
          onClick={() => setFilter("ignored")}
        >
          ข้าม
        </button>
      </div>

      {/* Slip Upload Modal */}
      {showSlipUpload && (
        <div
          className="modal-overlay"
          onClick={() => !slipProcessing && setShowSlipUpload(false)}
        >
          <div
            className="modal slip-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>📷 สแกนสลิป</h2>
            <p className="modal-subtitle">อัพโหลดรูปสลิปเพื่อบันทึกอัตโนมัติ</p>

            {slipPreview ? (
              <div className="slip-preview">
                <img src={slipPreview} alt="Slip preview" />
                {slipProcessing && (
                  <div className="processing-overlay">
                    <div className="spinner"></div>
                    <p>กำลังอ่านสลิป...</p>
                  </div>
                )}
              </div>
            ) : (
              <label className="upload-area">
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleSlipUpload(file);
                  }}
                  disabled={slipProcessing}
                />
                <div className="upload-content">
                  <CameraIcon />
                  <p>แตะเพื่อถ่ายรูป หรือเลือกจากแกลเลอรี</p>
                  <span>รองรับ PNG, JPG</span>
                </div>
              </label>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowSlipUpload(false);
                  setSlipPreview(null);
                }}
                disabled={slipProcessing}
              >
                ยกเลิก
              </button>
              {slipPreview && !slipProcessing && (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSlipPreview(null)}
                >
                  เลือกรูปใหม่
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Form Modal */}
      {showAddForm && (
        <div className="modal-overlay" onClick={() => setShowAddForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>เพิ่มรายการจาก LINE BK</h2>
            <form onSubmit={handleAddTransaction}>
              <div className="form-group">
                <label>ประเภทรายการ</label>
                <select
                  value={addForm.transaction_type}
                  onChange={(e) =>
                    setAddForm({ ...addForm, transaction_type: e.target.value })
                  }
                >
                  <option value="ถอน/โอนเงิน">ถอน/โอนเงิน</option>
                  <option value="รับเงิน">รับเงิน</option>
                  <option value="จ่ายบิล">จ่ายบิล</option>
                  <option value="เติมเงิน">เติมเงิน</option>
                  <option value="ซื้อสินค้า">ซื้อสินค้า</option>
                </select>
              </div>
              <div className="form-group">
                <label>จำนวนเงิน (บาท) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={addForm.amount}
                  onChange={(e) =>
                    setAddForm({ ...addForm, amount: e.target.value })
                  }
                  placeholder="120.00"
                  required
                />
              </div>
              <div className="form-group">
                <label>เลขบัญชี</label>
                <input
                  type="text"
                  value={addForm.account_number}
                  onChange={(e) =>
                    setAddForm({ ...addForm, account_number: e.target.value })
                  }
                  placeholder="xxx-x-x6114-x"
                />
              </div>
              <div className="form-group">
                <label>วันเวลาทำรายการ *</label>
                <input
                  type="datetime-local"
                  value={addForm.transaction_datetime}
                  onChange={(e) =>
                    setAddForm({
                      ...addForm,
                      transaction_datetime: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  ยกเลิก
                </button>
                <button type="submit" className="btn btn-primary">
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Transaction List */}
      <div className="transaction-list">
        {isLoading ? (
          <div className="loading">กำลังโหลด...</div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <ClockIcon />
            <p>
              ไม่มีรายการ
              {filter === "pending"
                ? "รอจัดสรร"
                : filter === "assigned"
                ? "ที่จัดสรรแล้ว"
                : "ที่ข้าม"}
            </p>
          </div>
        ) : (
          transactions.map((tx) => (
            <div key={tx.id} className={`transaction-card ${tx.status}`}>
              <div className="transaction-header">
                <div className="transaction-type">
                  <span className="type-badge">{tx.transaction_type}</span>
                  {getStatusBadge(tx.status)}
                </div>
                <div className="transaction-amount">
                  {formatCurrency(tx.amount)}
                </div>
              </div>

              <div className="transaction-details">
                <div className="detail-row">
                  <span className="label">วันเวลา:</span>
                  <span>{formatDateTime(tx.transaction_datetime)}</span>
                </div>
                {tx.account_number && (
                  <div className="detail-row">
                    <span className="label">บัญชี:</span>
                    <span>{tx.account_number}</span>
                  </div>
                )}
                {tx.description && (
                  <div className="detail-row">
                    <span className="label">คำอธิบาย:</span>
                    <span>{tx.description}</span>
                  </div>
                )}
                {tx.category && (
                  <div className="detail-row">
                    <span className="label">หมวดหมู่:</span>
                    <span>
                      {categoryOptions.find((c) => c.value === tx.category)
                        ?.label || tx.category}
                    </span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">แหล่งที่มา:</span>
                  <span>{tx.source}</span>
                </div>
              </div>

              {/* Edit Form (for pending items) */}
              {editingId === tx.id && tx.status === "pending" && (
                <div className="edit-form">
                  {/* Type Selection */}
                  <div className="form-group">
                    <label>ประเภท *</label>
                    <div className="type-toggle">
                      <button
                        type="button"
                        className={`type-btn expense ${
                          editForm.type === "expense" ? "active" : ""
                        }`}
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            type: "expense",
                            category: "",
                          })
                        }
                      >
                        💸 รายจ่าย
                      </button>
                      <button
                        type="button"
                        className={`type-btn income ${
                          editForm.type === "income" ? "active" : ""
                        }`}
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            type: "income",
                            category: "",
                          })
                        }
                      >
                        💰 รายรับ
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>คำอธิบาย (ใช้ไปกับอะไร) *</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      placeholder="เช่น ค่าอาหารกลางวัน, ค่าแท็กซี่"
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>หมวดหมู่</label>
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({ ...editForm, category: e.target.value })
                      }
                    >
                      <option value="">-- เลือกหมวดหมู่ --</option>
                      {editForm.type === "expense" ? (
                        <>
                          <option value="food">🍔 อาหาร</option>
                          <option value="transport">🚗 ยานพาหนะ</option>
                          <option value="utilities">💡 สาธารณูปโภค</option>
                          <option value="shopping">🛒 ช้อปปิ้ง</option>
                          <option value="entertainment">🎬 ความบันเทิง</option>
                          <option value="health">🏥 สุขภาพ</option>
                          <option value="education">📚 การศึกษา</option>
                          <option value="other-expense">📝 อื่นๆ</option>
                        </>
                      ) : (
                        <>
                          <option value="salary">💰 เงินเดือน</option>
                          <option value="bonus">🎁 โบนัส</option>
                          <option value="freelance">💻 รายได้เสริม</option>
                          <option value="investment">📈 การลงทุน</option>
                          <option value="other-income">💵 อื่นๆ</option>
                        </>
                      )}
                    </select>
                  </div>
                  <div className="edit-actions">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => setEditingId(null)}
                    >
                      ยกเลิก
                    </button>
                    <button
                      className={`btn btn-sm ${
                        editForm.type === "income"
                          ? "btn-income"
                          : "btn-success"
                      }`}
                      onClick={() => handleConvert(tx.id)}
                    >
                      <CheckIcon />
                      {editForm.type === "income"
                        ? "บันทึกเป็นรายรับ"
                        : "บันทึกเป็นรายจ่าย"}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {tx.status === "pending" && editingId !== tx.id && (
                <div className="transaction-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setEditingId(tx.id);
                      setEditForm({
                        description: tx.description || "",
                        category: tx.category || "",
                        type: "expense",
                      });
                    }}
                  >
                    จัดสรรรายการ
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleIgnore(tx.id)}
                  >
                    ข้าม
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(tx.id)}
                  >
                    ลบ
                  </button>
                </div>
              )}

              {tx.status !== "pending" && (
                <div className="transaction-actions">
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(tx.id)}
                  >
                    ลบ
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .pending-transactions-page {
          padding: 20px;
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .back-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #333;
          color: white;
          text-decoration: none;
        }

        .page-header h1 {
          margin: 0;
          font-size: 1.5rem;
          color: white;
        }

        .subtitle {
          margin: 0;
          color: #888;
          font-size: 0.875rem;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .summary-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }

        .summary-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          gap: 16px;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .summary-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .summary-card.pending {
          border-left: 4px solid #f59e0b;
        }
        .summary-card.assigned {
          border-left: 4px solid #10b981;
        }
        .summary-card.ignored {
          border-left: 4px solid #6b7280;
        }

        .summary-icon {
          width: 48px;
          height: 48px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .summary-info {
          display: flex;
          flex-direction: column;
        }

        .summary-label {
          color: #888;
          font-size: 0.875rem;
        }

        .summary-count {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
        }

        .summary-amount {
          color: #f59e0b;
          font-weight: 500;
        }

        .filter-tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          border-bottom: 1px solid #333;
          padding-bottom: 8px;
        }

        .tab {
          padding: 8px 16px;
          border: none;
          background: transparent;
          color: #888;
          cursor: pointer;
          border-radius: 8px 8px 0 0;
          transition: all 0.2s;
        }

        .tab:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .tab.active {
          color: white;
          background: #333;
        }

        .transaction-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .transaction-card {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 16px;
          border-left: 4px solid #f59e0b;
        }

        .transaction-card.assigned {
          border-left-color: #10b981;
        }

        .transaction-card.ignored {
          border-left-color: #6b7280;
          opacity: 0.7;
        }

        .transaction-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .transaction-type {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .type-badge {
          background: #333;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .badge-warning {
          background: rgba(245, 158, 11, 0.2);
          color: #f59e0b;
        }

        .badge-success {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
        }

        .badge-secondary {
          background: rgba(107, 114, 128, 0.2);
          color: #9ca3af;
        }

        .transaction-amount {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ef4444;
        }

        .transaction-details {
          margin-bottom: 12px;
        }

        .detail-row {
          display: flex;
          gap: 8px;
          margin-bottom: 4px;
          font-size: 0.875rem;
        }

        .detail-row .label {
          color: #888;
          min-width: 80px;
        }

        .edit-form {
          background: rgba(0, 0, 0, 0.2);
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 12px;
        }

        .type-toggle {
          display: flex;
          gap: 8px;
        }

        .type-btn {
          flex: 1;
          padding: 10px;
          border: 2px solid #333;
          border-radius: 8px;
          background: #0d0d1a;
          color: #888;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .type-btn.expense.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
          color: #ef4444;
        }

        .type-btn.income.active {
          border-color: #22c55e;
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }

        .type-btn:hover:not(.active) {
          border-color: #555;
          color: #ccc;
        }

        .btn-income {
          background: #22c55e;
          color: white;
        }

        .btn-income:hover {
          background: #16a34a;
        }

        .form-group {
          margin-bottom: 12px;
        }

        .form-group label {
          display: block;
          margin-bottom: 4px;
          color: #888;
          font-size: 0.875rem;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #333;
          border-radius: 8px;
          background: #0d0d1a;
          color: white;
          font-size: 1rem;
        }

        .form-group input:focus,
        .form-group select:focus {
          outline: none;
          border-color: #6366f1;
        }

        .edit-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .transaction-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-sm {
          padding: 6px 12px;
          font-size: 0.8rem;
        }

        .btn-primary {
          background: #6366f1;
          color: white;
        }

        .btn-primary:hover {
          background: #5457e5;
        }

        .btn-secondary {
          background: #333;
          color: white;
        }

        .btn-secondary:hover {
          background: #444;
        }

        .btn-success {
          background: #10b981;
          color: white;
        }

        .btn-success:hover {
          background: #0ea572;
        }

        .btn-warning {
          background: #f59e0b;
          color: black;
        }

        .btn-warning:hover {
          background: #d97706;
        }

        .btn-danger {
          background: #ef4444;
          color: white;
        }

        .btn-danger:hover {
          background: #dc2626;
        }

        .loading {
          text-align: center;
          padding: 40px;
          color: #888;
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          color: #888;
        }

        .empty-state svg {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          opacity: 0.5;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }

        .modal {
          background: #1a1a2e;
          border-radius: 12px;
          padding: 24px;
          width: 100%;
          max-width: 400px;
        }

        .modal h2 {
          margin: 0 0 20px;
          color: white;
        }

        .modal-subtitle {
          color: #888;
          margin: -10px 0 20px;
          font-size: 0.875rem;
        }

        .slip-modal {
          max-width: 450px;
        }

        .upload-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 2px dashed #444;
          border-radius: 12px;
          padding: 40px 20px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upload-area:hover {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .upload-area input {
          display: none;
        }

        .upload-content {
          text-align: center;
          color: #888;
        }

        .upload-content svg {
          width: 48px;
          height: 48px;
          margin-bottom: 16px;
          color: #10b981;
        }

        .upload-content p {
          margin: 0 0 8px;
          color: white;
        }

        .upload-content span {
          font-size: 0.75rem;
        }

        .slip-preview {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          margin-bottom: 16px;
        }

        .slip-preview img {
          width: 100%;
          max-height: 300px;
          object-fit: contain;
          background: #0d0d1a;
        }

        .processing-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: white;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid #333;
          border-top-color: #10b981;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 12px;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .form-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          margin-top: 20px;
        }

        @media (max-width: 600px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
          }

          .header-actions .btn {
            flex: 1;
            justify-content: center;
          }

          .summary-cards {
            grid-template-columns: 1fr;
          }

          .transaction-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }

          .transaction-actions {
            flex-direction: column;
          }

          .transaction-actions .btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

"use client";

import React, { useState } from "react";

// SVG Icons
const SearchIcon = () => (
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
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const FilterIcon = () => (
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
      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
    />
  </svg>
);

const ArrowDownIcon = () => (
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
      d="M19 14l-7 7m0 0l-7-7m7 7V3"
    />
  </svg>
);

const ArrowUpIcon = () => (
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
      d="M5 10l7-7m0 0l7 7m-7-7v18"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const TrashIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    width="16"
    height="16"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg
    width="80"
    height="80"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
);

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Sample data
const sampleTransactions = [
  {
    id: 1,
    type: "income",
    title: "เงินเดือนประจำเดือน",
    category: "เงินเดือน",
    amount: 45000,
    date: "2024-12-19",
    hasSlip: true,
    note: "เงินเดือนเดือนธันวาคม",
  },
  {
    id: 2,
    type: "expense",
    title: "ค่าอาหารกลางวัน",
    category: "อาหาร",
    amount: 150,
    date: "2024-12-19",
    hasSlip: false,
    note: "",
  },
  {
    id: 3,
    type: "expense",
    title: "ค่าน้ำมันรถ",
    category: "ยานพาหนะ",
    amount: 1200,
    date: "2024-12-18",
    hasSlip: true,
    note: "เติมน้ำมัน 40 ลิตร",
  },
  {
    id: 4,
    type: "income",
    title: "รายได้เสริมจากงานฟรีแลนซ์",
    category: "รายได้เสริม",
    amount: 8500,
    date: "2024-12-17",
    hasSlip: true,
    note: "งานออกแบบเว็บไซต์",
  },
  {
    id: 5,
    type: "expense",
    title: "ค่าไฟฟ้าประจำเดือน",
    category: "สาธารณูปโภค",
    amount: 1850,
    date: "2024-12-16",
    hasSlip: true,
    note: "ค่าไฟเดือนพฤศจิกายน",
  },
  {
    id: 6,
    type: "expense",
    title: "ค่าน้ำประปา",
    category: "สาธารณูปโภค",
    amount: 350,
    date: "2024-12-15",
    hasSlip: true,
    note: "",
  },
  {
    id: 7,
    type: "expense",
    title: "ค่าอินเทอร์เน็ต",
    category: "สาธารณูปโภค",
    amount: 599,
    date: "2024-12-14",
    hasSlip: false,
    note: "แพ็กเกจ 500Mbps",
  },
  {
    id: 8,
    type: "income",
    title: "ดอกเบี้ยเงินฝาก",
    category: "การลงทุน",
    amount: 250,
    date: "2024-12-13",
    hasSlip: false,
    note: "",
  },
];

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = [...new Set(sampleTransactions.map((t) => t.category))];

  const filteredTransactions = sampleTransactions.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || t.type === filterType;
    const matchesCategory =
      filterCategory === "all" || t.category === filterCategory;
    return matchesSearch && matchesType && matchesCategory;
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const totalIncome = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div>
      {/* Search and Filters */}
      <div
        className="expense-card"
        style={{ marginBottom: "var(--exp-space-6)" }}
      >
        <div className="expense-card-body">
          <div className="expense-search-row">
            <div className="expense-search-wrapper">
              <SearchIcon />
              <input
                type="text"
                className="expense-form-input expense-search-input"
                placeholder="ค้นหารายการ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className={`expense-btn ${
                showFilters ? "expense-btn-primary" : "expense-btn-outline"
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon />
              ตัวกรอง
            </button>
          </div>

          {showFilters && (
            <div className="expense-filter-options">
              <div className="expense-filter-item">
                <label className="expense-form-label">ประเภท</label>
                <select
                  className="expense-form-select"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">ทั้งหมด</option>
                  <option value="income">รายรับ</option>
                  <option value="expense">รายจ่าย</option>
                </select>
              </div>

              <div className="expense-filter-item">
                <label className="expense-form-label">หมวดหมู่</label>
                <select
                  className="expense-form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">ทั้งหมด</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div
                className="expense-filter-item"
                style={{ alignSelf: "flex-end" }}
              >
                <button
                  className="expense-btn expense-btn-outline"
                  onClick={() => {
                    setFilterType("all");
                    setFilterCategory("all");
                    setSearchTerm("");
                  }}
                >
                  ล้างตัวกรอง
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Summary Bar */}
      <div className="expense-summary-bar">
        <div className="expense-summary-tag income">
          รายรับ: {formatCurrency(totalIncome)}
        </div>
        <div className="expense-summary-tag expense">
          รายจ่าย: {formatCurrency(totalExpense)}
        </div>
        <div className="expense-summary-tag neutral">
          จำนวน: {filteredTransactions.length} รายการ
        </div>
      </div>

      {/* Transactions List */}
      <div className="expense-card">
        <div className="expense-card-header">
          <h2 className="expense-card-title">รายการทั้งหมด</h2>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="expense-empty-state">
            <EmptyIcon />
            <h3 className="expense-empty-title">ไม่พบรายการ</h3>
            <p className="expense-empty-text">
              ลองเปลี่ยนคำค้นหาหรือตัวกรองของคุณ
            </p>
          </div>
        ) : (
          <ul className="expense-transaction-list">
            {filteredTransactions.map((transaction) => (
              <li key={transaction.id} className="expense-transaction-item">
                <div className={`expense-transaction-icon ${transaction.type}`}>
                  {transaction.type === "income" ? (
                    <ArrowDownIcon />
                  ) : (
                    <ArrowUpIcon />
                  )}
                </div>

                <div className="expense-transaction-info">
                  <div className="expense-transaction-title">
                    {transaction.title}
                  </div>
                  <div className="expense-transaction-meta">
                    <span className="expense-transaction-category">
                      {transaction.category}
                    </span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.note && (
                      <>
                        <span>•</span>
                        <span className="expense-transaction-note">
                          {transaction.note}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="expense-transaction-actions">
                  {transaction.hasSlip && (
                    <button className="expense-action-btn" title="ดูสลิป">
                      <ImageIcon />
                    </button>
                  )}
                  <button className="expense-action-btn" title="แก้ไข">
                    <EditIcon />
                  </button>
                  <button className="expense-action-btn delete" title="ลบ">
                    <TrashIcon />
                  </button>
                </div>

                <div
                  className={`expense-transaction-amount ${transaction.type}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

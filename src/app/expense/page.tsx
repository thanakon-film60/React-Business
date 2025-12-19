"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

// SVG Icons
const TrendUpIcon = () => (
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
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
    />
  </svg>
);

const TrendDownIcon = () => (
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
      d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
    />
  </svg>
);

const ArrowDownIcon = () => (
  <svg
    width="24"
    height="24"
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
    width="24"
    height="24"
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

const WalletIcon = () => (
  <svg
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h14a2 2 0 002-2v-3M3 10v7m18-7v7m-5-3.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
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

const FolderIcon = ({ style }: { style?: React.CSSProperties }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    style={style}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
    />
  </svg>
);

// Format number as Thai Baht
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Category mapping
const categoryMap: Record<string, string> = {
  salary: "เงินเดือน",
  bonus: "โบนัส",
  freelance: "รายได้เสริม",
  investment: "การลงทุน",
  "other-income": "อื่นๆ",
  food: "อาหาร",
  transport: "ยานพาหนะ",
  utilities: "สาธารณูปโภค",
  shopping: "ช้อปปิ้ง",
  entertainment: "ความบันเทิง",
  health: "สุขภาพ",
  education: "การศึกษา",
  "other-expense": "อื่นๆ",
};

interface Transaction {
  id: number;
  type: string;
  title: string;
  category: string;
  amount: number;
  date: string;
  slip_url?: string;
  note?: string;
}

interface Totals {
  income: number;
  expense: number;
  balance: number;
}

export default function ExpenseDashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState<Totals>({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/expense/transactions");
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data);
        setTotals(data.totals);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ต้องการลบรายการนี้หรือไม่?")) return;

    try {
      const response = await fetch(`/api/expense/transactions?id=${id}`, {
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

  const totalIncome = totals.income;
  const totalExpense = totals.expense;
  const balance = totals.balance;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("th-TH", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="expense-summary-grid">
        {/* Income Card */}
        <div className="expense-summary-card">
          <div className="expense-summary-card-header">
            <span className="expense-summary-card-label">รายรับทั้งหมด</span>
            <div className="expense-summary-card-icon income">
              <ArrowDownIcon />
            </div>
          </div>
          <div className="expense-summary-card-value income">
            {formatCurrency(totalIncome)}
          </div>
          <div className="expense-summary-card-change positive">
            <TrendUpIcon />
            <span>+12.5% จากเดือนที่แล้ว</span>
          </div>
        </div>

        {/* Expense Card */}
        <div className="expense-summary-card">
          <div className="expense-summary-card-header">
            <span className="expense-summary-card-label">รายจ่ายทั้งหมด</span>
            <div className="expense-summary-card-icon expense">
              <ArrowUpIcon />
            </div>
          </div>
          <div className="expense-summary-card-value expense">
            {formatCurrency(totalExpense)}
          </div>
          <div className="expense-summary-card-change negative">
            <TrendDownIcon />
            <span>-3.2% จากเดือนที่แล้ว</span>
          </div>
        </div>

        {/* Balance Card */}
        <div className="expense-summary-card">
          <div className="expense-summary-card-header">
            <span className="expense-summary-card-label">ยอดคงเหลือ</span>
            <div className="expense-summary-card-icon balance">
              <WalletIcon />
            </div>
          </div>
          <div className="expense-summary-card-value">
            {formatCurrency(balance)}
          </div>
          <div className="expense-summary-card-change positive">
            <TrendUpIcon />
            <span>สถานะการเงินดี</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="expense-quick-actions">
        <Link
          href="/expense/add?type=income"
          className="expense-btn expense-btn-success expense-btn-lg"
        >
          <PlusIcon />
          เพิ่มรายรับ
        </Link>
        <Link
          href="/expense/add?type=expense"
          className="expense-btn expense-btn-danger expense-btn-lg"
        >
          <PlusIcon />
          เพิ่มรายจ่าย
        </Link>
      </div>

      {/* Recent Transactions */}
      <div className="expense-card">
        <div className="expense-card-header">
          <h2 className="expense-card-title">รายการล่าสุด</h2>
          <Link
            href="/expense/transactions"
            className="expense-btn expense-btn-outline"
          >
            ดูทั้งหมด
          </Link>
        </div>

        <ul className="expense-transaction-list">
          {isLoading ? (
            <li
              className="expense-transaction-item"
              style={{ justifyContent: "center", padding: "2rem" }}
            >
              กำลังโหลด...
            </li>
          ) : transactions.length === 0 ? (
            <li
              className="expense-transaction-item"
              style={{ justifyContent: "center", padding: "2rem" }}
            >
              ยังไม่มีรายการ
            </li>
          ) : (
            transactions.slice(0, 5).map((transaction) => (
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
                      <FolderIcon
                        style={{ width: 12, height: 12, marginRight: 4 }}
                      />
                      {categoryMap[transaction.category] ||
                        transaction.category}
                    </span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>

                {transaction.slip_url && (
                  <div className="expense-slip-badge">มีสลิป</div>
                )}

                <div
                  className={`expense-transaction-amount ${transaction.type}`}
                >
                  {transaction.type === "income" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>

                <button
                  onClick={() => handleDelete(transaction.id)}
                  className="expense-btn expense-btn-outline"
                  style={{
                    marginLeft: 8,
                    padding: "4px 8px",
                    fontSize: "12px",
                  }}
                >
                  ลบ
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

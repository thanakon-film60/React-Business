-- Expense Tracker Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Create expense_transactions table
CREATE TABLE IF NOT EXISTS expense_transactions (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK (type IN ('income', 'expense')),
    title VARCHAR(255) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    note TEXT,
    slip_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expense_transactions_type ON expense_transactions(type);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_date ON expense_transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_expense_transactions_category ON expense_transactions(category);

-- Enable Row Level Security (optional - for multi-user support)
-- ALTER TABLE expense_transactions ENABLE ROW LEVEL SECURITY;

-- Sample data (optional)
-- INSERT INTO expense_transactions (type, title, amount, category, date, note) VALUES
-- ('income', 'เงินเดือนเดือน ธ.ค.', 50000.00, 'salary', '2025-12-01', 'เงินเดือนประจำเดือน'),
-- ('expense', 'ค่าอาหารกลางวัน', 150.00, 'food', '2025-12-19', 'อาหารกลางวันที่ร้านใกล้บ้าน'),
-- ('expense', 'ค่าน้ำมัน', 1500.00, 'transport', '2025-12-18', 'เติมน้ำมันรถ');

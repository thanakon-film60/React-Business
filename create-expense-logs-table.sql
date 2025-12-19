-- Expense Logs Table for tracking LINE BK transactions
-- Run this in Supabase SQL Editor

-- Create expense_logs table for detailed logging
CREATE TABLE IF NOT EXISTS expense_logs (
    id SERIAL PRIMARY KEY,
    transaction_id INTEGER REFERENCES expense_transactions(id) ON DELETE CASCADE,
    user_id VARCHAR(100),
    source VARCHAR(50) DEFAULT 'line_bk',
    raw_message TEXT,
    parsed_type VARCHAR(10),
    parsed_amount DECIMAL(12, 2),
    account_info VARCHAR(100),
    transaction_time TIMESTAMP WITH TIME ZONE,
    ip_address VARCHAR(50),
    status VARCHAR(20) DEFAULT 'success',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_expense_logs_user_id ON expense_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_expense_logs_created_at ON expense_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_expense_logs_transaction_id ON expense_logs(transaction_id);

-- Monthly summary view
CREATE OR REPLACE VIEW expense_monthly_summary AS
SELECT 
    DATE_TRUNC('month', date) as month,
    type,
    category,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM expense_transactions
GROUP BY DATE_TRUNC('month', date), type, category
ORDER BY month DESC, type, category;

-- Daily summary view
CREATE OR REPLACE VIEW expense_daily_summary AS
SELECT 
    date,
    type,
    COUNT(*) as transaction_count,
    SUM(amount) as total_amount
FROM expense_transactions
GROUP BY date, type
ORDER BY date DESC;

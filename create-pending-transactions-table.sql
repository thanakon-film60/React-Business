-- Pending Transactions Table for LINE BK alerts
-- บันทึกรายการธุรกรรมจาก LINE BK ที่รอการอธิบายว่าใช้ไปกับอะไร
-- Run this in Supabase SQL Editor

-- Create pending_transactions table
CREATE TABLE IF NOT EXISTS pending_transactions (
    id SERIAL PRIMARY KEY,
    
    -- ข้อมูลจาก LINE BK
    transaction_type VARCHAR(20) NOT NULL, -- 'ถอน/โอนเงิน', 'รับเงิน', 'จ่ายบิล' etc.
    amount DECIMAL(12, 2) NOT NULL,
    account_number VARCHAR(50), -- xxx-x-x6114-x
    transaction_datetime TIMESTAMP WITH TIME ZONE NOT NULL, -- วันเวลาที่ทำรายการ
    source VARCHAR(50) DEFAULT 'LINE BK', -- แหล่งที่มา
    raw_message TEXT, -- ข้อความดิบจาก LINE (ถ้ามี)
    
    -- ข้อมูลที่ผู้ใช้จะเพิ่มภายหลัง
    description TEXT, -- อธิบายว่าใช้ไปกับอะไร
    category VARCHAR(50), -- หมวดหมู่ เช่น food, transport, utilities
    assigned_to_transaction_id INTEGER REFERENCES expense_transactions(id), -- เชื่อมกับ expense_transactions ถ้า convert แล้ว
    
    -- สถานะ
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'assigned', 'ignored'
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_at TIMESTAMP WITH TIME ZONE -- วันที่จัดสรรรายการ
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_pending_transactions_status ON pending_transactions(status);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_created_at ON pending_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_transaction_datetime ON pending_transactions(transaction_datetime DESC);
CREATE INDEX IF NOT EXISTS idx_pending_transactions_amount ON pending_transactions(amount);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pending_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at
DROP TRIGGER IF EXISTS trigger_pending_transactions_updated_at ON pending_transactions;
CREATE TRIGGER trigger_pending_transactions_updated_at
    BEFORE UPDATE ON pending_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_pending_transactions_updated_at();

-- View for pending transactions summary
CREATE OR REPLACE VIEW pending_transactions_summary AS
SELECT 
    COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
    COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as pending_total,
    COUNT(*) FILTER (WHERE status = 'assigned') as assigned_count,
    COALESCE(SUM(amount) FILTER (WHERE status = 'assigned'), 0) as assigned_total,
    COUNT(*) FILTER (WHERE status = 'ignored') as ignored_count
FROM pending_transactions;

-- Sample insert (for testing)
-- INSERT INTO pending_transactions (transaction_type, amount, account_number, transaction_datetime, source)
-- VALUES ('ถอน/โอนเงิน', 120.00, 'xxx-x-x6114-x', '2025-12-20 15:27:00+07', 'LINE BK');

import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";

// GET - ดึงรายการ pending transactions ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status"); // pending, assigned, ignored
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    let query = `
      SELECT * FROM pending_transactions 
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ` ORDER BY transaction_datetime DESC, created_at DESC`;
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(parseInt(offset));
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // Get summary
    const summaryResult = await pool.query(`
      SELECT 
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'pending'), 0) as pending_total,
        COUNT(*) FILTER (WHERE status = 'assigned') as assigned_count,
        COALESCE(SUM(amount) FILTER (WHERE status = 'assigned'), 0) as assigned_total,
        COUNT(*) FILTER (WHERE status = 'ignored') as ignored_count
      FROM pending_transactions
    `);

    const summary = summaryResult.rows[0];

    return NextResponse.json({
      success: true,
      data: result.rows,
      summary: {
        pendingCount: parseInt(summary.pending_count),
        pendingTotal: parseFloat(summary.pending_total),
        assignedCount: parseInt(summary.assigned_count),
        assignedTotal: parseFloat(summary.assigned_total),
        ignoredCount: parseInt(summary.ignored_count),
      },
    });
  } catch (error) {
    console.error("Error fetching pending transactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pending transactions" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มรายการ pending ใหม่ (จาก LINE BK)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      transaction_type,
      amount,
      account_number,
      transaction_datetime,
      source = "LINE BK",
      raw_message,
    } = body;

    // Validation
    if (!transaction_type || !amount || !transaction_datetime) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: transaction_type, amount, transaction_datetime",
        },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO pending_transactions 
        (transaction_type, amount, account_number, transaction_datetime, source, raw_message, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW())
       RETURNING *`,
      [
        transaction_type,
        parseFloat(amount),
        account_number || null,
        transaction_datetime,
        source,
        raw_message || null,
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Pending transaction created successfully",
    });
  } catch (error) {
    console.error("Error creating pending transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create pending transaction" },
      { status: 500 }
    );
  }
}

// DELETE - ลบรายการ pending
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM pending_transactions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Pending transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pending transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting pending transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete pending transaction" },
      { status: 500 }
    );
  }
}

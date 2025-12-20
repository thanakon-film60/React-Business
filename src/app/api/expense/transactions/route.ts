import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";

// GET - ดึงรายการ transactions ทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // income หรือ expense
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";

    let query = `
      SELECT * FROM expense_transactions 
      WHERE 1=1
    `;
    const params: (string | number)[] = [];

    if (type && (type === "income" || type === "expense")) {
      params.push(type);
      query += ` AND type = $${params.length}`;
    }

    query += ` ORDER BY date DESC, created_at DESC`;
    params.push(parseInt(limit));
    query += ` LIMIT $${params.length}`;
    params.push(parseInt(offset));
    query += ` OFFSET $${params.length}`;

    const result = await pool.query(query, params);

    // Get totals
    const totalsResult = await pool.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) as total_expense
      FROM expense_transactions
    `);

    const totals = totalsResult.rows[0];

    const totalIncome = parseFloat(totals.total_income) || 0;
    const totalExpense = parseFloat(totals.total_expense) || 0;

    return NextResponse.json({
      success: true,
      data: result.rows,
      totals: {
        income: totalIncome,
        expense: totalExpense,
        balance: totalIncome - totalExpense,
      },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST - เพิ่มรายการใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, title, amount, category, date, note, slip_url } = body;

    // Validation
    if (!type || !title || !amount || !category || !date) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { success: false, error: "Invalid transaction type" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO expense_transactions 
        (type, title, amount, category, date, note, slip_url, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        type,
        title,
        parseFloat(amount),
        category,
        date,
        note || null,
        slip_url || null,
      ]
    );

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Transaction created successfully",
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}

// DELETE - ลบรายการ
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
      "DELETE FROM expense_transactions WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Transaction deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete transaction" },
      { status: 500 }
    );
  }
}

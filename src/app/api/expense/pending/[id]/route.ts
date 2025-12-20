import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/supabase-db";

// PUT - อัพเดทรายการ pending (เพิ่ม description, category หรือ convert เป็น expense)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { description, category, status, action } = body;

    // ถ้า action = 'convert' จะ convert เป็น expense_transactions
    if (action === "convert") {
      // เริ่ม transaction
      const client = await pool.connect();
      try {
        await client.query("BEGIN");

        // ดึงข้อมูล pending transaction
        const pendingResult = await client.query(
          "SELECT * FROM pending_transactions WHERE id = $1",
          [id]
        );

        if (pendingResult.rowCount === 0) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { success: false, error: "Pending transaction not found" },
            { status: 404 }
          );
        }

        const pending = pendingResult.rows[0];

        // กำหนด type ตาม transaction_type
        let type = "expense";
        if (
          pending.transaction_type === "รับเงิน" ||
          pending.transaction_type === "เงินเข้า"
        ) {
          type = "income";
        }

        // สร้าง expense_transactions
        const expenseResult = await client.query(
          `INSERT INTO expense_transactions 
            (type, title, amount, category, date, note, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
           RETURNING *`,
          [
            type,
            description || pending.transaction_type,
            pending.amount,
            category || "other-expense",
            new Date(pending.transaction_datetime).toISOString().split("T")[0],
            `${pending.transaction_type} จากบัญชี ${
              pending.account_number || "-"
            } | ${pending.source}`,
          ]
        );

        const newTransaction = expenseResult.rows[0];

        // อัพเดท pending transaction
        await client.query(
          `UPDATE pending_transactions 
           SET status = 'assigned', 
               description = $1, 
               category = $2, 
               assigned_to_transaction_id = $3,
               assigned_at = NOW()
           WHERE id = $4`,
          [description, category, newTransaction.id, id]
        );

        await client.query("COMMIT");

        return NextResponse.json({
          success: true,
          message: "Transaction converted successfully",
          data: {
            pending: { ...pending, status: "assigned" },
            expense: newTransaction,
          },
        });
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    }

    // ถ้า action = 'ignore' จะ mark เป็น ignored
    if (action === "ignore") {
      const result = await pool.query(
        `UPDATE pending_transactions 
         SET status = 'ignored', updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
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
        message: "Transaction ignored successfully",
        data: result.rows[0],
      });
    }

    // อัพเดทปกติ (description, category, status)
    const updates: string[] = [];
    const values: (string | number)[] = [];
    let paramIndex = 1;

    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(status);
    }

    if (updates.length === 0) {
      return NextResponse.json(
        { success: false, error: "No fields to update" },
        { status: 400 }
      );
    }

    values.push(parseInt(id));
    const result = await pool.query(
      `UPDATE pending_transactions 
       SET ${updates.join(", ")}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: "Pending transaction not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: result.rows[0],
      message: "Pending transaction updated successfully",
    });
  } catch (error) {
    console.error("Error updating pending transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update pending transaction" },
      { status: 500 }
    );
  }
}

// GET - ดึงรายการ pending transaction เดียว
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await pool.query(
      "SELECT * FROM pending_transactions WHERE id = $1",
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
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching pending transaction:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch pending transaction" },
      { status: 500 }
    );
  }
}

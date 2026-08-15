import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, title, category, image FROM portfolio_items ORDER BY sort_order ASC, id DESC"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

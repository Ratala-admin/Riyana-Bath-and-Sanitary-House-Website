import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query(
      "SELECT id, title, slug, category, excerpt, image, created_at FROM blog_posts WHERE published = true ORDER BY created_at DESC LIMIT 10"
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

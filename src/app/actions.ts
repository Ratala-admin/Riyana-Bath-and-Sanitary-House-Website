"use server";

import { query, hashPassword } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_SECRET = process.env.SESSION_SECRET || "riyana_jwt_or_cookie_secret_key_456789";

// Helper to sign a session token
function signToken(username: string): string {
  const expiry = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
  const payload = JSON.stringify({ username, expiry });
  const signature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
  return `${Buffer.from(payload).toString("base64")}.${signature}`;
}

// Action to submit consultation
export async function submitConsultation(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const message = formData.get("message") as string;

  // Basic validation
  if (!name || !email) {
    return {
      success: false,
      message: "Name and Email are required.",
    };
  }

  try {
    await query(
      "INSERT INTO consultations (name, email, phone, message) VALUES ($1, $2, $3, $4)",
      [name, email, phone || null, message || null]
    );

    return {
      success: true,
      message: "Thank you! Your consultation request has been submitted successfully.",
    };
  } catch (error) {
    console.error("Failed to save consultation:", error);
    return {
      success: false,
      message: "An error occurred while saving your request. Please try again.",
    };
  }
}

// Action to login admin
export async function loginAdmin(prevState: any, formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password) {
    return {
      success: false,
      message: "Username and Password are required.",
    };
  }

  try {
    const hashedPassword = hashPassword(password);
    const result = await query(
      "SELECT * FROM admin_users WHERE username = $1 AND password = $2",
      [username, hashedPassword]
    );

    if (result.rows.length === 0) {
      return {
        success: false,
        message: "Invalid username or password.",
      };
    }

    // Generate token and set in cookies
    const token = signToken(username);
    const cookieStore = await cookies();
    cookieStore.set("admin_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
      sameSite: "lax",
    });

    return {
      success: true,
      message: "Login successful!",
    };
  } catch (error) {
    console.error("Login failed:", error);
    return {
      success: false,
      message: "An error occurred during login. Please try again.",
    };
  }
}

import { redirect } from "next/navigation";

// Action to logout admin
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin/login");
}

// Action to submit contact form
export async function submitContact(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { success: false, message: "Name, Email, and Message are required." };
  }

  try {
    await query(
      "INSERT INTO contacts (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5)",
      [name, email, phone || null, subject || null, message]
    );
    return { success: true, message: "Thank you! Your message has been sent successfully." };
  } catch (error) {
    console.error("Failed to save contact:", error);
    return { success: false, message: "An error occurred. Please try again." };
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// Action to create a blog post
export async function createBlogPost(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const image = formData.get("image") as string;
  const published = formData.get("published") === "true";

  if (!title || !content) {
    return { success: false, message: "Title and Content are required." };
  }

  let slug = slugify(title);
  if (!slug) slug = "post-" + Date.now();

  try {
    const existing = await query("SELECT id FROM blog_posts WHERE slug = $1", [slug]);
    if (existing.rows.length > 0) {
      slug = slug + "-" + Date.now();
    }

    await query(
      "INSERT INTO blog_posts (title, slug, category, content, excerpt, image, published) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [title, slug, category || "General", content, excerpt || null, image || null, published]
    );
    return { success: true, message: "Blog post created successfully." };
  } catch (error) {
    console.error("Failed to create blog post:", error);
    return { success: false, message: "An error occurred while creating the post." };
  }
}

// Action to update a blog post
export async function updateBlogPost(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const image = formData.get("image") as string;
  const published = formData.get("published") === "true";

  if (!id || !title || !content) {
    return { success: false, message: "ID, Title, and Content are required." };
  }

  try {
    let slug = slugify(title);
    const existing = await query("SELECT id FROM blog_posts WHERE slug = $1 AND id != $2", [slug, id]);
    if (existing.rows.length > 0) {
      slug = slug + "-" + Date.now();
    }

    await query(
      "UPDATE blog_posts SET title = $1, slug = $2, category = $3, content = $4, excerpt = $5, image = $6, published = $7, updated_at = CURRENT_TIMESTAMP WHERE id = $8",
      [title, slug, category || "General", content, excerpt || null, image || null, published, id]
    );
    return { success: true, message: "Blog post updated successfully." };
  } catch (error) {
    console.error("Failed to update blog post:", error);
    return { success: false, message: "An error occurred while updating the post." };
  }
}

// Action to create a portfolio item
export async function createPortfolioItem(prevState: any, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  if (!title || !image) {
    return { success: false, message: "Title and Image are required." };
  }

  try {
    await query(
      "INSERT INTO portfolio_items (title, category, image, sort_order) VALUES ($1, $2, $3, $4)",
      [title, category || "General", image, sort_order]
    );
    return { success: true, message: "Portfolio item created." };
  } catch (error) {
    console.error("Failed to create portfolio item:", error);
    return { success: false, message: "An error occurred." };
  }
}

// Action to update a portfolio item
export async function updatePortfolioItem(prevState: any, formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const image = formData.get("image") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;

  if (!id || !title || !image) {
    return { success: false, message: "ID, Title, and Image are required." };
  }

  try {
    await query(
      "UPDATE portfolio_items SET title = $1, category = $2, image = $3, sort_order = $4 WHERE id = $5",
      [title, category || "General", image, sort_order, id]
    );
    return { success: true, message: "Portfolio item updated." };
  } catch (error) {
    console.error("Failed to update portfolio item:", error);
    return { success: false, message: "An error occurred." };
  }
}

// Action to delete a portfolio item
export async function deletePortfolioItem(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  try {
    await query("DELETE FROM portfolio_items WHERE id = $1", [id]);
  } catch (error) {
    console.error("Failed to delete portfolio item:", error);
  }
  redirect("/admin/portfolio");
}

// Action to delete a consultation
export async function deleteConsultation(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  try {
    await query("DELETE FROM consultations WHERE id = $1", [id]);
  } catch (error) {
    console.error("Failed to delete consultation:", error);
  }
  redirect("/admin");
}

// Action to delete a contact message
export async function deleteContactMessage(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;
  try {
    await query("DELETE FROM contacts WHERE id = $1", [id]);
  } catch (error) {
    console.error("Failed to delete contact message:", error);
  }
  redirect("/admin");
}

// Action to delete a blog post
export async function deleteBlogPost(formData: FormData) {
  const id = formData.get("id") as string;
  if (!id) return;

  try {
    await query("DELETE FROM blog_posts WHERE id = $1", [id]);
  } catch (error) {
    console.error("Failed to delete blog post:", error);
  }
  redirect("/admin/blog");
}

// Verify session token
export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const [payloadB64, signature] = token.split(".");
    if (!payloadB64 || !signature) return null;
    const payload = Buffer.from(payloadB64, "base64").toString("utf-8");
    const expectedSignature = crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
    if (signature !== expectedSignature) return null;
    const data = JSON.parse(payload);
    if (data.expiry < Date.now()) return null;
    return { username: data.username };
  } catch {
    return null;
  }
}

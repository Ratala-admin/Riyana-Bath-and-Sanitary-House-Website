import { Pool } from "pg";
import crypto from "crypto";

const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "5432"),
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "SYSTEM",
  database: process.env.DB_NAME || "postgres",
  ssl: false,
});

// Simple SHA-256 password hashing helper
export function hashPassword(password: string): string {
  const salt = "riyana_secret_salt_12345";
  return crypto.createHmac("sha256", salt).update(password).digest("hex");
}

let isInitialized = false;

export async function query(text: string, params?: any[]) {
  if (!isInitialized) {
    await initializeDatabase();
  }
  return pool.query(text, params);
}

async function initializeDatabase() {
  try {
    // 1. Create consultations table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS consultations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Create admin_users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);

    // 3. Create contacts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255),
        message TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Create blog_posts table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        content TEXT NOT NULL DEFAULT '',
        excerpt TEXT,
        image VARCHAR(500),
        published BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 5. Create portfolio_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS portfolio_items (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL DEFAULT 'General',
        image VARCHAR(500) NOT NULL DEFAULT '',
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 6. Seed default admin user if not exists
    const adminCheck = await pool.query("SELECT * FROM admin_users WHERE username = $1", ["admin"]);
    if (adminCheck.rows.length === 0) {
      const hashedPassword = hashPassword("Admin@123");
      await pool.query(
        "INSERT INTO admin_users (username, password) VALUES ($1, $2)",
        ["admin", hashedPassword]
      );
      console.log("Seeded default admin user: admin / Admin@123");
    }

    isInitialized = true;
    console.log("Database initialized successfully.");
  } catch (error) {
    console.error("Database initialization failed:", error);
  }
}

export default pool;

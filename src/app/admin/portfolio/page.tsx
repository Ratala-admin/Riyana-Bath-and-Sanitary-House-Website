import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { verifyToken } from "@/app/actions";
import { logoutAdmin, deletePortfolioItem } from "@/app/actions";
import DeleteButton from "@/components/DeleteButton";
import adminStyles from "../admin.module.css";
import styles from "./portfolio-admin.module.css";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export default async function AdminPortfolioPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) redirect("/admin/login");
  const session = await verifyToken(sessionToken);
  if (!session) { (await cookies()).delete("admin_session"); redirect("/admin/login"); }

  let items: PortfolioItem[] = [];
  try {
    const result = await query("SELECT id, title, category, image FROM portfolio_items ORDER BY sort_order ASC, id DESC");
    items = result.rows;
  } catch (error) {
    console.error("Failed to fetch portfolio items:", error);
  }

  return (
    <div className={styles.page}>
      <header className={adminStyles.navbar}>
        <div className={adminStyles.logoText}>Riyana <span>Admin</span></div>
        <div className={adminStyles.navActions}>
          <Link href="/admin" className={adminStyles.navLinkBtn} style={{ fontSize: "0.85rem" }}>&larr; Dashboard</Link>
          <span className={adminStyles.userInfo}>Logged in as: <strong>{session.username}</strong></span>
          <form action={logoutAdmin}>
            <button type="submit" className={adminStyles.logoutBtn}>Log Out</button>
          </form>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>Portfolio</h1>
          <Link href="/admin/portfolio/new" className={styles.addBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Add Item
          </Link>
        </div>

        <div className={styles.grid}>
          {items.length === 0 ? (
            <div className={styles.emptyState}>No portfolio items yet.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <Image src={item.image || "/images/portfolio-1.png"} alt={item.title} fill sizes="(max-width: 600px) 100vw, 300px" />
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardTitle}>{item.title}</div>
                  <div className={styles.cardCategory}>{item.category}</div>
                </div>
                <div className={styles.cardActions}>
                  <Link href={`/admin/portfolio/${item.id}/edit`} className={styles.editBtn}>Edit</Link>
                  <DeleteButton action={deletePortfolioItem} id={item.id} confirmText="Delete this portfolio item?" className={styles.deleteBtn} />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import { verifyToken, deleteBlogPost } from "@/app/actions";
import { logoutAdmin } from "@/app/actions";
import DeleteButton from "@/components/DeleteButton";
import styles from "../admin.module.css";
import blogStyles from "./blog-admin.module.css";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  published: boolean;
  created_at: Date;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function AdminBlogPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;
  if (!sessionToken) redirect("/admin/login");
  const session = await verifyToken(sessionToken);
  if (!session) { (await cookies()).delete("admin_session"); redirect("/admin/login"); }

  let posts: BlogPost[] = [];
  try {
    const result = await query("SELECT id, title, category, published, created_at FROM blog_posts ORDER BY created_at DESC");
    posts = result.rows;
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }

  return (
    <div className={blogStyles.page}>
      <header className={styles.navbar}>
        <div className={styles.logoText}>Riyana <span>Admin</span></div>
        <div className={styles.navActions}>
          <Link href="/admin" className={styles.userInfo} style={{ color: "var(--accent-gold)", textDecoration: "none" }}>
            &larr; Dashboard
          </Link>
          <span className={styles.userInfo}>Logged in as: <strong>{session.username}</strong></span>
          <form action={logoutAdmin}>
            <button type="submit" className={styles.logoutBtn}>Log Out</button>
          </form>
        </div>
      </header>

      <main className={blogStyles.main}>
        <div className={blogStyles.header}>
          <h1 className={blogStyles.title}>Blog Posts</h1>
          <Link href="/admin/blog/new" className={blogStyles.addBtn}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            New Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className={blogStyles.emptyState}>
            <p>No blog posts yet. Create your first post!</p>
          </div>
        ) : (
          <div className={blogStyles.grid}>
            {posts.map((post) => (
              <div key={post.id} className={blogStyles.card}>
                <div className={blogStyles.cardInfo}>
                  <div className={blogStyles.cardTitle}>{post.title}</div>
                  <div className={blogStyles.cardMeta}>
                    <span className={blogStyles.categoryTag}>{post.category}</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span className={`${blogStyles.badge} ${post.published ? blogStyles.badgePublished : blogStyles.badgeDraft}`}>
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </div>
                </div>
                <div className={blogStyles.cardActions}>
                  <Link href={`/admin/blog/${post.id}/edit`} className={blogStyles.editBtn}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Edit
                  </Link>
                  <DeleteButton
                    action={deleteBlogPost}
                    id={post.id}
                    confirmText="Delete this post?"
                    className={blogStyles.deleteBtn}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

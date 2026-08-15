import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import styles from "./blog-detail.module.css";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  content: string;
  excerpt: string | null;
  image: string | null;
  created_at: Date;
  readTime?: string;
}

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);

  if (isNaN(numId)) notFound();

  let post: BlogPost | null = null;
  try {
    const result = await query(
      "SELECT id, title, category, content, excerpt, image, created_at FROM blog_posts WHERE id = $1 AND published = true",
      [numId]
    );
    post = result.rows[0] || null;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
  }

  if (!post) notFound();

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.banner}>
        <div className="container">
          <span className={styles.bannerCategory}>{post.category}</span>
          <h1 className={styles.bannerTitle}>{post.title}</h1>
          <div className={styles.bannerMeta}>
            <span>{formatDate(post.created_at)}</span>
            <span className={styles.metaDivider}>•</span>
            <span>{estimateReadTime(post.content)}</span>
          </div>
        </div>
      </div>

      <section className={styles.contentWrapper}>
        <div className="container">
          <article className={styles.article}>
            <Link href="/#blog" className={styles.backLink}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Back to Blog
            </Link>

            {post.image && (
              <div className={styles.featuredImage}>
                <Image src={post.image} alt={post.title} fill sizes="(max-width: 900px) 100vw, 900px" />
              </div>
            )}

            <div
              className={styles.articleBody}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>
      </section>

      <Footer />
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./Blog.module.css";

interface BlogPost {
  id: number;
  title: string;
  category: string;
  excerpt: string;
  image: string;
  created_at: string;
}

function estimateReadTime(excerpt: string): string {
  const words = (excerpt || "").split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min read`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setPosts(data);
      })
      .catch((err) => console.error("Failed to fetch blog posts:", err));
  }, []);

  if (posts.length === 0) return null;

  return (
    <section id="blog" className={styles.blogSection}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge">Our Journal</span>
          <h2 className={styles.title}>Latest Inspiration</h2>
          <p className={styles.subtitle}>
            Explore our design journals, guides, and trends to spark inspiration for your next dream bathroom renovation.
          </p>
        </div>

        <div className={styles.grid}>
          {posts.map((blog) => (
            <Link href={`/blog/${blog.id}`} key={blog.id} className={styles.cardLink}>
              <article className={styles.card}>
                <div className={styles.imageWrapper}>
                  <Image
                    src={blog.image || "/images/portfolio-1.png"}
                    alt={blog.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <span className={styles.categoryBadge}>{blog.category}</span>
                </div>
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span>{formatDate(blog.created_at)}</span>
                    <span className={styles.metaDivider}>•</span>
                    <span>{estimateReadTime(blog.excerpt)}</span>
                  </div>
                  <h3 className={styles.cardTitle}>{blog.title}</h3>
                  <p className={styles.snippet}>{blog.excerpt}</p>
                  <span className={styles.readMoreBtn}>
                    Read Article
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </span>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

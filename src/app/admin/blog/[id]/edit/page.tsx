"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updateBlogPost } from "@/app/actions";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import styles from "../../blog-admin.module.css";
import adminStyles from "../../../admin.module.css";

const initialState = { success: false, message: "" };

export default function EditBlogPost() {
  const params = useParams();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateBlogPost, initialState);
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
        }
      } catch (e) {
        console.error("Failed to load post:", e);
      }
      setLoading(false);
    }
    fetchPost();
  }, [params.id]);

  useEffect(() => {
    if (state?.success) {
      router.push("/admin/blog");
    }
  }, [state?.success, router]);

  return (
    <div className={styles.page}>
      <header className={adminStyles.navbar}>
        <div className={adminStyles.logoText}>Riyana <span>Admin</span></div>
        <div className={adminStyles.navActions}>
          <Link href="/admin/blog" className={styles.backLink}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Posts
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Edit Blog Post</h1>

            {loading && <p style={{ color: "var(--text-muted)" }}>Loading post...</p>}

            {state?.message && !state.success && (
              <div className={styles.errorMsg}>{state.message}</div>
            )}

            {post && (
              <form action={formAction}>
                <input type="hidden" name="id" value={post.id} />

                <div className={styles.formGroup}>
                  <label htmlFor="title" className={styles.label}>Title <span>*</span></label>
                  <input type="text" id="title" name="title" className={styles.input} required defaultValue={post.title} disabled={isPending} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="category" className={styles.label}>Category</label>
                  <input type="text" id="category" name="category" className={styles.input} defaultValue={post.category} disabled={isPending} />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="excerpt" className={styles.label}>Excerpt</label>
                  <textarea id="excerpt" name="excerpt" className={styles.textarea} defaultValue={post.excerpt || ""} disabled={isPending} />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Featured Image</label>
                  <input type="hidden" name="image" id="edit-image-hidden" defaultValue={post.image || ""} />
                  <ImageUploader
                    currentImage={post.image || ""}
                    onUpload={(url) => {
                      const hidden = document.getElementById("edit-image-hidden") as HTMLInputElement;
                      if (hidden) hidden.value = url;
                    }}
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Content <span>*</span></label>
                  <RichTextEditor
                    value={post.content || ""}
                    onChange={(html) => {
                      const hidden = document.getElementById("edit-content-hidden") as HTMLInputElement;
                      if (hidden) hidden.value = html;
                    }}
                  />
                  <input type="hidden" name="content" id="edit-content-hidden" defaultValue={post.content || ""} />
                </div>

                <div className={styles.formGroup}>
                  <div className={styles.toggleRow}>
                    <button
                      type="button"
                      className={`${styles.toggle} ${post.published ? styles.toggleActive : ""}`}
                      onClick={(e) => {
                        const btn = e.currentTarget;
                        btn.classList.toggle(styles.toggleActive);
                        const hidden = document.getElementById("edit-published-hidden") as HTMLInputElement;
                        if (hidden) hidden.value = btn.classList.contains(styles.toggleActive) ? "true" : "false";
                      }}
                    >
                      <span className={styles.toggleKnob} />
                    </button>
                    <input type="hidden" name="published" id="edit-published-hidden" value={post.published ? "true" : "false"} />
                    <span className={styles.toggleLabel}>Published</span>
                  </div>
                </div>

                <button type="submit" className={styles.submitBtn} disabled={isPending}>
                  {isPending ? "Saving..." : "Update Post"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

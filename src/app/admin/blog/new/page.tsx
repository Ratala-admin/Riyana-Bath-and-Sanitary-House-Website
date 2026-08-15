"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBlogPost } from "@/app/actions";
import RichTextEditor from "@/components/RichTextEditor";
import ImageUploader from "@/components/ImageUploader";
import styles from "../blog-admin.module.css";
import adminStyles from "../../admin.module.css";

const initialState = { success: false, message: "" };

export default function NewBlogPost() {
  const [state, formAction, isPending] = useActionState(createBlogPost, initialState);
  const router = useRouter();

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
            <h1 className={styles.formTitle}>New Blog Post</h1>

            {state?.message && !state.success && (
              <div className={styles.errorMsg}>{state.message}</div>
            )}

            <form action={formAction}>
              <input type="hidden" name="content" id="content-hidden" />

              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Title <span>*</span></label>
                <input type="text" id="title" name="title" className={styles.input} required placeholder="Enter post title" disabled={isPending} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Category</label>
                <input type="text" id="category" name="category" className={styles.input} placeholder="e.g. Design Trends" disabled={isPending} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="excerpt" className={styles.label}>Excerpt</label>
                <textarea id="excerpt" name="excerpt" className={styles.textarea} placeholder="Brief summary of the post..." disabled={isPending} />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Featured Image</label>
                <input type="hidden" name="image" id="image-hidden" />
                <ImageUploader
                  currentImage=""
                  onUpload={(url) => {
                    const hidden = document.getElementById("image-hidden") as HTMLInputElement;
                    if (hidden) hidden.value = url;
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Content <span>*</span></label>
                <RichTextEditor
                  value=""
                  onChange={(html) => {
                    const hidden = document.getElementById("content-hidden") as HTMLInputElement;
                    if (hidden) hidden.value = html;
                  }}
                />
              </div>

              <div className={styles.formGroup}>
                <div className={styles.toggleRow}>
                  <button
                    type="button"
                    className={`${styles.toggle} ${styles.toggleActive}`}
                    onClick={(e) => {
                      const btn = e.currentTarget;
                      btn.classList.toggle(styles.toggleActive);
                    }}
                  >
                    <span className={styles.toggleKnob} />
                  </button>
                  <input type="hidden" name="published" id="published-hidden" value="true" />
                  <span className={styles.toggleLabel}>Publish immediately</span>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? "Creating..." : "Create Post"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

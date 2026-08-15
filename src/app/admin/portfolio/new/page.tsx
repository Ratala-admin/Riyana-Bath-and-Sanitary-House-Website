"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createPortfolioItem } from "@/app/actions";
import ImageUploader from "@/components/ImageUploader";
import styles from "../portfolio-admin.module.css";
import adminStyles from "../../admin.module.css";

const initialState = { success: false, message: "" };

export default function NewPortfolioItem() {
  const [state, formAction, isPending] = useActionState(createPortfolioItem, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) router.push("/admin/portfolio");
  }, [state?.success, router]);

  return (
    <div className={styles.page}>
      <header className={adminStyles.navbar}>
        <div className={adminStyles.logoText}>Riyana <span>Admin</span></div>
        <div className={adminStyles.navActions}>
          <Link href="/admin/portfolio" className={styles.backLink}>&larr; Back to Portfolio</Link>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.formContainer}>
          <div className={styles.formCard}>
            <h1 className={styles.formTitle}>Add Portfolio Item</h1>
            {state?.message && !state.success && <div className={styles.errorMsg}>{state.message}</div>}
            <form action={formAction}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Title <span>*</span></label>
                <input type="text" name="title" className={styles.input} required placeholder="e.g. Modern Bathroom Design" disabled={isPending} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Category</label>
                <input type="text" name="category" className={styles.input} placeholder="e.g. Complete Setup" disabled={isPending} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Image <span>*</span></label>
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
                <label className={styles.label}>Sort Order</label>
                <input type="number" name="sort_order" className={styles.input} defaultValue="0" disabled={isPending} />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={isPending}>
                {isPending ? "Adding..." : "Add Item"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

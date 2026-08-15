"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { updatePortfolioItem } from "@/app/actions";
import ImageUploader from "@/components/ImageUploader";
import styles from "../../portfolio-admin.module.css";
import adminStyles from "../../../admin.module.css";

const initialState = { success: false, message: "" };

export default function EditPortfolioItem() {
  const params = useParams();
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updatePortfolioItem, initialState);
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/portfolio/${params.id}`);
        if (res.ok) setItem(await res.json());
      } catch (e) { console.error(e); }
      setLoading(false);
    }
    fetchItem();
  }, [params.id]);

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
            <h1 className={styles.formTitle}>Edit Portfolio Item</h1>
            {loading && <p style={{ color: "var(--text-muted)" }}>Loading...</p>}
            {state?.message && !state.success && <div className={styles.errorMsg}>{state.message}</div>}
            {item && (
              <form action={formAction}>
                <input type="hidden" name="id" value={item.id} />
                <div className={styles.formGroup}>
                  <label className={styles.label}>Title <span>*</span></label>
                  <input type="text" name="title" className={styles.input} required defaultValue={item.title} disabled={isPending} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <input type="text" name="category" className={styles.input} defaultValue={item.category} disabled={isPending} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Image <span>*</span></label>
                  <input type="hidden" name="image" id="edit-image-hidden" defaultValue={item.image} />
                  <ImageUploader
                    currentImage={item.image}
                    onUpload={(url) => {
                      const hidden = document.getElementById("edit-image-hidden") as HTMLInputElement;
                      if (hidden) hidden.value = url;
                    }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Sort Order</label>
                  <input type="number" name="sort_order" className={styles.input} defaultValue={item.sort_order || 0} disabled={isPending} />
                </div>
                <button type="submit" className={styles.submitBtn} disabled={isPending}>
                  {isPending ? "Saving..." : "Update Item"}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

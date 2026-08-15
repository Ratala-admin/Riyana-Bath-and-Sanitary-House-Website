"use client";

import { useActionState, useEffect } from "react";
import { loginAdmin } from "@/app/actions";
import styles from "../admin.module.css";

const initialState = {
  success: false,
  message: "",
};

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.href = "/admin";
    }
  }, [state]);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        {/* Lock icon in styled wrapper */}
        <div className={styles.lockIconWrap}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1" />
          </svg>
        </div>

        {/* Header */}
        <div className={styles.loginHeader}>
          <h1 className={styles.loginTitle}>
            Welcome to <span>Riyana</span>
          </h1>
          <p className={styles.loginSubtitle}>Sign in to your admin dashboard</p>
        </div>

        {/* Error message */}
        {state?.message && !state.success && (
          <div className={styles.errorMessage}>
            {state.message}
          </div>
        )}

        {/* Login form */}
        <form action={formAction}>
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.label}>
              Username
            </label>
            <div className={styles.inputWrap}>
              {/* User icon */}
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                type="text"
                id="username"
                name="username"
                className={styles.input}
                required
                placeholder="Enter your username"
                disabled={isPending}
                autoComplete="username"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <div className={styles.inputWrap}>
              {/* Lock icon for password field */}
              <svg className={styles.inputIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.input}
                required
                placeholder="Enter your password"
                disabled={isPending}
                autoComplete="current-password"
              />
            </div>
          </div>

          {/* Divider */}
          <div className={styles.divider}>secure login</div>

          {/* Submit */}
          <button type="submit" className={styles.submitBtn} disabled={isPending}>
            {isPending ? (
              <>
                <span className={styles.spinner} />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className={styles.loginFooter}>
          Protected area &mdash; Riyana Admin Panel
        </div>
      </div>
    </div>
  );
}

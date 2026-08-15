"use client";

import { useActionState } from "react";
import { submitContact } from "@/app/actions";
import styles from "./ContactSection.module.css";

const initialState = { success: false, message: "" };

export default function ContactSection() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return (
    <section id="contact" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="badge">Get in Touch</span>
          <h2 className={styles.title}>Contact Us</h2>
          <p className={styles.subtitle}>
            Have a question or want to start a project? We would love to hear from you.
          </p>
        </div>

        <div className={styles.grid}>
          <div className={styles.infoCards}>
            <div className={styles.infoCard}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div>
                <div className={styles.cardLabel}>Address</div>
                <div className={styles.cardValue}>123 Bath Avenue, Kathmandu, Nepal</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </div>
              <div>
                <div className={styles.cardLabel}>Email</div>
                <div className={styles.cardValue}>info@riyanabath.com</div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.cardIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
              </div>
              <div>
                <div className={styles.cardLabel}>Phone</div>
                <div className={styles.cardValue}>+977 123 456 789</div>
              </div>
            </div>
          </div>

          <div className={styles.formCard}>
            {state?.success ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 className={styles.successTitle}>Message Sent!</h3>
                <p className={styles.successText}>{state.message}</p>
              </div>
            ) : (
              <>
                <h3 className={styles.formTitle}>Send Us a Message</h3>
                <p className={styles.formSubtitle}>Fill out the form and we&apos;ll get back to you within 24 hours.</p>

                {state?.message && !state.success && (
                  <div className={styles.errorMessage}>{state.message}</div>
                )}

                <form action={formAction}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-name" className={styles.label}>Name <span>*</span></label>
                      <input type="text" id="contact-name" name="name" className={styles.input} required placeholder="John Doe" disabled={isPending} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-email" className={styles.label}>Email <span>*</span></label>
                      <input type="email" id="contact-email" name="email" className={styles.input} required placeholder="john@example.com" disabled={isPending} />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-subject" className={styles.label}>Subject</label>
                    <input type="text" id="contact-subject" name="subject" className={styles.input} placeholder="How can we help?" disabled={isPending} />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="contact-message" className={styles.label}>Message <span>*</span></label>
                    <textarea id="contact-message" name="message" className={styles.textarea} required placeholder="Tell us about your project..." disabled={isPending} />
                  </div>
                  <button type="submit" className={styles.submitBtn} disabled={isPending}>
                    {isPending ? (
                      <><svg style={{ animation: "spin 1s linear infinite" }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line x1="16.24" y1="7.76" x2="19.07" y2="4.93" /></svg>
                        Sending...</>
                    ) : "Send Message"}
                  </button>
                </form>
                <style jsx global>{`
                  @keyframes spin {
                    100% { transform: rotate(360deg); }
                  }
                `}</style>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

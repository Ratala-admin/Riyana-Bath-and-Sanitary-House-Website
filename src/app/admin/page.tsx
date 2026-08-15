import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { query } from "@/lib/db";
import { verifyToken, logoutAdmin, deleteConsultation, deleteContactMessage } from "@/app/actions";
import DeleteButton from "@/components/DeleteButton";
import styles from "./admin.module.css";
import "@/app/globals.css";

interface Consultation {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string | null;
  created_at: Date;
}

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  created_at: Date;
}

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("admin_session")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  const session = await verifyToken(sessionToken);

  if (!session) {
    cookieStore.delete("admin_session");
    redirect("/admin/login");
  }

  let consultations: Consultation[] = [];
  let contacts: Contact[] = [];
  let blogCount = 0;
  let portfolioCount = 0;

  try {
    const result = await query("SELECT id, name, email, phone, message, created_at FROM consultations ORDER BY created_at DESC");
    consultations = result.rows;
  } catch (error) {
    console.error("Failed to fetch consultations:", error);
  }

  try {
    const result = await query(
      "SELECT id, name, email, phone, subject, message, created_at FROM contacts ORDER BY created_at DESC"
    );
    contacts = result.rows;
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }

  try {
    const result = await query("SELECT COUNT(*) as count FROM blog_posts");
    blogCount = parseInt(result.rows[0]?.count || "0");
  } catch (error) {
    console.error("Failed to fetch blog count:", error);
  }

  try {
    const result = await query("SELECT COUNT(*) as count FROM portfolio_items");
    portfolioCount = parseInt(result.rows[0]?.count || "0");
  } catch (error) {
    console.error("Failed to fetch portfolio count:", error);
  }

  try {
    const result = await query(
      "SELECT id, name, email, phone, subject, message, created_at FROM contacts ORDER BY created_at DESC"
    );
    contacts = result.rows;
  } catch (error) {
    console.error("Failed to fetch contacts:", error);
  }

  try {
    const result = await query("SELECT COUNT(*) as count FROM blog_posts");
    blogCount = parseInt(result.rows[0]?.count || "0");
  } catch (error) {
    console.error("Failed to fetch blog count:", error);
  }

  const totalConsultations = consultations.length;
  const totalContacts = contacts.length;
  const todayCount = [...consultations, ...contacts].filter((c) => {
    const today = new Date();
    const date = new Date(c.created_at);
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.navbar}>
        <div className={styles.logoText}>
          Riyana <span>Admin</span>
        </div>
        <div className={styles.navActions}>
          <span className={styles.userInfo}>
            Logged in as: <strong>{session.username}</strong>
          </span>
          <Link href="/admin/blog" className={styles.navLinkBtn}>
            Blog
          </Link>
          <Link href="/admin/portfolio" className={styles.navLinkBtn}>
            Portfolio
          </Link>
          <form action={logoutAdmin}>
            <button type="submit" className={styles.logoutBtn}>
              Log Out
            </button>
          </form>
        </div>
      </header>

      <main className={styles.mainContent}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Dashboard</h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalConsultations}</span>
              <span className={styles.statLabel}>Consultations</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{totalContacts}</span>
              <span className={styles.statLabel}>Contact Messages</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{todayCount}</span>
              <span className={styles.statLabel}>Received Today</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="9" y1="15" x2="15" y2="15"></line>
                <line x1="9" y1="11" x2="15" y2="11"></line>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{blogCount}</span>
              <span className={styles.statLabel}>Blog Posts</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>{portfolioCount}</span>
              <span className={styles.statLabel}>Portfolio Items</span>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: "2.5rem" }}>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle} style={{ fontSize: "1.5rem" }}>Consultation Requests</h2>
          </div>
          <div className={styles.tableContainer}>
            {consultations.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No Consultation Requests</h3>
                <p>When users request a free consultation, they will appear here.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Contact Info</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.map((c) => (
                    <tr key={`consult-${c.id}`}>
                      <td data-label="Contact Info">
                        <div className={styles.contactName}>{c.name}</div>
                        <div className={styles.contactEmail}>{c.email}</div>
                      </td>
                      <td data-label="Phone" className={styles.phone}>
                        {c.phone || <span style={{ opacity: 0.3 }}>—</span>}
                      </td>
                      <td data-label="Message">
                        <div className={styles.message}>
                          {c.message || <span style={{ opacity: 0.3, fontStyle: "italic" }}>No message provided</span>}
                        </div>
                      </td>
                      <td data-label="Date Submitted" className={styles.date}>
                        {new Date(c.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td data-label="Actions">
                        <DeleteButton
                          action={deleteConsultation}
                          id={c.id}
                          confirmText="Delete this consultation request?"
                          className={styles.deleteBtn}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div>
          <div className={styles.pageHeader}>
            <h2 className={styles.pageTitle} style={{ fontSize: "1.5rem" }}>Contact Messages</h2>
          </div>
          <div className={styles.tableContainer}>
            {contacts.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No Contact Messages</h3>
                <p>When users submit the contact form, they will appear here.</p>
              </div>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Contact Info</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Date Submitted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.map((c) => (
                    <tr key={`contact-${c.id}`}>
                      <td data-label="Contact Info">
                        <div className={styles.contactName}>{c.name}</div>
                        <div className={styles.contactEmail}>{c.email}</div>
                        {c.phone && <div className={styles.contactEmail}>{c.phone}</div>}
                      </td>
                      <td data-label="Subject">
                        {c.subject || <span style={{ opacity: 0.3, fontStyle: "italic" }}>No subject</span>}
                      </td>
                      <td data-label="Message">
                        <div className={styles.message}>{c.message}</div>
                      </td>
                      <td data-label="Date Submitted" className={styles.date}>
                        {new Date(c.created_at).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </td>
                      <td data-label="Actions">
                        <DeleteButton
                          action={deleteContactMessage}
                          id={c.id}
                          confirmText="Delete this contact message?"
                          className={styles.deleteBtn}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

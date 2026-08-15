import Image from "next/image";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topSection}>
          <div className={styles.brand}>
            <div className={styles.logoContainer}>
              <Image src="/logo.jpg" alt="Riyana Logo" width={40} height={40} className={styles.logoImage} />
              <span className={styles.logoText}>Riyana</span>
            </div>
            <p className={styles.brandDescription}>
              Elevating daily rituals through premium bath fittings and luxury sanitary ware.
            </p>
          </div>
          <div className={styles.links}>
            <h4 className={styles.linkTitle}>Quick Links</h4>
            <ul>
              <li><a href="#home">Home</a></li>
              <li><a href="#about">About Us</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.contact}>
            <h4 className={styles.linkTitle}>Contact Us</h4>
            <p>123 Bath Avenue<br/>Kathmandu, Nepal</p>
            <p>Email: info@riyanabath.com</p>
            <p>Phone: +977 123 456 789</p>
          </div>
        </div>
        <div className={styles.bottomSection}>
          <p>&copy; {new Date().getFullYear()} Riyana Bath. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

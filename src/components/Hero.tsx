import styles from "./Hero.module.css";

interface HeroProps {
  onOpenConsultation: () => void;
}

export default function Hero({ onOpenConsultation }: HeroProps) {
  return (
    <section id="home" className={styles.hero}>
      <div className={`container ${styles.heroContainer}`}>
        <h1 className={styles.title}>
          Your Dream Bathroom,<br />
          <span className={styles.highlight}>Our Expertise</span>
        </h1>
        <p className={styles.description}>
          Elevate your daily rituals with premium bath fittings, luxury sanitary ware, and expert design consultation.
        </p>
        <button className={`btn btn-primary ${styles.ctaButton}`} onClick={onOpenConsultation}>
          Get a Free Consultation
        </button>
      </div>
    </section>
  );
}

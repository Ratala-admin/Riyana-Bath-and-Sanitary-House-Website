import Image from "next/image";
import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={`container ${styles.content}`}>
        <h2 className={styles.badge}>Our Story</h2>
        <h3 className={styles.title}>Redefining<br />Elegance in Every<br />Home</h3>
        <div className={styles.textContainer}>
          <p className={styles.text}>
            Riyana Bath and Sanitary House is a premier destination for high-quality bathroom fittings and sanitary ware. We believe that a bathroom is more than just a functional space—it's a personal sanctuary where comfort meets design.
          </p>
          <p className={styles.text}>
            As an established local business, we are committed to providing top-tier products ranging from luxurious showers and sleek faucets to elegant tiles and durable accessories. Our expert team is dedicated...
          </p>
        </div>
      </div>
      <div className={styles.imageContainer}>
        <Image
          src="/images/about_bathroom.png"
          alt="Luxury bathroom interior"
          width={800}
          height={600}
          className={styles.image}
        />
      </div>
    </section>
  );
}

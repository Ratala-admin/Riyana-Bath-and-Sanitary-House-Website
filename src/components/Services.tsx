import styles from "./Services.module.css";

const services = [
  {
    title: "Bathroom Fittings Supply",
    description: "Premium quality fittings designed to last and enhance the beauty of your space.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5"/>
        <line x1="10" x2="8" y1="5" y2="7"/>
        <line x1="2" x2="22" y1="12" y2="12"/>
        <line x1="7" x2="7" y1="19" y2="21"/>
        <line x1="17" x2="17" y1="19" y2="21"/>
      </svg>
    )
  },
  {
    title: "Sanitary Ware",
    description: "A comprehensive range of elegant, modern, and classic sanitary fixtures.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>
        <path d="M9 15a3 3 0 0 0 3 3"/>
      </svg>
    )
  },
  {
    title: "Shower Systems",
    description: "Luxurious rainfall and multi-function shower systems for a spa-like experience.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20"/>
        <path d="M4 10h16"/>
        <path d="M8 10V5a4 4 0 0 1 8 0v5"/>
        <circle cx="12" cy="12" r="2" fill="currentColor"/>
      </svg>
    )
  },
  {
    title: "Faucets & Mixers",
    description: "Sleek, water-efficient designs in various finishes including matte black and gold.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 18V6"/>
        <path d="M8 10v4"/>
        <path d="M16 10v4"/>
      </svg>
    )
  },
  {
    title: "Tiles & Accessories",
    description: "Curated collections of wall and floor tiles, alongside essential bathroom accessories.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" x2="21" y1="9" y2="9"/>
        <line x1="3" x2="21" y1="15" y2="15"/>
        <line x1="9" x2="9" y1="3" y2="21"/>
        <line x1="15" x2="15" y1="3" y2="21"/>
      </svg>
    )
  },
  {
    title: "Installation Consultation",
    description: "Expert advice on spatial planning and proper installation techniques.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    )
  },
];

export default function Services() {
  return (
    <section id="services" className={styles.services}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className="badge">Our Offerings</span>
          <h2 className={styles.title}>Everything You Need</h2>
          <p className={styles.subtitle}>
            From the initial design concept to the final finishing touches, we provide a complete range of bathroom products and expertise.
          </p>
        </div>
        <div className={styles.grid}>
          {services.map((svc) => (
            <div key={svc.title} className={styles.card}>
              <div className={styles.iconWrapper}>{svc.icon}</div>
              <h3 className={styles.cardTitle}>{svc.title}</h3>
              <p className={styles.cardText}>{svc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

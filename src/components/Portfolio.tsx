"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import styles from "./Portfolio.module.css";

interface PortfolioItem {
  id: number;
  title: string;
  category: string;
  image: string;
}

export default function Portfolio() {
  const [items, setItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
      })
      .catch((err) => console.error("Failed to fetch portfolio items:", err));
  }, []);

  if (items.length === 0) return null;

  return (
    <section id="portfolio" className={styles.portfolio}>
      <div className={`container ${styles.container}`}>
        <div className={styles.header}>
          <span className="badge">Showcase</span>
          <h2 className={styles.title}>Inspired Collections</h2>
          <p className={styles.subtitle}>
            Explore our curated selections and envision the possibilities for your own space.
          </p>
        </div>
        <div className={styles.grid}>
          {items.map((project) => (
            <div key={project.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={project.image || "/images/portfolio-1.png"}
                  alt={project.title}
                  fill
                  className={styles.image}
                />
              </div>
              <div className={styles.content}>
                <span className={styles.category}>{project.category}</span>
                <h3 className={styles.projectTitle}>{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

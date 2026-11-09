import type { ReactNode } from "react";

import styles from "./home.module.css";

interface IFeature {
  title: string;
  text: string;
}

const FEATURES: readonly IFeature[] = [
  {
    title: "TypeScript strict",
    text: "Types précis, aucune dépendance superflue, exports nommés et API publique explicite.",
  },
  {
    title: "Documenté en français",
    text: "TSDoc complet sur chaque export, guides par cas d'usage et référence API générée.",
  },
  {
    title: "Testé",
    text: "Cas nominaux, limites et erreurs couverts par Vitest, avec un seuil de couverture de 90 %.",
  },
  {
    title: "Prêt pour Claude Code",
    text: "Chaque package embarque son inventaire en skill, installable dans vos projets.",
  },
];

/** Section des points forts communs aux packages. */
export function FeatureGrid(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Les mêmes exigences partout</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.feature}>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

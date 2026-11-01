import type { ReactNode } from "react";

import styles from "./home.module.css";

interface IFeature {
  mark: string;
  title: string;
  text: string;
}

const FEATURES: readonly IFeature[] = [
  {
    mark: "TS",
    title: "TypeScript strict",
    text: "Types précis, aucune dépendance superflue, exports nommés et API publique explicite.",
  },
  {
    mark: "FR",
    title: "Documenté en français",
    text: "TSDoc complet sur chaque export, guides par cas d'usage et référence API générée.",
  },
  {
    mark: "90 %",
    title: "Testé",
    text: "Cas nominaux, limites et erreurs couverts par Vitest, avec un seuil de couverture imposé.",
  },
  {
    mark: "IA",
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
        <p className={styles.sectionLead}>
          Les trois packages suivent les mêmes conventions, vérifiées à chaque pull request.
        </p>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <article key={feature.title} className={styles.feature}>
              <span className={styles.featureMark}>{feature.mark}</span>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

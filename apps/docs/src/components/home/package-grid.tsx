import Link from "@docusaurus/Link";
import type { ReactNode } from "react";

import styles from "./home.module.css";

interface IPackageCard {
  /** Section de la doc : choisit la palette de la carte (`data-package`). */
  section: "react" | "nest" | "misc";
  description: string;
  tags: readonly string[];
  icon: ReactNode;
}

const ICON_PROPS = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

const PACKAGES: readonly IPackageCard[] = [
  {
    section: "react",
    description: "Composants et hooks React, chacun présenté avec une démo live modifiable.",
    tags: ["Composants", "Hooks", "Fetch", "Routing"],
    icon: (
      <svg {...ICON_PROPS}>
        <circle cx="12" cy="12" r="1.6" />
        <ellipse cx="12" cy="12" rx="10" ry="4" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    section: "nest",
    description: "Utilitaires NestJS : droits, routes publiques, filtrage des requêtes et export.",
    tags: ["Guards", "Décorateurs", "Filtrage", "Excel"],
    icon: (
      <svg {...ICON_PROPS}>
        <rect x="3" y="4" width="18" height="6" rx="1.5" />
        <rect x="3" y="14" width="18" height="6" rx="1.5" />
        <path d="M7 7h.01M7 17h.01M11 7h6M11 17h6" />
      </svg>
    ),
  },
  {
    section: "misc",
    description: "Utilitaires TypeScript partagés entre front et back, rangés en 19 catégories.",
    tags: ["Async", "Dates", "Validation", "Formatage"],
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
      </svg>
    ),
  },
];

/** Section listant les trois packages publiés, chacun dans la couleur de sa section. */
export function PackageGrid(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Trois packages, une seule doc</h2>
        <div className={styles.grid}>
          {PACKAGES.map((item) => (
            <Link
              key={item.section}
              to={`/${item.section}`}
              className={styles.card}
              data-package={item.section}
            >
              <span className={styles.icon}>{item.icon}</span>
              <span className={styles.cardTitle}>@etiennea20/adr-{item.section}</span>
              <span className={styles.cardText}>{item.description}</span>
              <span className={styles.tags}>{item.tags.join(" · ")}</span>
              <span className={styles.more}>
                Voir la documentation <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

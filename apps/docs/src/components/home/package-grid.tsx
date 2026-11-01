import Link from "@docusaurus/Link";
import type { PointerEvent, ReactNode } from "react";

import styles from "./home.module.css";

interface IPackageCard {
  name: string;
  to: string;
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
    name: "adr-react",
    to: "/react",
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
    name: "adr-nest",
    to: "/nest",
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
    name: "adr-misc",
    to: "/misc",
    description: "Utilitaires TypeScript partagés entre front et back, rangés en 19 catégories.",
    tags: ["Async", "Dates", "Validation", "Formatage"],
    icon: (
      <svg {...ICON_PROPS}>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z" />
      </svg>
    ),
  },
];

/** Place le halo de la carte sous le pointeur (variables CSS lues par `.card::before`). */
function trackPointer(event: PointerEvent<HTMLAnchorElement>): void {
  const card = event.currentTarget;
  const bounds = card.getBoundingClientRect();
  card.style.setProperty("--pointer-x", `${String(event.clientX - bounds.left)}px`);
  card.style.setProperty("--pointer-y", `${String(event.clientY - bounds.top)}px`);
}

/** Section listant les trois packages publiés, sous forme de cartes cliquables. */
export function PackageGrid(): ReactNode {
  return (
    <section className={styles.section}>
      <div className="container">
        <h2 className={styles.sectionTitle}>Trois packages, une seule doc</h2>
        <p className={styles.sectionLead}>
          Chaque package a ses guides, sa référence API générée depuis le TSDoc et son inventaire
          pour Claude Code.
        </p>
        <div className={styles.grid}>
          {PACKAGES.map((item) => (
            <Link key={item.name} to={item.to} className={styles.card} onPointerMove={trackPointer}>
              <span className={styles.icon}>{item.icon}</span>
              <h3 className={styles.cardTitle}>@etiennea20/{item.name}</h3>
              <p className={styles.cardText}>{item.description}</p>
              <ul className={styles.tags}>
                {item.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
              <span className={styles.more}>
                Voir la documentation
                <span className={styles.arrow} aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

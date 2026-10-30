import Link from "@docusaurus/Link";
import { useEffect, useState, type ReactNode } from "react";

import styles from "./home.module.css";

const INSTALL_COMMAND = "pnpm add @etiennea20/adr-misc";
const COPIED_FEEDBACK_MS = 2000;

/** Bloc de commande d'installation avec bouton de copie dans le presse-papiers. */
function InstallCommand(): ReactNode {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setCopied(false);
    }, COPIED_FEEDBACK_MS);
    return () => {
      window.clearTimeout(timer);
    };
  }, [copied]);

  const copy = (): void => {
    navigator.clipboard.writeText(INSTALL_COMMAND).then(
      () => {
        setCopied(true);
      },
      () => {
        setCopied(false);
      },
    );
  };

  return (
    <div className={styles.install}>
      <code>
        <span className={styles.prompt}>$ </span>
        {INSTALL_COMMAND}
      </code>
      <button type="button" className={styles.copy} onClick={copy} aria-live="polite">
        {copied ? "Copié !" : "Copier"}
      </button>
    </div>
  );
}

/** En-tête de la page d'accueil : accroche, appels à l'action et commande d'installation. */
export function HomeHero(): ReactNode {
  return (
    <header className={styles.hero}>
      <div className={styles.backdrop} aria-hidden="true">
        <span className={styles.blob} />
        <span className={styles.blob} />
        <span className={styles.blob} />
      </div>
      <div className="container">
        <div className={styles.heroInner}>
          <p className={styles.eyebrow}>Monorepo @etiennea20</p>
          <h1 className={styles.title}>
            Des briques <span className={styles.gradientText}>TypeScript</span> prêtes à
            l&apos;emploi
          </h1>
          <p className={styles.tagline}>
            Composants React, utilitaires NestJS et fonctions partagées front et back : typés,
            testés et documentés en français.
          </p>
          <div className={styles.actions}>
            <Link className="button button--primary button--lg" to="/react">
              Découvrir les composants
            </Link>
            <Link className="button button--secondary button--lg" to="/misc">
              Parcourir les utilitaires
            </Link>
          </div>
          <InstallCommand />
        </div>
      </div>
    </header>
  );
}

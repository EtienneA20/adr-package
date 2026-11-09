import Head from "@docusaurus/Head";
import { useLocation } from "@docusaurus/router";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import type { ReactNode } from "react";

/** Sections de la doc qui ont leur propre palette (le reste du site reste en corail). */
const SECTIONS = ["react", "nest", "misc"] as const;

type Section = (typeof SECTIONS)[number];

interface IRootProps {
  children: ReactNode;
}

/** Section correspondant au premier segment du chemin (après la `baseUrl`), s'il y en a une. */
function findSection(pathname: string, baseUrl: string): Section | undefined {
  const [segment] = pathname.slice(baseUrl.length).split("/");
  return SECTIONS.find((section) => section === segment);
}

/**
 * Enveloppe de toute l'application : expose la section courante sur `<html data-adr-section>`.
 *
 * L'attribut passe par `<Head>` plutôt que par un effet : il est ainsi présent dans le HTML
 * généré au build, et la page s'affiche directement avec la palette de sa section.
 */
export default function Root({ children }: IRootProps): ReactNode {
  const { pathname } = useLocation();
  const { siteConfig } = useDocusaurusContext();
  const section = findSection(pathname, siteConfig.baseUrl) ?? "home";

  return (
    <>
      <Head>
        {/* eslint-disable-next-line jsx-a11y/html-has-lang -- `lang` est posé par Docusaurus, Helmet fusionne les attributs. */}
        <html data-adr-section={section} />
      </Head>
      {children}
    </>
  );
}

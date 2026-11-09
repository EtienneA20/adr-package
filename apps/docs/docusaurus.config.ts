import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes, type PrismTheme } from "prism-react-renderer";

const REPOSITORY_URL = "https://github.com/EtienneA20/adr-package";

/** Fond des blocs de code : neutre « atténué » de la palette (voir src/css/custom.css). */
const CODE_BACKGROUND = { light: "#F2ECE3", dark: "#221E1B" } as const;

/**
 * Remplace le fond d'un thème Prism : Docusaurus l'applique en style inline sur chaque bloc,
 * il ne peut donc pas être surchargé depuis custom.css.
 */
function withBackground(theme: PrismTheme, backgroundColor: string): PrismTheme {
  return { ...theme, plain: { ...theme.plain, backgroundColor } };
}

/**
 * Référence API générée depuis le TSDoc d'un package (docusaurus-plugin-typedoc), en français.
 * Le résultat (`docs/<section>/api/`) est généré à chaque démarrage et ignoré par Git.
 */
function typedocPlugin(section: "nest" | "misc"): [string, Record<string, unknown>] {
  const packageDir = `../../packages/adr-${section}`;
  return [
    "docusaurus-plugin-typedoc",
    {
      id: `typedoc-${section}`,
      entryPoints: [`${packageDir}/src/index.ts`],
      tsconfig: `${packageDir}/tsconfig.json`,
      out: `docs/${section}/api`,
      lang: "fr",
      // Libellés absents de la traduction française fournie par typedoc.
      locales: { fr: { tag_throws: "Erreurs", tag_since: "Depuis", tag_remarks: "Remarques" } },
      // Liens vers les sources sans dépendre de Git (le build Docker n'a pas de dossier .git).
      disableGit: true,
      basePath: "../..",
      sourceLinkTemplate: `${REPOSITORY_URL}/blob/main/packages/adr-${section}/src/{path}#L{line}`,
      readme: "none",
      excludePrivate: true,
      excludeInternal: true,
      hidePageHeader: true,
      sidebar: { autoConfiguration: false },
    },
  ];
}

const config: Config = {
  title: "adr-package",
  tagline: "Documentation des packages @etiennea20 : adr-react, adr-nest, adr-misc",
  favicon: "img/favicon.svg",
  url: "http://localhost",
  baseUrl: "/",
  trailingSlash: false,
  onBrokenLinks: "throw",
  markdown: { hooks: { onBrokenMarkdownLinks: "throw" } },
  i18n: { defaultLocale: "fr", locales: ["fr"] },

  presets: [
    [
      "classic",
      {
        docs: { path: "docs", routeBasePath: "/", sidebarPath: "./sidebars.ts" },
        // La page d'accueil est src/pages/index.tsx ; les docs restent servies à la racine.
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themes: ["@docusaurus/theme-live-codeblock"],
  plugins: [typedocPlugin("nest"), typedocPlugin("misc")],

  themeConfig: {
    // Bascule à deux états (clair / sombre) : le thème du système n'est pas suivi.
    colorMode: { defaultMode: "light", disableSwitch: false, respectPrefersColorScheme: false },
    docs: { sidebar: { hideable: true, autoCollapseCategories: true } },
    navbar: {
      title: "adr-package",
      logo: { alt: "", src: "img/logo.svg" },
      // `navbar-package--<section>` : pastille de la couleur du package (src/css/custom.css).
      items: [
        {
          type: "docSidebar",
          sidebarId: "react",
          position: "left",
          label: "adr-react",
          className: "navbar-package navbar-package--react",
        },
        {
          type: "docSidebar",
          sidebarId: "nest",
          position: "left",
          label: "adr-nest",
          className: "navbar-package navbar-package--nest",
        },
        {
          type: "docSidebar",
          sidebarId: "misc",
          position: "left",
          label: "adr-misc",
          className: "navbar-package navbar-package--misc",
        },
        {
          href: REPOSITORY_URL,
          position: "right",
          className: "header-github-link",
          "aria-label": "Dépôt GitHub",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Packages",
          items: [
            { label: "adr-react", to: "/react" },
            { label: "adr-nest", to: "/nest" },
            { label: "adr-misc", to: "/misc" },
          ],
        },
        {
          title: "Référence API",
          items: [
            { label: "adr-nest", to: "/nest/api" },
            { label: "adr-misc", to: "/misc/api" },
          ],
        },
        {
          title: "Dépôt",
          items: [
            { label: "GitHub", href: REPOSITORY_URL },
            { label: "Packages publiés", href: `${REPOSITORY_URL}/packages` },
          ],
        },
      ],
      copyright: "Packages @etiennea20 · documentation générée avec Docusaurus",
    },
    liveCodeBlock: { playgroundPosition: "top" },
    prism: {
      theme: withBackground(prismThemes.oneLight, CODE_BACKGROUND.light),
      darkTheme: withBackground(prismThemes.oneDark, CODE_BACKGROUND.dark),
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

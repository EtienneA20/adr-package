import type * as Preset from "@docusaurus/preset-classic";
import type { Config } from "@docusaurus/types";
import { themes as prismThemes } from "prism-react-renderer";

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
      sourceLinkTemplate: `https://github.com/EtienneA20/adr-package/blob/main/packages/adr-${section}/src/{path}#L{line}`,
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
        blog: false,
        theme: { customCss: "./src/css/custom.css" },
      } satisfies Preset.Options,
    ],
  ],

  themes: ["@docusaurus/theme-live-codeblock"],
  plugins: [typedocPlugin("nest"), typedocPlugin("misc")],

  themeConfig: {
    navbar: {
      title: "adr-package",
      items: [
        { type: "docSidebar", sidebarId: "react", position: "left", label: "adr-react" },
        { type: "docSidebar", sidebarId: "nest", position: "left", label: "adr-nest" },
        { type: "docSidebar", sidebarId: "misc", position: "left", label: "adr-misc" },
      ],
    },
    liveCodeBlock: { playgroundPosition: "top" },
    prism: { theme: prismThemes.github, darkTheme: prismThemes.dracula },
  } satisfies Preset.ThemeConfig,
};

export default config;

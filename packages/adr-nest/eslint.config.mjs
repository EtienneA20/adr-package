import { defineAdrConfig } from "@etiennea20/config/eslint";

// PeerDependencies optionnelles : chacune réservée aux sous-chemins qui l'utilisent (les tests
// peuvent toutes les importer). L'entrée principale (common, permissions) n'en importe aucune ;
// `prisma` n'importe que des types, via `../../filtering`.
export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "nest",
  optionalPeers: [
    { name: "zod", allowedIn: "src/filtering/**" },
    { name: "@etiennea20/adr-misc/contract", allowedIn: "src/filtering/**" },
    { name: "@etiennea20/adr-misc", allowedIn: ["src/export/**", "src/excel/**"] },
    { name: "fflate", allowedIn: "src/excel/**" },
  ],
});

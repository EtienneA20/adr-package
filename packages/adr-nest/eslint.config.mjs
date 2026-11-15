import { defineAdrConfig } from "@etiennea20/config/eslint";

// zod et adr-misc sont des peerDependencies optionnelles : réservées au sous-chemin `filtering`
// (et aux tests, jamais publiés). `prisma` n'en importe que des types, via `../../filtering`.
const OPTIONAL_PEERS_ZONE = "src/{filtering/**,**/*.test.ts}";

export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "nest",
  optionalPeers: [
    { name: "zod", allowedIn: OPTIONAL_PEERS_ZONE },
    { name: "@etiennea20/adr-misc/contract", allowedIn: OPTIONAL_PEERS_ZONE },
  ],
});

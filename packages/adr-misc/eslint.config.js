import { defineAdrConfig } from "@etiennea20/config/eslint";

export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "library",
  // zod est une peerDependency optionnelle : réservée au sous-chemin `./contract`.
  optionalPeers: [{ name: "zod", allowedIn: "src/contract/**" }],
});

import { defineAdrConfig } from "@etiennea20/config/eslint";

export default defineAdrConfig({
  tsconfigRootDir: import.meta.dirname,
  preset: "react",
  // Chaque peerDependency optionnelle reste dans la catégorie de son sous-chemin `exports`.
  optionalPeers: [
    { name: "axios", allowedIn: "src/fetch/**" },
    { name: "@tanstack/react-query", allowedIn: "src/fetch/**" },
    { name: "react-router", allowedIn: "src/routing/**" },
  ],
});

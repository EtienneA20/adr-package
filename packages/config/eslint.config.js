import { defineAdrConfig } from "./eslint.js";

export default defineAdrConfig({ tsconfigRootDir: import.meta.dirname, preset: "node" });

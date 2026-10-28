import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Sans les globales Vitest, Testing Library ne démonte pas le rendu automatiquement.
afterEach(() => {
  cleanup();
});

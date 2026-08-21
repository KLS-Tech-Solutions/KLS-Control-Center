import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

/**
 * Unit tests only — no browser, no server, no database.
 *
 * The API is covered by the backend's own suite; these test the things that
 * live only here: journey gating, validation, error mapping, and the
 * components with real conditional logic in them.
 *
 * `@/` aliases resolve through Vite's native tsconfig support rather than the
 * vite-tsconfig-paths plugin, which is deprecated and was crashing the runner.
 */
export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
    restoreMocks: true,
    // Vitest processes CSS imports through the project's PostCSS config by
    // default. Nothing here asserts on styles, and skipping it removes a
    // whole toolchain from the test path.
    css: false,
  },
});

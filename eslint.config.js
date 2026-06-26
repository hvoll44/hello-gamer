import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", "coverage", "node_modules", "eslint.config.js"],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    languageOptions: {
      globals: {
        cancelAnimationFrame: "readonly",
        console: "readonly",
        document: "readonly",
        HTMLElement: "readonly",
        requestAnimationFrame: "readonly",
        window: "readonly",
      },
    },
  },
);

import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  prettier,

  {
    files: [
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "tests/**/*.{js,jsx,ts,tsx}",
    ],
    ...jest.configs["flat/recommended"],
  },

  {
    files: ["jest.config.{js,mjs,cjs}", "infra/scripts/**/*.{js,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    files: ["infra/migrations/**/*.{js,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),
]);

import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "node_modules/**",
  ]),

  js.configs.recommended,
  ...nextVitals,
  ...nextTs,
  ...tseslint.configs.recommended,
  prettier,

  {
    files: [
      "**/*.test.{js,jsx,ts,tsx}",
      "**/*.spec.{js,jsx,ts,tsx}",
      "tests/**/*.{js,jsx,ts,tsx}",
    ],
    plugins: {
      jest,
    },
    languageOptions: {
      globals: {
        ...jest.environments.globals.globals,
      },
    },
    rules: {
      ...jest.configs["flat/recommended"].rules,
    },
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
]);

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  // Configuração global para todos os arquivos JS/TS
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs}"],
    languageOptions: {
      sourceType: "module",
    },
  },

  // Configs do Next.js (Core Web Vitals + TypeScript)
  ...nextVitals,
  ...nextTs,

  // Desativa regras de formatação que conflitam com Prettier
  prettier,

  // Config específica para arquivos de teste
  {
    files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js"],
    ...jest.configs["flat/recommended"],
  },

  // Ajustes para scripts de infraestrutura
  {
    files: ["jest.config.js", "infra/scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // Ajustes para migrations (variáveis de migration às vezes não são usadas)
  {
    files: ["infra/migrations/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  // Ignora pastas de build e arquivos gerados
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "node_modules/**",
    "next-env.d.ts",
  ]),
]);

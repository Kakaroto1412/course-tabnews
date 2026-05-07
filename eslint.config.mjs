import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import nextVitals from "eslint-config-next/core-web-vitals";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  // Ignora pastas de build / infra que não fazem sentido lintar
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
    ],
  },

  // Regras base de JavaScript
  js.configs.recommended,

  // Regras oficiais do Next (core web vitals)
  ...nextVitals,

  // Desliga regras de estilo que conflitam com Prettier
  prettier,

  // Bloco específico para arquivos de teste (Jest)
  {
    files: ["**/*.test.{js,jsx}", "**/*.spec.{js,jsx}", "tests/**/*.{js,jsx}"],
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

  // Bloco para scripts CJS (jest.config.js, scripts de infra)
  {
    files: ["jest.config.{js,mjs,cjs}", "infra/scripts/**/*.{js,mjs,cjs}"],
    rules: {
      // Ajuste aqui se quiser permitir outras coisas em scripts
      "no-undef": "off",
      "no-unused-vars": "off",
    },
  },

  // Bloco para migrations: desliga no-unused-vars (pgm, etc.)
  {
    files: ["infra/migrations/**/*.{js,mjs,cjs}"],
    rules: {
      "no-unused-vars": "off",
    },
  },
]);

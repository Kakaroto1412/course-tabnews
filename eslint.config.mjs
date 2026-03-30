import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jest from "eslint-plugin-jest";
import prettier from "eslint-config-prettier/flat";

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,

  {
    files: ["**/*.test.js", "**/*.spec.js", "tests/**/*.js"],
    ...jest.configs["flat/recommended"],
  },

  {
    files: ["jest.config.js", "infra/scripts/**/*.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  {
    files: ["infra/migrations/**/*.js"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

// {
//   "extends": [
//     "eslint:recommended",
//     "plugin:jest/recommended",
//     "next/core-web-vitals",
//     "prettier"
//   ]
// }

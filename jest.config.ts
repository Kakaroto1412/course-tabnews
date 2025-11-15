import type { Config } from "jest";

const config: Config = {
  watchPathIgnorePatterns: ["<rootDir>/.next/", "<rootDir>/node_modules/"],
};

export default config;

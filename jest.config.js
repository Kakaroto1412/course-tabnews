import { config } from "dotenv";
config({
  path: ".env",
});

import nextJest from "next/jest";

const createJestConfig = nextJest({
  dir: ".",
});
const jestConfig = createJestConfig({
  moduleDirectories: ["node_modules", "<rootDir>"],
});

export default jestConfig;

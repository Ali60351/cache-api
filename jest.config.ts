import { defaults } from 'jest-config';

const config = {
  ...defaults,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverage: true,
  resetMocks: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!<rootDir>/index.ts",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  rootDir: "./src",
};

export default config;
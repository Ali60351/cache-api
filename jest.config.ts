import { defaults } from 'jest-config';

const config = {
  ...defaults,
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  collectCoverage: true,
  resetMocks: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!<rootDir>/index.ts",
    "!<rootDir>/config.ts",
    "!<rootDir>/database.ts",
    "!**/node_modules/**",
    "!**/vendor/**"
  ],
  rootDir: "./src",
  maxWorkers: 1,
  detectOpenHandles: true
};

export default config;
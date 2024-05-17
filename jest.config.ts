import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
  verbose: true,
  collectCoverage: false,
  errorOnDeprecated: true,
  maxWorkers: 1,
  testMatch: [
    '**/__tests__/**/*.spec.ts'
  ],
  preset: 'ts-jest'
};

export default config;

/** @type {import('jest').Config} */
const config = {
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/open-paws-strategy/', '/.next/'],
  projects: [
    {
      displayName: 'node',
      testEnvironment: 'node',
      testMatch: [
        '**/__tests__/lib/**/*.test.js',
        '**/__tests__/api/**/*.test.js',
        '**/__tests__/data/**/*.test.js',
        '**/__tests__/data-integrity.test.js',
        '**/__tests__/gap-scoring.test.js',
        '**/__tests__/report-generator.test.js',
      ],
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
    },
    {
      displayName: 'jsdom',
      testEnvironment: 'jsdom',
      testMatch: ['**/__tests__/components/**/*.test.js'],
      transform: {
        '^.+\\.jsx?$': 'babel-jest',
      },
      setupFilesAfterEnv: ['@testing-library/jest-dom'],
      moduleNameMapper: {
        // Map CSS imports to empty module
        '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
      },
    },
  ],
};

module.exports = config;

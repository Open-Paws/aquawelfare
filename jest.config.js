/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.test.js'],
  // Exclude the strategy submodule from test discovery
  testPathIgnorePatterns: ['/node_modules/', '/open-paws-strategy/', '/.next/'],
};

module.exports = config;

/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.cjs'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx'],
  transform: {
    '^.+\\.(t|j)sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/components/common/**',
    '!src/utils/test-utils/**',
    '!src/main.tsx',
    '!src/App.tsx',
  ],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/src/components/common/',
    '/src/utils/test-utils/',
  ],
};

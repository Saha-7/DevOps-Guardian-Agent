module.exports = {
  rootDir: '.', 
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src//*.js',
    '!src/tests/',
    '!src/index.js'
  ],
  testMatch: [
    '<rootDir>/src/tests/*/.test.js' 
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  testTimeout: 10000,
  verbose: true
};
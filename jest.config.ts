export default {
  transform: { '^.+\\.ts?$': 'ts-jest' },
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testPathIgnorePatterns: [
    '<rootDir>/.stryker-tmp/',
    '<rootDir>/node_modules/',
    '<rootDir>/src/controllers',
    '<rootDir>/coverage/',
    '<rootDir>/src/models/*',
    '<rootDir>/src/models/typing/',
  ],
  //~ is ./src
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1',
  },
};

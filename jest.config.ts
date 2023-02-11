/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePaths: ['<rootDir>'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@modules(.*)$': '<rootDir>/src/modules$1',
    '^@entities(.*)$': '<rootDir>/src/common/entities$1',
    '^@constants(.*)$': '<rootDir>/src/common/constants$1',
    '^@mocks(.*)$': '<rootDir>/src/common/mocks$1',
    '^@utils(.*)$': '<rootDir>/src/common/utils$1',
  },
};

module.exports = {
  roots: ['<rootDir>'],
  testRegex: '(/__tests__/.*|(\\.|/)(test))\\.(jsx?)$',
  testEnvironment: 'node', // overridden based on the type of package we build - `jsdom` or `node`
  transform: {
    '^.+\\.(js|jsx)?$': 'babel-jest',
  },
  transformIgnorePatterns: ['<rootDir>/node_modules/'],
  projects: ['<rootDir>'],
  verbose: true,
  resetMocks: true,
  clearMocks: true,
}

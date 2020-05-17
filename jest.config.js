module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/__tests__/setup.ts'],
  testMatch: ['**/__tests__/**/*.spec.ts'],
}

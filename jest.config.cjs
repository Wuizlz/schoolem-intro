module.exports = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  setupFiles: ["<rootDir>/tests/setupGlobals.js"],
  collectCoverageFrom: ["src/**/*.js"],
};

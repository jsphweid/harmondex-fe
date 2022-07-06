module.exports = {
  preset: `ts-jest`,
  rootDir: `.`,
  globals: {
    "ts-jest": {
      tsconfig: `tsconfig.json`,
    },
    __PATH_PREFIX__: ``,
    __BASE_PATH__: ``,
  },
  moduleDirectories: [`node_modules`, `src`],
  moduleFileExtensions: [`ts`, `tsx`, `js`, `jsx`, `json`, `node`],
  moduleNameMapper: {
    ".+\\.(css|styl|less|sass|scss)$": `identity-obj-proxy`,
    "@/(.*)": `<rootDir>/src/$1`,
  },
  testEnvironment: `jsdom`,
  testPathIgnorePatterns: [`node_modules`, `\\.cache`, `<rootDir>.*/public`],
  transform: {
    "^.+\\.tsx?$": `ts-jest`,
  },
  transformIgnorePatterns: [`node_modules/(?!(gatsby)/)`],
};

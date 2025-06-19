module.exports = {
    moduleFileExtensions: ["js", "json", "ts"],
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest",
        "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.json" }],
    },
    testPathIgnorePatterns: ["<rootDir>/e2e/"],
};

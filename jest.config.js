const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
    globals: {
        "ts-jest": {
            tsconfig: "<rootDir>/tsconfig.json",
        },
    },
    moduleFileExtensions: ["js", "json", , "ts"],
    testEnvironment: "node",
    transform: {
        "^.+\\.js$": "babel-jest",
        ...tsjPreset.transform,
    },
};

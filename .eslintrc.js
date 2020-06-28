module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    extends: [
        "plugin:vue/essential",
        "airbnb-base",
    ],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly",
        expect: "readonly",
    },
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: "module",
    },
    plugins: [
        "vue",
    ],
    rules: {
        indent: ["error", 4, { SwitchCase: 1 }],
        quotes: ["error", "double"],
        "max-len": ["warn", 120],
        "no-console": "off",
        "no-plusplus": "off",
        "object-curly-spacing": ["error", "always"],
        "vue/script-indent": ["error", 4, {
            baseIndent: 1,
            switchCase: 1,
            ignores: [],
        }],
        "arrow-parens": "off",
        "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    },
    overrides: [
        {
            files: ["*.vue"],
            rules: {
                indent: "off",
            },
        },
    ],
};

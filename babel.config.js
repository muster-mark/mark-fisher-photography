module.exports = {
    presets: ["@babel/preset-env"],
    plugins: [
        "@babel/plugin-syntax-dynamic-import",
    ],
    env: {
        test: {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            node: 12,
                        },
                    },
                ],
            ],
        },
    },
};

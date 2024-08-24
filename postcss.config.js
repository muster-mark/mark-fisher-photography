module.exports = {
    plugins: [
        require("autoprefixer"),
        require("postcss-logical")({
            dir: "ltr",
        }),
        require("cssnano")({
            preset: "default",
        }),
    ],
};

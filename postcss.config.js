module.exports = {
    plugins: [
        require("autoprefixer"),
        require("postcss-logical")({
            dir: "ltr",
        }),
        require("postcss-clamp")(), // Clamp not supported in and_qq, and_uc, ios_saf < 13.4, kaios
    ]
}
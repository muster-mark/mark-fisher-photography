module.exports = {
    plugins: [
        require("autoprefixer"),
        require("postcss-logical")({
            dir: "ltr",
        })
    ]
}
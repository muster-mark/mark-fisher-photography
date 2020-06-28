const path = require("path");

const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const productionPlugins = [
    new BundleAnalyzer({
        analyzerPort: 8889,
        defaultSizes: "gzip",
        analyzerMode: "static",
        reportFilename: `./../../reports/bundle_analyzer/${new Date().toISOString()}.html`,
        openAnalyzer: true,
    }),
    new TerserPlugin(),
];


module.exports = {
    mode: "production",
    entry: "./source/assets/js/main.js",
    output: {
        path: path.resolve(__dirname, "public/assets/"),
        filename: "main.js",
        publicPath: "/public/",
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader",
                    // Compiles Sass to CSS
                    "sass-loader",
                ],
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.js$/,
                loader: "babel-loader",
            },
        ],
    },
    plugins: [
        ...productionPlugins,
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin(),
        new CopyPlugin({
            patterns: [
                {
                    from: "source/static",
                    to: "../",
                    globOptions: {
                        ignore: ["**/.DS_Store"],
                    },
                },
            ],
        }),
    ],
};

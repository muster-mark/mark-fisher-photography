const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const isDevelopment = process.env.NODE_ENV !== "production";

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
    mode: isDevelopment ? "development" : "production",
    entry: "./source/assets/js/main.js",
    output: {
        path: path.resolve(__dirname, "public/assets/"),
        filename: "[name].[contenthash].bundle.js",
        publicPath: "/public/",
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    // Translates CSS into CommonJS
                    "css-loader?url=false",
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
        ...(isDevelopment ? [] : productionPlugins),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ["../**/*", "**/*"],
            dangerouslyAllowCleanPatternsOutsideProject: true,
            dry: false,
            verbose: true,
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].[hash].css", // TODO should this be chunkhash (or even contentHash)
        }),
        new WebpackManifestPlugin({
            filter: descriptor => descriptor.chunk,
        }),
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

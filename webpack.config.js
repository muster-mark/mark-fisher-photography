const path = require("path");

const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const BundleAnalyzer = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");
const {VueLoaderPlugin} = require("vue-loader");
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
        openAnalyzer: false,
    }),
    new TerserPlugin(),
    new CleanWebpackPlugin({
        cleanOnceBeforeBuildPatterns: ["../**/*", "**/*"],
        dangerouslyAllowCleanPatternsOutsideProject: true,
        dry: false,
        verbose: true,
    }),
];

module.exports = {
    mode: isDevelopment ? "development" : "production",
    entry: "./source/assets/js/main.ts",
    output: {
        path: path.resolve(__dirname, "public/assets/"),
        filename: "[name].bundle.js?v=[contenthash:6]",  // Hash must be in query not file name, to allow --size-only S3 sync
        publicPath: "/public/",
    },
    // used for resolving webpack's loader packages
    resolveLoader: {
        extensions: [ '.js', '.json', '.ts' ],
        mainFields: [ 'loader', 'main' ]
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json']
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        // Translates CSS into CommonJS
                        loader: "css-loader",
                        options: {
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader"
                    },
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
            {
                test: /\.tsx?$/,
                use: {
                    loader:'ts-loader',
                    options: {
                        configFile: __dirname + "/tsconfig.json",
                        appendTsSuffixTo: [/\.vue$/],
                    },
                }
            },
        ],
    },
    plugins: [
        ...(isDevelopment ? [] : productionPlugins),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].css?v=[contenthash:6]", // Hash must be in query not file name, to allow --size-only S3 sync
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

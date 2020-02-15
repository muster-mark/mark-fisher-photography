const Encore = require('@symfony/webpack-encore');
const ImageminWebpWebpackPlugin = require("imagemin-webp-webpack-plugin");
const bundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/assets/')
    // public path used by the web server to access the output path
    .setPublicPath('/public')
    .addEntry('main', './source/assets/js/main.js')
    .disableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(false)
    .enableSassLoader()
    .enableVueLoader()
    .configureTerserPlugin(function(config) {
        return config;
    })
    .addPlugin(new bundleAnalyzer({
        analyzerPort: 8889,
        defaultSizes: 'gzip',
    }))
;


module.exports = Encore.getWebpackConfig();

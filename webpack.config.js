const Encore = require('@symfony/webpack-encore');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

Encore
    // directory where compiled assets will be stored
    .setOutputPath('public/assets/')
    // public path used by the web server to access the output path
    .setPublicPath('/public')
    .addEntry('main', './source/assets/js/main.js')
    .disableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(true)
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(false)
    .enableSassLoader()
    .enableVueLoader()
    .configureTerserPlugin((config) => {
        return config;
    });

if (process.env.NODE_ENV === 'production' || true) {
    Encore.addPlugin(new BundleAnalyzer({
        analyzerPort: 8889,
        defaultSizes: 'gzip',
        analyzerMode: 'static',
        reportFilename: `./../../reports/bundle_analyzer/${new Date().toISOString()}.html`,
        openAnalyzer: true,
    }));
}

module.exports = Encore.getWebpackConfig();

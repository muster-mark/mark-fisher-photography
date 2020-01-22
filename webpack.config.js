const Encore = require('@symfony/webpack-encore');
const ImageminWebpWebpackPlugin= require("imagemin-webp-webpack-plugin");

Encore
// directory where compiled assets will be stored
    .setOutputPath('public/')
    // public path used by the web server to access the output path
    .setPublicPath('/public')
    .copyFiles({
        from: './source/static',
    })
    .addEntry('assets/main', './source/assets/js/main.js')
    .disableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(false)
    .enableSassLoader()
;



module.exports = Encore.getWebpackConfig();

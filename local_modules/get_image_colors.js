// From https://github.com/colorjs/get-image-colors
// Without the svg stuff, due to vulnerabilities in get-svg-colors

const getPixels = require('get-pixels')
const getRgbaPalette = require('get-rgba-palette')
const chroma = require('chroma-js')

function colorPalette (input, options) {
    options = options ?? {
        type: undefined,
        count: 5,
    };

    return new Promise((resolve, reject) => {
        paletteFromBitmap(input, options)
            .then(resolve)
            .catch(reject);
    });
}

function paletteFromBitmap (filename, options) {
    options = options ?? {
        type: undefined,
        count: 5,
    };

    return new Promise((resolve, reject) => {
        getPixels(filename, options.type, (err, pixels) => {
            if (err) {
                reject(err);
            }

            const palette = getRgbaPalette(pixels.data, options.count).map(function (rgba) {
                return chroma(rgba)
            });

            resolve(palette);
        });
    });
}

module.exports = colorPalette;

// From https://github.com/colorjs/get-image-colors
// Without the svg stuff, due to vulnerabilities in get-svg-colors

import getPixels from "get-pixels";
//@ts-ignore
import getRgbaPalette from "get-rgba-palette";
import chroma from "chroma-js";

interface Options {
    type?: string;
    count?: number;
}

function colorPalette(input: string, options: Options): Promise<chroma.Color[]> {
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

function paletteFromBitmap(filename: string, options: Options): Promise<chroma.Color[]> {
    options = options ?? {
        type: undefined,
        count: 5,
    };

    return new Promise((resolve, reject) => {
        getPixels(filename, options.type, (err, pixels) => {
            if (err) {
                reject(err);
            }

            const palette = getRgbaPalette(pixels.data, options.count).map(function (rgba: [number, number, number]) {
                return chroma(rgba)
            });

            resolve(palette);
        });
    });
}

export default colorPalette;

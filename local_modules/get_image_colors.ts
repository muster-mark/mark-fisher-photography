// From https://github.com/colorjs/get-image-colors
// Without the svg stuff, due to vulnerabilities in get-svg-colors

import fs from "fs/promises";

import chroma from "chroma-js";
//@ts-ignore
import getRgbaPalette from "get-rgba-palette";
import jpeg from "jpeg-js";
import ndarray from "ndarray";

interface Options {
    count?: number;
}

async function getPixels(path: string) {
    const data = await fs.readFile(path);
    const jpegData = jpeg.decode(data);
    if (!jpegData) {
      throw new Error("Error decoding jpeg")
    }
    var nshape = [jpegData.height, jpegData.width, 4];
    var result = ndarray(jpegData.data, nshape);
    return result.transpose(1, 0);
}

async function paletteFromBitmap(filename: string, options: Options): Promise<chroma.Color[]> {
    options = {
        count: 5,
        ...options,
    };

    const pixels = await getPixels(filename);
    return getRgbaPalette(pixels.data, options.count).map(function (rgba: [number, number, number]) {
        return chroma(rgba);
    });
}

async function colorPalette(input: string, options: Options): Promise<chroma.Color[]> {
    options = {
        count: 5,
        ...options,
    };

    return paletteFromBitmap(input, options);
}

export default colorPalette;

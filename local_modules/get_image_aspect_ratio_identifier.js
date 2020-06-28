module.exports = function getImageAspectRatioIdentifier(width, height) {
    const widthOverHeight = width / height;

    // Based on image with long edge of 840px

    if (Math.abs(widthOverHeight - (297 / 210)) < 0.001) {
        return 'a4landscape';
    }

    if (Math.abs(widthOverHeight - (210 / 297)) < 0.001) {
        return 'a4portrait';
    }

    switch (widthOverHeight) {
        case 1:
            return '1to1';
        case 4 / 3:
            return '4to3';
        case 0.75:
            return '3to4';
        case 1.5:
            return '3to2';
        case 2 / 3:
            return '2to3';
        case 2:
            return '2to1';
        case 0.5:
            return '1to2';
        case 1.4:
            return '7to5';
        case 5 / 7:
            return '5to7';
        case 3:
            return '3to1';
        case 1 / 3:
            return "1to3";
        default:
            throw new Error(`${widthOverHeight} is not a standard aspect ratio`);
    }
};

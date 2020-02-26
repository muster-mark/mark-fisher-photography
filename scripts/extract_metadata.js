// Write a json file for each image containing metadata

const util = require('util');
const path = require('path');
const fs = require('fs');
const exec = util.promisify(require('child_process').exec);
const exiftool = require('node-exiftool');
const MarkdownIt = require('markdown-it');
const colors = require('colors');
const getColors = require('get-image-colors');
const DateSeason = require('date-season');
const slug = require('slug');

const getImageAspectRatioIdentifier = require('./../local_modules/get_image_aspect_ratio_identifier');

const md = new MarkdownIt();
const ep = new exiftool.ExiftoolProcess();

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'blue',
    error: 'red',
});

const rootDir = path.normalize(`${__dirname}/..`);
const metadataImagesDir = path.normalize(`${rootDir}/source/metadata_images/`);
const metadataJsonDir = path.normalize(`${rootDir}/source/metadata_json/`);

const getAllGalleries = async function getAllGalleries() {
    let galleries = await util.promisify(fs.readdir)(metadataImagesDir);
    galleries = galleries.filter((gallery) => gallery.charAt(0) !== '.'); // Ignore e.g. .DS_Store
    return galleries;
};

async function getRelevantMetadata(image, gallery) {
    let imageAspectRatioIdentifier;

    try {
        imageAspectRatioIdentifier = getImageAspectRatioIdentifier(image.ImageWidth, image.ImageHeight);
    } catch (err) {
        console.warn(`${image.FileName} does not have a standard aspect ratio`.info);
        imageAspectRatioIdentifier = 'invalid';
    }

    const colorsArray = await getColors(`${metadataImagesDir + gallery}/${image.FileName}`);
    // e.g. Change 2019:03:04 08:43:00 to 2019-03-04 08:43:00
    const standardDate = image.DateTimeOriginal.replace(/:/, '-').replace(/:/, '-');

    return {
        FileName: image.FileName,
        Gallery: gallery,
        Slug: slug(image.Title, { lower: true }),
        CaptionAbstract: typeof image['Caption-Abstract'] === 'string' ? md.render(image['Caption-Abstract']) : null,
        Make: image.Make,
        Model: image.Model,
        Lens: image.Lens,
        ExposureTime: image.ExposureTime,
        FNumber: image.FNumber,
        ISO: image.ISO,
        DateTimeOriginal: standardDate,
        // Co-opting the OriginalTransmissionReference (called Job Identifier in Lightroom)
        // to hold the publish date in yyyy-mm-dd format
        DatePublished: /\d{4}-\d{2}-\d{2}/.test(image.OriginalTransmissionReference) ? `${image.OriginalTransmissionReference} 00:00:00` : null,
        ApertureValue: image.ApertureValue,
        ExposureCompensation: image.ExposureCompensation,
        Flash: image.Flash,
        FocalLength: image.FocalLength,
        Keywords: image.Keywords,
        Headline: image.Headline,
        Title: image.Title,
        ShutterSpeedValue: image.ShutterSpeedValue,
        Sublocation: image.Location, // Don't use Sub-Location as truncated to 32 characters
        CountryPrimaryLocationName: image['Country-PrimaryLocationName'],
        CountryPrimaryLocationCode: image['Country-PrimaryLocationCode'],
        State: image.State,
        GPSLatitudeRef: image.GPSLatitudeRef,
        GPSLongitudeRef: image.GPSLongitudeRef,
        ImageWidth: image.ImageWidth, // Image width when long edge is 840px
        ImageHeight: image.ImageHeight, // Image height when long edge is 840px
        ImageAspectRatio: image.ImageWidth / image.ImageHeight,
        ImageAspectRatioIdentifier: imageAspectRatioIdentifier,
        Colors: colorsArray.map((color) => color.hex()),
        Season: (new DateSeason({
            autumn: true,
            north: image.GPSLatitudeRef === 'North',
        })(new Date(standardDate))).toLowerCase(),
    };
}

const getMetaDataForGallery = async function getMetaDataForGallery(gallery) {
    const allImageMetaData = await ep.readMetadata(metadataImagesDir + gallery);

    let relevantImageMetaData = [];

    if (!allImageMetaData.data) {
        return Promise.reject(new Error(`Gallery ${gallery} is empty`));
    }

    relevantImageMetaData = await Promise.all(
        allImageMetaData.data.map((image) => getRelevantMetadata(image, gallery)),
    );

    return Promise.resolve(relevantImageMetaData);
};

const main = async function main() {
    const galleries = await getAllGalleries();
    const allMetadata = [];

    await ep.open();

    await Promise.all(galleries.map(async (gallery) => {
        try {
            // Remove directory of json files for directory
            await exec(`rm -r ${metadataJsonDir}${gallery}`);
        } catch (err) {
            // No big deal
        }
        await util.promisify(fs.mkdir)(metadataJsonDir + gallery); // Recreate empty directory

        await getMetaDataForGallery(gallery)
            .then((imagesMetadata) => {
                imagesMetadata.forEach((imageMetadata) => {
                    allMetadata.push(imageMetadata);
                    const fileName = `${metadataJsonDir + gallery}/${imageMetadata.FileName.replace('.jpg', '.json')}`;
                    fs.writeFile(fileName, JSON.stringify(imageMetadata, null, 2), () => {
                        // Out of order due to asynchronicity
                        console.log(`Writing JSON file for ${imageMetadata.FileName.replace('.jpg', '.json')} in ${gallery}`);
                    });
                });
            })
            .catch((error) => {
                console.error(error.message);
            });
    }));

    fs.writeFile(`${metadataJsonDir}all.json`, JSON.stringify({ images: allMetadata }, null, 2), () => {
        console.log(`Wrote all.json to ${metadataJsonDir}`);
    });

    await ep.close();


    return Promise.resolve(0);
};

main();

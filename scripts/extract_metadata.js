// Write a json file for each image containing metadata

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const exiftool = require('node-exiftool');
const ep = new exiftool.ExiftoolProcess();
const path = require('path');
const fs = require('fs');
const slug = require('slug');
const getImageAspectRatioIdentifier = require('./../local_modules/get_image_aspect_ratio_identifier');
const getColors = require('get-image-colors');
const dateSeason = require('date-season');
const md = new require('markdown-it')();

const rootDir = path.normalize(__dirname + '/..');
const metadataImagesDir = path.normalize(rootDir + '/source/metadata_images/');
const metadataJsonDir = path.normalize(rootDir + '/source/metadata_json/');


let getAllGalleries = async function getAllGalleries() {
    let galleries = await fs.promises.readdir(metadataImagesDir);
    galleries = galleries.filter(function (gallery) {
        return gallery.charAt(0) !== "."; //Ignore e.g. .DS_Store
    });
    return galleries;
};

async function getRelevantMetadata(image, gallery) {
    let imageAspectRatioIdentifier;

    try {
        imageAspectRatioIdentifier = getImageAspectRatioIdentifier(image.ImageWidth, image.ImageHeight);
    } catch (err) {
        console.warn(`${image.FileName} does not have a standard aspect ratio`);
        imageAspectRatioIdentifier = "invalid";
    }

    let colorsArray = await getColors(metadataImagesDir + gallery + '/' + image.FileName);
    const standardDate = image.DateTimeOriginal.replace(/:/, '-').replace(/:/, '-'); // e.g. Change 2019:03:04 08:43:00 to 2019-03-04 08:43:00
    return {
        FileName: image.FileName,
        PositionInGallery: parseInt(image.FileName),
        Gallery: gallery,
        Slug: slug(image.Title, {lower: true}),
        CaptionAbstract: typeof image['Caption-Abstract'] === 'string' ? md.render(image['Caption-Abstract']) : null,
        Make: image.Make,
        Model: image.Model,
        Lens: image.Lens,
        ExposureTime: image.ExposureTime,
        FNumber: image.FNumber,
        ISO: image.ISO,
        DateTimeOriginal: standardDate,
        ApertureValue: image.ApertureValue,
        ExposureCompensation: image.ExposureCompensation,
        Flash: image.Flash,
        FocalLength: image.FocalLength,
        Keywords: image.Keywords,
        Headline: image.Headline,
        Title: image.Title,
        ShutterSpeedValue: image.ShutterSpeedValue,
        Sublocation: image.Location, //Don't use Sub-Location as truncated to 32 characters
        CountryPrimaryLocationName: image['Country-PrimaryLocationName'],
        CountryPrimaryLocationCode: image['Country-PrimaryLocationCode'],
        State: image.State,
        GPSLatitudeRef: image.GPSLatitudeRef,
        GPSLongitudeRef: image.GPSLongitudeRef,
        ImageWidth: image.ImageWidth, // Long edge is 840px
        ImageHeight: image.ImageHeight, //Long edge is 840px
        ImageAspectRatio: image.ImageWidth / image.ImageHeight,
        ImageAspectRatioIdentifier: imageAspectRatioIdentifier,
        Colors: colorsArray.map(color => color.hex()),
        Season: (new dateSeason({autumn: true, north: image.GPSLatitudeRef === "North"})(new Date(standardDate))).toLowerCase()
    };
}

let getMetaDataForGallery = async function getMetaDataForGallery(gallery) {

    let allImageMetaData = await ep.readMetadata(metadataImagesDir + gallery);

    let relevantImageMetaData = [];

    if (!allImageMetaData.data) {
        return Promise.reject({
            message: "Gallery " + gallery + " is empty"
        });
    }

    relevantImageMetaData = await Promise.all(
        allImageMetaData.data.map(image => getRelevantMetadata(image, gallery))
    );


    relevantImageMetaData = relevantImageMetaData.sort(function (a, b) {
        return a.PositionInGallery < b.PositionInGallery ? -1 : 1;
    });

    return Promise.resolve(relevantImageMetaData);
};

let main = async function main() {

    let galleries = await getAllGalleries();
    let allMetadata=[];

    await ep.open();

    for (let gallery of galleries) {

        try {
            //Remove directory of json files for directory
            await exec('rm -r ' + metadataJsonDir + gallery);
        } catch (err) {
            //No big deal
        }
        await fs.promises.mkdir(metadataJsonDir + gallery); //Recreate empty directory

        await getMetaDataForGallery(gallery)
            .then(function (imagesMetadata) {

                imagesMetadata.forEach(function (imageMetadata) {
                    allMetadata.push(imageMetadata);
                    let fileName = metadataJsonDir + gallery + '/' + imageMetadata.FileName.replace('.jpg', '.json');
                    fs.writeFile(fileName, JSON.stringify(imageMetadata, null, 2), () => {
                        console.log("Writing JSON file for " + imageMetadata.FileName.replace('.jpg', '.json') + " in " + gallery); //Out of order due to asynchronicity
                    });
                });

            })
            .catch(function (error) {
                console.error(error.message);
            });
    }

    fs.writeFile(metadataJsonDir + 'all.json', JSON.stringify({"images": allMetadata}, null, 2), () => {
        console.log("Wrote all.json to " + metadataJsonDir);
    });

    await ep.close();


    return Promise.resolve(0);
};

return main();



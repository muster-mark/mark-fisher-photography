//The end result of running this file is to end up with a bunch of json files containing the metadata for the images

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const exiftool = require('node-exiftool');
const ep = new exiftool.ExiftoolProcess();
const path = require('path');
const fs = require('fs');
const slug = require('slug');

const rootDir = path.normalize(__dirname + '/..');
const metadataImagesDir = path.normalize(rootDir + '/source/metadata_images/');
const metadataJsonDir = path.normalize(rootDir + '/source/metadata_json/');

let getImageAspectRatioIdentifier = function getImageAspectRatioIdentifier(widthOverHeight) {

    //Based on Lightroom export with long edge of 840px

    if (widthOverHeight === 1) {
        return "1to1";
    }

    if (widthOverHeight === 4 / 3) {
        return "4to3";
    }

    if (widthOverHeight === 0.75) {
        return "3to4";
    }

    if (widthOverHeight === 1.5) {
        return "3to2";
    }

    if (widthOverHeight === 2 / 3) {
        return "2to3";
    }

    if (widthOverHeight === 2) {
        return "2to1";
    }

    if (widthOverHeight === 0.5) {
        return "1to2";
    }

    if (Math.abs(widthOverHeight - (297 / 210)) < 0.001) {
        return "a4landscape";
    }

    if (Math.abs(widthOverHeight - (210 / 297)) < 0.001) {
        return "a4portrait";
    }

    if (widthOverHeight === 1.4) {
        return "7to5";
    }

    if (Math.abs(widthOverHeight - 5 / 7) < 0.001) {
        return "5to7";
    }

    throw new Error(`${widthOverHeight} is not a standard aspect ratio`);

};

let getAllGalleries = async function getAllGalleries() {
    let galleries = await fs.promises.readdir(metadataImagesDir);
    galleries = galleries.filter(function(gallery) {
        return gallery.charAt(0) !== "."; //Ignore e.g. .DS_Store
    });
    return Promise.resolve(galleries);
};

let getMetaDataForGallery = async function getMetaDataForGallery(gallery) {

    let allImageMetaData = await ep.readMetadata(metadataImagesDir + gallery);

    let relevantImageMetaData = [];

    if (!allImageMetaData.data) {
        return Promise.reject({
            message: "Gallery " + gallery + " is empty"
        });
    }

    allImageMetaData.data.forEach(function (image) {

        let imageAspectRatioIdentifier;

        try {
            imageAspectRatioIdentifier = getImageAspectRatioIdentifier(image.ImageWidth / image.ImageHeight);
        } catch (err) {
            console.warn(`${image.FileName} does not have a standard aspect ratio`);
            imageAspectRatioIdentifier = "invalid";
        }


        relevantImageMetaData.push({
            FileName: image.FileName,
            PositionInGallery: parseInt(image.FileName),
            Gallery: gallery,
            SpecialInstructions: slug(image.Title, {lower: true}),
            CaptionAbstract: image['Caption-Abstract'],
            Make: image.Make,
            Model: image.Model,
            Lens: image.Lens,
            ExposureTime: image.ExposureTime,
            FNumber: image.FNumber,
            ISO: image.ISO,
            DateTimeOriginal: image.DateTimeOriginal.replace(/:/, '-').replace(/:/, '-'), // e.g. Change 2019:03:04 08:43:00 to 2019-03-04 08:43:00,
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
        });

    });


    relevantImageMetaData = relevantImageMetaData.sort(function (a, b) {
        return a.PositionInGallery < b.PositionInGallery ? -1 : 1;
    });

    return Promise.resolve(relevantImageMetaData);
};

let main = async function main() {

    let galleries = await getAllGalleries();

    await ep.open();

    for (let gallery of galleries) {

        try {
            //Remove directory of json files for directory
            await exec('rm -r ' + metadataJsonDir + gallery);
        } catch (err) {
            //No big deal
        }
        await fs.promises.mkdir(metadataJsonDir + gallery); //Recreate empty directory

        getMetaDataForGallery(gallery)
            .then(function (imagesMetadata) {

                imagesMetadata.forEach(function (imageMetadata) {
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

    await ep.close();


    return Promise.resolve(0);
};

return main();



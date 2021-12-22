// Write a json file for each image containing metadata

const util = require("node:util");
const path = require("node:path");
const fs = require("node:fs");
const exec = util.promisify(require("node:child_process").exec);
const colors = require("colors");
const junk = require("junk");

const getImageMetadata = require("../local_modules/get_image_metadata.js");

colors.setTheme({
    info: "cyan",
    warn: "yellow",
    debug: "blue",
    error: "red",
});

const rootDir = path.normalize(`${__dirname}/..`);
const metadataImagesDir = path.normalize(`${rootDir}/source/metadata_images`);
const metadataJsonDir = path.normalize(`${rootDir}/source/metadata_json`);

const getAllGalleries = async function getAllGalleries() {
    let galleries = await util.promisify(fs.readdir)(metadataImagesDir);
    galleries = galleries.filter(junk.not);
    return galleries;
};

const getMetaDataForGallery = async function getMetaDataForGallery(gallery) {
    const imageFiles = await util.promisify(fs.readdir)(`${metadataImagesDir}/${gallery}`)
        .then((files) => files.filter(junk.not));

    if (!imageFiles.length) {
        return Promise.reject(new Error(`Gallery ${gallery} is empty`));
    }

    const galleryMetadata = await Promise.all(imageFiles.map((imageFile) => getImageMetadata(`${metadataImagesDir}/${gallery}/${imageFile}`, gallery)));

    return Promise.resolve(galleryMetadata);
};

const main = async function main() {
    const galleries = await getAllGalleries();
    const allMetadata = [];

    await Promise.all(galleries.map(async (gallery) => {
        try {
            // Remove directory of json files for directory
            await exec(`rm -r ${metadataJsonDir}/${gallery}`);
        } catch (err) {
            // No big deal
        }
        await util.promisify(fs.mkdir)(`${metadataJsonDir}/${gallery}`); // Recreate empty directory

        await getMetaDataForGallery(gallery)
            .then((imagesMetadata) => {
                imagesMetadata.forEach((imageMetadata) => {
                    allMetadata.push(imageMetadata);
                    const fileName = `${metadataJsonDir}/${gallery}/${imageMetadata.FileName.replace(".jpg", ".json")}`;
                    fs.writeFile(fileName, JSON.stringify(imageMetadata, null, 2), () => {
                        // Out of order due to asynchronicity
                        console.log(`Writing JSON file for ${imageMetadata.FileName.replace(".jpg", ".json")} in ${gallery}`);
                    });
                });
            })
            .catch((error) => {
                console.error(error.message);
                console.trace();
            });
    }));

    fs.writeFile(
        `${metadataJsonDir}/all.json`,
        JSON.stringify({
            images: allMetadata.sort((a, b) => (a.DatePublished > b.DatePublished ? -1 : 1)),
        }, null, 2), () => {
            console.log(`Wrote all.json to ${metadataJsonDir}`);
        },
    );
};

main();

// Write a json file for each image containing metadata

import util from "node:util";
import path from "node:path";
import fs from "node:fs";
import childProcess from "node:child_process";
import colors from "colors";
import junk from "junk";

const exec = util.promisify(childProcess.exec);

import getImageMetadata from "../local_modules/get_image_metadata";
import {ImageMetadata} from "../types";

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

const getMetaDataForGallery = async function getMetaDataForGallery(galleryName: string) {
    const imageFiles = await util.promisify(fs.readdir)(`${metadataImagesDir}/${galleryName}`)
        .then((files) => files.filter(junk.not));

    if (!imageFiles.length) {
        return Promise.reject(new Error(`Gallery ${galleryName} is empty`));
    }

    const galleryMetadata = await Promise.all(imageFiles.map((imageFile) => getImageMetadata(`${metadataImagesDir}/${galleryName}/${imageFile}`, galleryName)));

    return Promise.resolve(galleryMetadata);
};

const main = async function main() {
    const galleries = await getAllGalleries();
    const allMetadata: ImageMetadata[]= [];

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
        JSON.stringify(
            allMetadata.sort((a, b) => {
                if (a.DatePublished === b.DatePublished) {
                    return Math.sign(Number(new Date(b.DateTimeOriginal)) - Number(new Date(a.DateTimeOriginal)));
                }
                return Math.sign(Number(new Date(b.DatePublished)) - Number(new Date(a.DatePublished)));
            }), null, 2), () => {
            console.log(`Wrote all.json to ${metadataJsonDir}`);
        },
    );
};

main();

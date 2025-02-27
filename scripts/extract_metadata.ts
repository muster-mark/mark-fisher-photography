// Write a json file for each image containing metadata

import { statSync } from "node:fs";
import { readdir, mkdir, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import colors from "colors";

import getImageMetadata from "../local_modules/get_image_metadata";
import { ImageMetadata } from "../types";

colors.setTheme({
    info: "cyan",
    warn: "yellow",
    debug: "blue",
    error: "red",
});

const rootDir = path.join(__dirname, "..");
const metadataImagesDir = path.join(rootDir, "src", "metadata_images");
const metadataJsonDir = path.join(rootDir, "src", "metadata_json");

async function getAllGalleries() {
    return (await readdir(metadataImagesDir)).filter((file) => statSync(`${metadataImagesDir}/${file}`)?.isDirectory());
}

async function getMetaDataForGallery(galleryName: string) {
    const imageFiles = (await readdir(`${metadataImagesDir}/${galleryName}`)).filter((file) => file.endsWith(".jpg"));

    if (!imageFiles.length) {
        throw new Error(`Gallery ${galleryName} is empty`);
    }

    return Promise.all(
        imageFiles.map((imageFile) =>
            getImageMetadata(`${metadataImagesDir}/${galleryName}/${imageFile}`, galleryName),
        ),
    );
}

const main = async function main() {
    const galleries = await getAllGalleries();
    const allMetadata: ImageMetadata[] = [];

    await Promise.all(
        galleries.map(async (gallery) => {
            try {
                await rm(`${metadataJsonDir}/${gallery}`, { recursive: true });
            } catch (err) {
                // No big deal
            }
            await mkdir(`${metadataJsonDir}/${gallery}`); // Recreate empty directory

            await getMetaDataForGallery(gallery)
                .then(async (imagesMetadata) => {
                    imagesMetadata.forEach((imageMetadata) => {
                        allMetadata.push(imageMetadata);
                    });
                    await Promise.all(
                        imagesMetadata.map(async (imageMetadata) => {
                            const fileName = `${metadataJsonDir}/${gallery}/${imageMetadata.Slug}.json`;
                            await writeFile(fileName, JSON.stringify(imageMetadata, null, 2));
                            console.log(
                                `Wrote JSON file for ${imageMetadata.Slug}.json in ${gallery}`,
                            );
                        }),
                    );
                })
                .catch((error) => {
                    console.error(error.message);
                    console.trace();
                });
        }),
    );

    await writeFile(
        `${metadataJsonDir}/all.json`,
        JSON.stringify(
            allMetadata.sort((a, b) => {
                if (a.DatePublished === b.DatePublished) {
                    return Math.sign(Number(new Date(b.DateTimeOriginal)) - Number(new Date(a.DateTimeOriginal)));
                }
                return Math.sign(Number(new Date(b.DatePublished)) - Number(new Date(a.DatePublished)));
            }),
            null,
            2,
        ),
    );

    console.log(`Wrote all.json to ${metadataJsonDir}`);
};

main();

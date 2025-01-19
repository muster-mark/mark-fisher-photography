import path from "node:path";
import { glob, readFile } from "node:fs/promises";

import nunjucks from "../local_modules/nunjucks";
import renderAndWriteTemplate from "../local_modules/render_and_write_template";
import allImages from "../src/metadata_json/all.json";
import galleries from "../local_modules/galleries";

const rootPath = path.join(__dirname, "..");

const metadataDir = path.join(rootPath, "src", "metadata_json");
const publicDir = path.join(rootPath, "public");

// Get 21 most recent images
const homepageImages = allImages
    .sort((a, b) => new Date(b.DatePublished).getTime() - new Date(a.DatePublished).getTime())
    .slice(0, 21)
    .map(({ Slug }) => Slug);

const getImageData = async (slug: string) => {
    const jsonFiles: string[] = [];
    for await (const file of glob(`${metadataDir}/*/${slug}.json`)) {
        jsonFiles.push(file);
    }
    if (jsonFiles.length !== 1) {
        throw new Error(`Unexpected number of JSON files for ${slug}. ${jsonFiles.length} files were found`);
    }

    const fileContents = await readFile(jsonFiles[0], { encoding: "utf-8" });
    return JSON.parse(fileContents.toString());
};

const getImagesData = async () => Promise.all(homepageImages.map((image) => getImageData(image)));

const main = async function () {
    const favouriteImages = await getImagesData().then((data) => {
        return data.map((item) => {
            return {
                ...item,
                brickHeight: Math.round(200 * (item.ImageHeight / item.ImageWidth) + 15),
            };
        });
    });

    renderAndWriteTemplate(
        "_pages/homepage.html.nunj",
        `${publicDir}/index`,
        {
            page: {
                url: "/",
                skipJs: true,
            },
            favouriteImages,
            featuredGalleries: galleries
                .filter((gallery) => gallery.featured)
                .map((gallery) => {
                    const image = allImages.find((image) => image.Slug === gallery.imageSlug);
                    if (!image) {
                        throw new Error(`No image found for gallery ${gallery.name} with slug ${gallery.imageSlug}`);
                    }
                    return {
                        ...gallery,
                        image,
                    };
                }),
            copyrightYear: new Date().getFullYear(),
        },
        nunjucks,
    ).catch((error) => {
        console.log(error);
    });
};

main();

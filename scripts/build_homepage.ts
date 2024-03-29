import path from "node:path";
import fs from "node:fs";
import util from "node:util";
import {glob} from "glob";

import nunjucks from "../local_modules/nunjucks";
import renderAndWriteTemplate from "../local_modules/render_and_write_template";
import allImages from "../source/metadata_json/all.json";
import galleries from "../local_modules/galleries";

const rootPath = path.join(__dirname, "..");

const metadataDir = path.join(rootPath, "source", "metadata_json");
const publicDir = path.join(rootPath, "public");

// Get 20 most recent images
const homepageImages = allImages
    .sort((a, b) => new Date(b.DatePublished).getTime() - new Date(a.DatePublished).getTime())
    .slice(0, 21)
    .map((image) => image.Slug);

const getImageData = async (slug: string) => {
    const jsonFiles = await glob(`${metadataDir}/*/${slug}.json`);
    if (jsonFiles.length !== 1) {
        throw new Error(`Unexpected number of JSON files for ${slug}. ${jsonFiles.length} files were found`);
    }

    return util.promisify(fs.readFile)(jsonFiles[0], { encoding: "utf-8" });
};

const getImagesData = async () => Promise.all(homepageImages.map((image) => getImageData(image)));

const main = async function() {
    const favouriteImages = await getImagesData()
        .then(data => {
            return data.map(string => {
                const imageData = JSON.parse(string.toString());
                imageData.brickHeight = Math.round((200 * (imageData.ImageHeight / imageData.ImageWidth) + 15));
                return imageData;
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
                .filter(gallery => gallery.featured)
                .map(gallery=> {
                    return {
                        ...gallery,
                        image: allImages.find(image => image.Slug === gallery.imageSlug),
                    }
                }),
            copyrightYear: new Date().getFullYear(),
        },
        nunjucks,
    ).catch((error) => {
        console.log(error);
    });
};

main();

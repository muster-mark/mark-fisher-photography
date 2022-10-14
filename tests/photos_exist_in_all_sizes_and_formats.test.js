const { expect } = require("@jest/globals");
import {images} from "../source/metadata_json/all.json";
import {existsSync} from "node:fs";

const photosDir = __dirname + "/../source/static/photos";
const folders = [
    `${photosDir}/l840`,
    `${photosDir}/w200`,
];
const extensions = ["jpg", "webp", "jxl"];

test("Test all photos exist in all sizes and all formats", () => {
    const allSlugs = images.map(image => image.Slug);
    allSlugs.forEach(slug => {
        folders.forEach(folder => {
            extensions.forEach(extension => {
                expect(existsSync(`${folder}/${slug}.${extension}`)).toBeTruthy();
                expect(existsSync(`${folder}/${slug}@2x.${extension}`)).toBeTruthy();
            });
        })
    });
});

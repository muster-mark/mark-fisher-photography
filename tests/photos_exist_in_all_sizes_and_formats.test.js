import { existsSync } from "node:fs";
import path from "node:path";

import { expect } from "@jest/globals";

import images from "../src/metadata_json/all.json";

expect.extend({
    toBeFile(received) {
        const pass = existsSync(received);
        if (pass) {
            return {
                message: () => `expected file ${received} not to exist`,
                pass: true,
            };
        } else {
            return {
                message: () => `expected file ${received} to exist`,
                pass: false,
            };
        }
    },
});

const photosDir = path.resolve(__dirname, "..", "static", "photos");
const folders = [path.resolve(photosDir, "l840"), path.resolve(photosDir, "w200")];
const extensions = ["png", "jpg", "webp", "jxl"];

test("Test all photos exist in all sizes and all formats", () => {
    const allSlugs = images.map((image) => image.Slug);
    allSlugs.forEach((slug) => {
        folders.forEach((folder) => {
            extensions.forEach((extension) => {
                ["", "@2x"].forEach((suffix) => {
                    expect(`${folder}/${slug}${suffix}.${extension}`).toBeFile();
                });
            });
        });
    });
});

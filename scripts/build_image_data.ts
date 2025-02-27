import path from "node:path";
import util from "node:util";
import fs from "node:fs";

import { groupBy } from "lodash";

import images from "../src/metadata_json/all.json";

import type { ImageMetadata } from "../types";

let partialImageMetadata: Partial<ImageMetadata>[] = [];
for (let i = 0; i < images.length; i++) {
    const { ImageAspectRatio, AltText, Slug, Colors, Season, CountryPrimaryLocationName, Gallery } = images[i];
    partialImageMetadata[i] = {
        ImageAspectRatio,
        AltText,
        Slug,
        Colors,
        Season,
        CountryPrimaryLocationName,
        Gallery,
    };
}

const seasonGroups = groupBy(partialImageMetadata, "Season");
const seasonCounts: { name: string; count: number }[] = [];
["spring", "summer", "autumn", "winter"].forEach((season) => {
    seasonCounts.push({ name: season, count: seasonGroups[season].length });
});

const countryGroups = groupBy(partialImageMetadata, "CountryPrimaryLocationName");
const countryCounts: { name: string; count: number }[] = [];
Object.keys(countryGroups).forEach((key) => {
    countryCounts.push({ name: key, count: countryGroups[key].length });
});

countryCounts.sort((a, b) => {
    return Math.sign(a.name.localeCompare(b.name));
});

const data = {
    images: partialImageMetadata,
    countryCounts,
    seasonCounts,
};

util.promisify(fs.writeFile)(path.join(__dirname, "..", "src", "static", "data", "images.json"), JSON.stringify(data))
    .then(() => {
        console.log("Wrote /data/images.json");
    })
    .catch((err) => {
        console.log("Could not write /data/images.json");
        console.log(err);
    });

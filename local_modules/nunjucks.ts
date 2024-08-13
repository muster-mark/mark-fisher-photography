import path from "node:path";
import nunjucks from "nunjucks";
//@ts-ignore
import nunjucksDate from "nunjucks-date";
import dotenv from "dotenv";

import manifest from "../public/assets/manifest.json";
import galleries from "./galleries";

const templatesPath = path.resolve(`${__dirname}/../templates`);

dotenv.config({ path: `${__dirname}/../.production.env` });

const environment = nunjucks.configure(templatesPath, {
    throwOnUndefined: false,
    trimBlocks: true,
});

const stripHTML = (string: string) => string.replace(/(<([^>]+)>)/gi, "");

environment.addGlobal(
    "featured_galleries",
    galleries.filter((gallery) => gallery.featured),
);
environment.addGlobal("env", process.env);
environment.addFilter("date", nunjucksDate);
environment.addFilter("chunk", (name: string) => {
    //@ts-ignore
    const outputFile: string = manifest[name];
    if (!outputFile) {
        throw new Error(`No entry in manifest.json for ${name}`);
    }
    return `/assets/${outputFile.replace("/public/", "")}`;
});
environment.addFilter("captionToMetaDesc", (caption: string) => {
    // Remove html tags
    const MIN_DESC_LENGTH = 300;

    const split = stripHTML(caption).split(". ");
    let desc = "";

    while (desc.length < MIN_DESC_LENGTH && split.length) {
        desc += `${split.shift()}`;
        if (split.length) {
            desc += ". ";
        }
    }
    return desc;
});
/**
 * Returns a JSON stringified version of the value, safe for inclusion in an
 * inline <script> tag. The optional argument 'spaces' can be used for
 * pretty-printing.
 *
 * Output is NOT safe for inclusion in HTML! If that's what you need, use the
 * built-in 'dump' filter instead.
 */
environment.addFilter("json", function (value: any, spaces: number) {
    if (value instanceof nunjucks.runtime.SafeString) {
        value = value.toString();
    }
    const jsonString = JSON.stringify(value, null, spaces).replace(/</g, "\\u003c");
    //@ts-ignore
    return nunjucks.runtime.markSafe(jsonString);
});

export default nunjucks;

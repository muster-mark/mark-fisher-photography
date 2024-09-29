import { statSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { parseArgs } from "node:util";

import { execa, parseCommandString } from "execa";
import pLimit from "p-limit";
import sharp from "sharp";

const {
    values: { image = null, overwrite = false, concurrency: _concurrency = "4" },
} = parseArgs({
    options: {
        image: {
            type: "string",
        },
        overwrite: {
            type: "boolean",
        },
        concurrency: {
            type: "string",
        }
    },
});
const concurrency = parseInt(_concurrency, 10);
const photoDir = path.join(import.meta.dirname, "..", "src", "static", "photos");
const allPngFiles: string[] = [];
const jxlEffort = 9;

function relativeToPhotoDir(file: string) {
    return path.relative(photoDir, file);
}

const formatDefinitions = [
    {
        name: "JPEG XL",
        extension: "jxl",
        async convertPngToFormat(file: string) {
            if (false) {
                // This is experimental at the moment, and doesn't work
                return sharp(file)
                    .jxl({ quality: 85, effort: jxlEffort })
                    .toFile(file.replace(/\.png$/, `.${this.extension}`));
            }
            const commandArray = parseCommandString(
                `cjxl -q 85 --effort=${jxlEffort} --progressive ${file} ${file.replace(/\.png$/, `.${this.extension}`)}`,
            );
            const resultOrError = await execa({
                all: true,
                reject: false,
            })`${commandArray}`;
            if (resultOrError.failed) {
                return Promise.reject(resultOrError.all);
            }
            return Promise.resolve();
        },
    },
    {
        name: "WebP",
        extension: "webp",
        async convertPngToFormat(file: string) {
            return sharp(file)
                .webp({ quality: 75, effort: 6 })
                .toFile(file.replace(/\.png$/, `.${this.extension}`));
        },
    },
    {
        name: "JPEG",
        extension: "jpg",
        convertPngToFormat(file: string) {
            return sharp(file)
                .jpeg({ quality: 70, progressive: true })
                .toFile(file.replace(/\.png$/, `.${this.extension}`));
        },
    },
];

const filesToConvert = formatDefinitions.reduce(
    (acc, { extension }) => {
        return {
            ...acc,
            [extension]: new Set<string>(),
        };
    },
    {} as Record<string, Set<string>>,
);

for await (const file of fs.glob(`${photoDir}/*/${image ?? "*"}.png`)) {
    allPngFiles.push(file);

    for (const formatDefinition of formatDefinitions) {
        const { extension } = formatDefinition;
        const targetFile = file.replace(/\.png$/, `.${extension}`);
        if (overwrite || !(statSync(targetFile, { throwIfNoEntry: false })?.isFile() ?? false)) {
            filesToConvert[extension].add(file);
        }
    }
}

if (allPngFiles.length === 0) {
    if (image) {
        console.error(`No files found for ${image}`);
    }
    console.error("No files found");
    process.exit(1);
}

let didError = false;
const limit = pLimit(concurrency);

for (const formatDefinition of formatDefinitions) {
    const { name: formatName, extension } = formatDefinition;
    if (filesToConvert[extension].size === 0) {
        console.log(`All files are already in ${formatName} format`);
    } else {
        console.group(`Converting to ${formatDefinition.name}`);
        const filesArray = Array.from(filesToConvert[extension].values());
        const conversionResult = await Promise.allSettled(
            filesArray.map((file) => {
                return limit(() => formatDefinition.convertPngToFormat(file));
            }),
        );

        const errorResults: Record<string, PromiseRejectedResult> = {};

        filesArray.forEach((file, index) => {
            const result = conversionResult[index];
            if (result.status === "fulfilled") {
                console.log(`Converted ${relativeToPhotoDir(file)} to ${formatName}`);
            } else {
                didError = true;
                errorResults[file] = result;
            }
        });

        Object.entries(errorResults).forEach(([file, result]) => {
            console.error(`Error converting ${relativeToPhotoDir(file)} to ${extension} ${result.reason}`);
        });

        console.groupEnd();
        console.log("\n");
    }
}

if (didError) {
    console.error("There were some errors converting some of the files. Please check the output above");
    process.exit(1);
}

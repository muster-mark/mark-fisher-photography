import slugify from "slug";
//@ts-expect-error
import DateSeason from "date-season";
import getColors from "./get_image_colors";
//@ts-expect-error
import exiftool from "node-exiftool";
import colors from "colors/safe";
import MarkdownIt from "markdown-it";

import type { ImageMetadata } from "../types";

import getImageAspectRatioIdentifier from "./get_image_aspect_ratio_identifier";

const copiedFields = {
    // Map field on input to field on output
    // Excludes gallery, which is dealt with separately
    FileName: "FileName",
    Make: "Make",
    Model: "Model",
    Lens: "Lens",
    ExposureTime: "ExposureTime",
    FNumber: "FNumber",
    ISO: "ISO",
    ExposureCompensation: "ExposureCompensation",
    Flash: "Flash",
    FocalLength: "FocalLength",
    Keywords: "Keywords",
    AltTextAccessibility: "AltText",
    Title: "Title",
    Location: "Sublocation", // Don't use Sub-Location as truncated to 32 characters
    "Country-PrimaryLocationName": "CountryPrimaryLocationName",
    "Country-PrimaryLocationCode": "CountryPrimaryLocationCode",
    State: "State",
    GPSLatitudeRef: "GPSLatitudeRef",
    GPSLongitudeRef: "GPSLongitudeRef",
    ImageWidth: "ImageWidth",
    ImageHeight: "ImageHeight",
} as const;

const transformedFields = {
    async ImageAspectRatio(metadata: ImageMetadata) {
        return metadata.ImageWidth / metadata.ImageHeight;
    },
    async ImageAspectRatioIdentifier(metadata: ImageMetadata) {
        let imageAspectRatioIdentifier;
        try {
            imageAspectRatioIdentifier = getImageAspectRatioIdentifier(metadata.ImageWidth, metadata.ImageHeight);
        } catch (err) {
            console.warn(colors.yellow(`${metadata.FileName} does not have a standard aspect ratio`));
            imageAspectRatioIdentifier = "invalid";
        }
        return imageAspectRatioIdentifier;
    },
    async Slug(metadata: ImageMetadata) {
        return slugify(metadata.Title, { lower: true });
    },
    async DateTimeOriginal(metadata: ImageMetadata) {
        return metadata.DateTimeOriginal.replace(/:/, "-").replace(/:/, "-");
    },
    async DatePublished(metadata: ImageMetadata) {
        return `${metadata.OriginalTransmissionReference} 00:00:00`;
    },
    async Colors(_metadata: ImageMetadata, args: { pathToFile: string }) {
        const colorsArray = await getColors(args.pathToFile, { count: 1 });
        return colorsArray.map((color) => color.hex());
    },
    async Season(metadata: ImageMetadata) {
        const standardDate = metadata.DateTimeOriginal.replace(/:/, "-").replace(/:/, "-");
        return new DateSeason({
            autumn: true,
            north: metadata.GPSLatitudeRef !== "South",
        })(new Date(standardDate)).toLowerCase();
    },
};

function validateMetadata(metadata: any, fileName: string) {
    if (!metadata.Title) {
        throw new Error(`Title is missing from metadata stored in ${fileName}`);
    }

    if (!metadata.AltTextAccessibility && !metadata.Headline) {
        throw new Error(`AltTText and Headline are missing from metadata stored in ${fileName}`);
    }

    if (
        typeof metadata["Country-PrimaryLocationName"] === "undefined" ||
        !metadata["Country-PrimaryLocationName"].length
    ) {
        throw new Error(`Country name is missing from metadata stored in ${fileName}`);
    }

    const countryCode = metadata["Country-PrimaryLocationCode"];

    if (!/^[A-Z]{2}$/.test(countryCode)) {
        throw new Error(`Country code ${countryCode} stored in ${fileName} is an invalid format`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(metadata.OriginalTransmissionReference)) {
        throw new Error(`Publish date (in Job Identifier field) is invalid or not supplied for ${fileName}`);
    }
}

export default async function getImageMetadata(fileName: string, gallery: string): Promise<ImageMetadata> {
    const ep = new exiftool.ExiftoolProcess();
    await ep.open();

    const metadata: any = await ep
        .readMetadata(fileName)
        .then((res: { data: any[] }) => res.data[0])
        .catch((error: Error) => {
            throw new Error(`There was a problem reading the metadata for ${fileName}: ${error.message}`);
        });

    await ep.close();

    validateMetadata(metadata, fileName);

    //@ts-ignore
    const relevantMetaData: ImageMetadata = {};

    relevantMetaData.Gallery = gallery;

    Object.keys(copiedFields).forEach((key) => {
        //@ts-expect-error
        relevantMetaData[copiedFields[key]] = metadata[key];
    });

    if (!relevantMetaData.AltText) {
        relevantMetaData.AltText = metadata.Headline ?? null;
    }

    await Promise.all(
        (Object.keys(transformedFields) as (keyof typeof transformedFields)[]).map(async (key) => {
            //@ts-expect-error
            relevantMetaData[key] = await transformedFields[key](metadata, {
                pathToFile: fileName,
            });
        }),
    );

    const md = new MarkdownIt();

    if (!!metadata["Caption-Abstract"]) {
        relevantMetaData.CaptionAbstract = md.render(metadata["Caption-Abstract"]).replace(/\n$/, "")
    }

    return relevantMetaData;
}

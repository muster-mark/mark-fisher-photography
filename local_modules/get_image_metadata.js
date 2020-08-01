const slugify = require("slug");
const DateSeason = require("date-season");
const getColors = require("get-image-colors");
const exiftool = require("node-exiftool");
const colors = require("colors");
const MarkdownIt = require("markdown-it");

const getImageAspectRatioIdentifier = require("./get_image_aspect_ratio_identifier");

colors.setTheme({
    info: "cyan",
    warn: "yellow",
    debug: "blue",
    error: "red",
});

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
    Headline: "Headline",
    Title: "Title",
    Location: "Sublocation", // Don't use Sub-Location as truncated to 32 characters
    "Country-PrimaryLocationName": "CountryPrimaryLocationName",
    "Country-PrimaryLocationCode": "CountryPrimaryLocationCode",
    State: "State",
    GPSLatitudeRef: "GPSLatitudeRef",
    GPSLongitudeRef: "GPSLongitudeRef",
    ImageWidth: "ImageWidth",
    ImageHeight: "ImageHeight",
};

const transformedFields = {
    async ImageAspectRatio(metadata) {
        return metadata.ImageWidth / metadata.ImageHeight;
    },
    async ImageAspectRatioIdentifier(metadata) {
        let imageAspectRatioIdentifier;
        try {
            imageAspectRatioIdentifier = getImageAspectRatioIdentifier(metadata.ImageWidth, metadata.ImageHeight);
        } catch (err) {
            console.warn(`${metadata.FileName} does not have a standard aspect ratio`.warn);
            imageAspectRatioIdentifier = "invalid";
        }
        return imageAspectRatioIdentifier;
    },
    async Slug(metadata) {
        return slugify(metadata.Title, { lower: true });
    },
    async DateTimeOriginal(metadata) {
        return metadata.DateTimeOriginal.replace(/:/, "-").replace(/:/, "-");
    },
    async DatePublished(metadata) {
        return `${metadata.OriginalTransmissionReference} 00:00:00`;
    },
    async Colors(metadata, args) {
        const colorsArray = await getColors(args.pathToFile);
        return colorsArray.map((color) => color.hex());
    },
    async Season(metadata) {
        const standardDate = metadata.DateTimeOriginal.replace(/:/, "-").replace(/:/, "-");
        return (new DateSeason({
            autumn: true,
            north: metadata.GPSLatitudeRef !== "South",
        })(new Date(standardDate))).toLowerCase();
    },
};

function validateMetadata(metadata, fileName) {
    if (!metadata.Title) {
        throw new Error(`Title is missing from metadata stored in ${fileName}`);
    }

    if (!metadata.Headline) {
        throw new Error(`Headline is missing from metadata stored in ${fileName}`);
    }

    if (metadata["Country-PrimaryLocationName"] === undefined || !metadata["Country-PrimaryLocationName"].length) {
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

/**
 *
 * @param fileName
 * @param gallery
 * @returns {{}}
 */
module.exports = async function getImageMetadata(fileName, gallery) {
    const ep = new exiftool.ExiftoolProcess();
    await ep.open();

    const metadata = await ep.readMetadata(fileName)
        .then((res) => res.data[0])
        .catch((error) => {
            throw new Error(`There was a problem reading the metadata for ${fileName}: ${error.message}`);
        });

    await ep.close();

    validateMetadata(metadata, fileName);

    const relevantMetaData = {};

    relevantMetaData.Gallery = gallery;

    Object.keys(copiedFields).forEach((key) => {
        relevantMetaData[copiedFields[key]] = metadata[key];
    });

    await Promise.all(Object.keys(transformedFields).map(async (key) => {
        relevantMetaData[key] = await transformedFields[key](
            metadata,
            {
                pathToFile: fileName,
            },
        );
    }));

    const md = new MarkdownIt();

    if (metadata["Caption-Abstract"]) {
        relevantMetaData.CaptionAbstract = md.render(metadata["Caption-Abstract"]);
    } else {
        relevantMetaData.CaptionAbstract = null;
    }

    return relevantMetaData;
};

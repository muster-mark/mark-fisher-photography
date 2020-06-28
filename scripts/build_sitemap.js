const path = require("path");

const request = require("request-promise");
const sitemapGenerator = require("sitemap-generator");

const uploadToS3 = require("../local_modules/upload_to_s3");

const allowedDestinations = ["staging", "production"];

const destination = process.argv[2];

if (allowedDestinations.indexOf(destination) === -1) {
    console.error(`Please select one of the following destinations: ${allowedDestinations.join(" ")}`);
    process.exit();
}

require("dotenv").config({ path: `${__dirname}/../.${destination}.env` });

const filePath = path.resolve(`${__dirname}/../sitemap.xml`);
const fileName = path.resolve(filePath);

// create generator
const generator = sitemapGenerator(`https://${process.env.URL}`, {
    stripQuerystring: false,
    ignoreHreflang: true,
    lastMod: true,
    filepath: path.resolve(`${__dirname}/../sitemap.xml`),

});

// register event listeners
generator.on("add", (url) => {
    console.log(`Added page to sitemap: ${url}`);
});

generator.on("error", (error) => {
    console.log(error);
    process.exit();
});

generator.on("done", () => {
    console.log(`Finished building sitemap, and wrote to ${filePath}`);
    uploadToS3(process.env.S3_BUCKET, filePath, process.env.S3_REGION, process.env.S3_DELETE)
        .then(() => {
            console.log(`Sitemap uploaded to ${process.env.S3_BUCKET}.`);

            if (destination === "production") {
                return Promise.all([
                    request(`https://www.google.com/webmasters/sitemaps/ping?sitemap=https://${process.env.URL}/${fileName}`),
                    request(`http://www.bing.com/ping?sitemap=https://${process.env.URL}/${fileName}`),
                ]);
            }

            console.log("Not pinging search engines for staging.");

            return Promise.resolve(null);
        })
        .then((result) => {
            if (result) {
                console.log("Pinged Google and Bing about new sitemap.");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// start the crawler
generator.start();

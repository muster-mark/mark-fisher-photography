const path = require("path");
const https = require('https');
const sitemapGenerator = require("sitemap-generator");
const uploadToS3 = require("../local_modules/upload_to_s3");

const ping = function(url) {
    return new Promise((resolve, reject) => {
        const options = new URL(url);
        const req = https.request(options, res => {
            if (res.statusCode < 200 || res.statusCode > 299) {
                reject(`Status code for ${url} was ${res.statusCode}`);
            } else {
                resolve();
            }
        });
        req.end();
    });
}

const allowedDestinations = ["staging", "production"];

const destination = process.argv[2];

if (allowedDestinations.indexOf(destination) === -1) {
    console.error(`Please select one of the following destinations: ${allowedDestinations.join(" ")}`);
    process.exit();
}

require("dotenv").config({ path: `${__dirname}/../.${destination}.env` });

const filePath = path.resolve(`${__dirname}/../sitemap.xml`);
const sitemapUrl = `https://${process.env.URL}/sitemap.xml`;

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
        .then(async () => {
            console.log(`Sitemap uploaded to ${process.env.S3_BUCKET}.`);

            if (destination === "production") {
                const googleUrl = `https://www.google.com/webmasters/sitemaps/ping?sitemap=${sitemapUrl}`;
                const bingUrl = `https://www.bing.com/ping?sitemap=${sitemapUrl}`;

                console.log(`Pinging ${googleUrl}`);
                console.log(`Pinging ${bingUrl}`);

                return Promise.all([ping(googleUrl), ping(bingUrl)]);
            }

            console.log("Not pinging search engines for staging.");

            return Promise.resolve();
        })
        .then((result) => {
            if (result) {
                console.log("Successfully Pinged Google and Bing about new sitemap.");
            }
        })
        .catch((err) => {
            console.log(err);
        });
});

// start the crawler
generator.start();

/**
 * @file Deploys public directory to S3 bucket
 * @type {module:path | path.PlatformPath | path}
 */

import path from "node:path";

const clearCloudFrontCache = require("../local_modules/clear_cloudfront_cache");
const syncS3Bucket = require("../local_modules/sync_s3_bucket");

function printUsage(exitCode = 1, message: string|null = null) {
    if (message) {
        console.log(message);
    }
    console.log(`Usage: node ${path.basename(__filename)} [--dryrun]`);
    process.exit(exitCode);
}

const main = async function main() {
    let isDryRun = false;

    console.log("process.arg.env", process.argv);
    if (process.argv.length > 2) {
        if (process.argv.length > 3 || process.argv[2] !== "--dryrun") {
            printUsage(3);
        }

        isDryRun = true;
    }

    const syncResult = await syncS3Bucket(
        process.env.S3_BUCKET,
        "",
        process.env.S3_REGION,
        process.env.S3_DELETE === "true",
        isDryRun,
    );

    console.log(`${syncResult}`);

    if (isDryRun) {
        console.log("Not invalidating CDN for dry run");
    } else if (!syncResult) {
        console.log("Not invalidating CDN as no changes to sync");
    } else {
        clearCloudFrontCache(
            process.env.DISTRIBUTION_ID,
            process.env.CF_INVALIDATOR_KEY,
            process.env.CF_INVALIDATOR_SECRET,
        );
    }
};

main();

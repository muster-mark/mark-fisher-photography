/**
 * @file Deploys public directory to S3 bucket
 * @type {module:path | path.PlatformPath | path}
 */

const path = require("path");
const dotEnv = require("dotenv");

const clearCloudFrontCache = require("../local_modules/clear_cloudfront_cache");
const syncS3Bucket = require("../local_modules/sync_s3_bucket");

function printUsage(exitCode = 1, message: string = null) {
    if (message) {
        console.log(message);
    }
    console.log(`Usage: node ${path.basename(__filename)} [--dryrun] staging|production`);
    process.exit(exitCode);
}

const main = async function main() {

    const destination = process.argv.pop();

    if (["staging", "production"].indexOf(destination) === -1) {
        console.error("Invalid destination");
        printUsage(2);
    }

    dotEnv.config({ path: `${__dirname}/../.${destination}.env` });

    let isDryRun = false;

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
        process.env.S3_DELETE,
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

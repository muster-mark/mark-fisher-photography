const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);

module.exports = async function syncS3Bucket(bucketName: string, key = "", bucketRegion: string, deleteRemoved: boolean, dryRun: boolean) {
    // Syncs the public directory to a bucket

    const excludes = [
        "entrypoints.json",
        "manifest.json",
        ".DS_Store",
    ];

    let excludeArgs = "";

    excludes.forEach((item) => {
        excludeArgs += ` --exclude="${item}" `;
    });

    const deleteArg = deleteRemoved ? "--delete" : "";

    const dryRunArg = dryRun ? "--dryrun" : "";

    const cmd = `aws2 s3 sync ${__dirname}/../public${key} s3://${bucketName}${key} ${dryRunArg} ${deleteArg} --region=${bucketRegion} ${excludeArgs} --acl="public-read" --size-only`;

    console.log("Syncing to S3");
    console.log(cmd);

    const { stdout, stderr } = await exec(cmd);

    if (stderr) {
        throw new Error(`There was a problem syncing to ${bucketName}: ${stderr}`);
    }

    return Promise.resolve(stdout);
};

const util = require('util');
const exec = util.promisify(require('child_process').exec);


module.exports = async function syncS3(bucketName, bucketRegion, deleteRemoved, dryRun) {

    const excludes = [
        'entrypoints.json',
        'manifest.json',
        '.DS_Store',
    ];

    let excludeArgs = '';

    excludes.forEach(function(item) {
        excludeArgs += ` --exclude="${item}" `
    });

    const deleteArg = deleteRemoved ? '--delete' : '';

    const dryRunArg = dryRun ? '--dryrun' : '';

    let cmd = `aws2 s3 sync ${__dirname}/../public s3://${bucketName} ${dryRunArg} ${deleteArg} --region=${bucketRegion} --size-only ${excludeArgs} --acl="public-read"`;

    console.log('Syncing to S3');
    console.log(cmd);

    let {stdout, stderr} = await exec(cmd);

    if (stderr) {
        console.error('There was a problem syncing');
        process.exit(1);
    }

    return Promise.resolve(stdout);
}

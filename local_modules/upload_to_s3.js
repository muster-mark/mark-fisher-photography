const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');


module.exports = async function uploadToS3(bucketName, file, bucketRegion) {
    //Uploads a file to an S3 bucket

    let cmd = `aws2 s3 cp ${file} s3://${bucketName}/${path.basename(file)} --region=${bucketRegion} --acl="public-read"`;

    console.log(`Uploading ${file} to bucket: ${bucketName}`);
    console.log(cmd);

    let {stdout, stderr} = await exec(cmd);

    if (stderr) {
        console.error('There was a problem uploading');
        process.exit(1);
    }

    return Promise.resolve(stdout);
};

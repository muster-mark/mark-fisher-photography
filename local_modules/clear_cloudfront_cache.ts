import AWS, { AWSError } from "aws-sdk";
import { CreateInvalidationResult } from "aws-sdk/clients/cloudfront";

export default function clearCloudfrontCache(distributionId: string, key: string, secret: string) {
    const config = new AWS.Config({
        accessKeyId: key,
        secretAccessKey: secret,
        region: 'us-west-2', // CF is global
    });

    const cloudfront = new AWS.CloudFront(config);

    const invalidationParams = {
        DistributionId: distributionId, /* required */
        InvalidationBatch: { /* required */
            CallerReference: Date.now().toString(), // required - unique identifier to prevent multiple requests
            Paths: { // required
                Quantity: 1, // required
                Items: [
                    '/*',
                ],
            },
        },
    };

    cloudfront.createInvalidation(invalidationParams, (err: AWSError, data: CreateInvalidationResult) => {
        if (err) {
            throw new Error(`Could not invalidate the cache for distribution ${distributionId}: ${err.message}`);
        }
        console.log(`Invalidated CF cache for distribution: ${distributionId}`);
        console.log(data);
    });
};

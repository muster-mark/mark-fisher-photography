import { CloudFrontClient, CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

export default function clearCloudfrontCache(distributionId: string, key: string, secret: string) {
    const client = new CloudFrontClient({
        region: "us-west-2",
        credentials: {
            accessKeyId: key,
            secretAccessKey: secret,
        },
    });
    const input = {
        DistributionId: distributionId,
        InvalidationBatch: {
            Paths: {
                Quantity: 1,
                Items: ["/*"],
            },
            CallerReference: Date.now().toString(),
        },
    };
    const command = new CreateInvalidationCommand(input);
    client.send(command).then((data) => {
        console.log(`Invalidated CF cache for distribution: ${distributionId}`);
        console.log(data);
    });
}

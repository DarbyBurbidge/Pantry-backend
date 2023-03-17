import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
export const getSecrets = async () => {
    let secrets = {};
    const secret_name = "easypantry-secrets";
    const client = new SecretsManagerClient({
        region: "us-east-2",
    });
    try {
        const secretManager = await client.send(new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT",
        }));
        secrets = JSON.parse(secretManager?.SecretString);
    }
    catch (err) {
        console.error(err);
    }
    if (secrets) {
        process.env.DB_URI = secrets.DB_URI;
        process.env.PORT = secrets.PORT;
        process.env.REFRESH_TOKEN_SECRET = secrets.REFRESH_TOKEN_SECRET;
        process.env.REFRESH_TOKEN_PUBLIC = secrets.REFRESH_TOKEN_PUBLIC;
        process.env.ACCESS_TOKEN_SECRET = secrets.ACCESS_TOKEN_SECRET;
        process.env.ACCESS_TOKEN_PUBLIC = secrets.ACCESS_TOKEN_PUBLIC;
    }
    else {
        throw new Error("Unable to retrieve secrets");
    }
};
//# sourceMappingURL=AWSsecrets.js.map
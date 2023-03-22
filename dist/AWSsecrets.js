import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv";
export const getSecrets = async () => {
    const secret_name = "easypantry-secrets";
    const client = new SecretsManagerClient({
        region: "us-east-2"
    });
    try {
        const secretManager = await client.send(new GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: "AWSCURRENT",
        }));
        const parsed = dotenv.parse(secretManager.SecretString);
        Object.keys(parsed).forEach((key) => {
            process.env[key] = parsed[key];
        });
    }
    catch (err) {
        console.error(err);
    }
};
//# sourceMappingURL=AWSsecrets.js.map
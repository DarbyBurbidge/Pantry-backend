import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import dotenv from "dotenv"


export const getSecrets = async () => {
    const secret_name = "easypantry-secrets";

    const client = new SecretsManagerClient({
        region: "us-east-2"
    });
    
    try {  
        const secretManager = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
        // Next section taken straight from dotenv itself
        // the library doesn't normally allow processing of external objects
        const parsed = dotenv.parse(secretManager.SecretString!)
        Object.keys(parsed).forEach((key) => {
            process.env[key] = parsed[key]
        })
    } catch (err) {
        console.error(err)
    }
}

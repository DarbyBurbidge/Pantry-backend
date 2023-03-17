import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

interface Secrets {
    DB_URI?: string
    PORT?: string
    REFRESH_TOKEN_PUBLIC?: string
    REFRESH_TOKEN_SECRET?: string
    ACCESS_TOKEN_PUBLIC?: string
    ACCESS_TOKEN_SECRET?: string
}



export const getSecrets = async () => {
    let secrets: Secrets = {}
    const secret_name = "easypantry-secrets";

    const client = new SecretsManagerClient({
    region: "us-east-2",
    });
    
    try {  
        const secretManager = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
            })
        );
        secrets = JSON.parse(secretManager?.SecretString!)
    } catch (err) {
        console.error(err)
    }
    
    if (secrets) {
        process.env.DB_URI = secrets.DB_URI
        process.env.PORT = secrets.PORT
        process.env.REFRESH_TOKEN_SECRET = secrets.REFRESH_TOKEN_SECRET
        process.env.REFRESH_TOKEN_PUBLIC = secrets.REFRESH_TOKEN_PUBLIC
        process.env.ACCESS_TOKEN_SECRET = secrets.ACCESS_TOKEN_SECRET
        process.env.ACCESS_TOKEN_PUBLIC = secrets.ACCESS_TOKEN_PUBLIC
    } else {
        throw new Error("Unable to retrieve secrets")
    }
}

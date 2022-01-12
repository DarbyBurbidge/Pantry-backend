import crypto from "crypto-js"



export const verifyPassword = (password: string, salt: string, hash: string) => {
    const genHash = crypto.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();
    return (genHash == hash);
}


export const hashPassword = (password: string) => {
    const salt = crypto.lib.WordArray.random(32).toString();
    const genHash = crypto.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();

    return {
        salt: salt,
        hash: genHash
    };
}
import crypto from "crypto-js";
export const verifyPassword = (password, salt, hash) => {
    const genHash = crypto.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();
    return (genHash == hash);
};
export const hashPassword = (password) => {
    const salt = crypto.lib.WordArray.random(32).toString();
    const genHash = crypto.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();
    return {
        salt: salt,
        hash: genHash
    };
};
export const generateDate = (date) => {
    if (date == 'N/A') {
        return date;
    }
    const seperated = date.split('-');
    const day = parseInt(seperated[2]);
    const month = parseInt(seperated[1]);
    const year = seperated[0].substring(seperated.length - 1);
    return `${month}/${day}/${year}`;
};
//# sourceMappingURL=utils.js.map
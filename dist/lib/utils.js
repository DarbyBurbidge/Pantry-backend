"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = exports.verifyPassword = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const verifyPassword = (password, salt, hash) => {
    const genHash = crypto_js_1.default.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();
    return (genHash == hash);
};
exports.verifyPassword = verifyPassword;
const hashPassword = (password) => {
    const salt = crypto_js_1.default.lib.WordArray.random(32).toString();
    const genHash = crypto_js_1.default.PBKDF2(password, salt, {
        keySize: 64,
        iterations: 10000
    }).toString();
    return {
        salt: salt,
        hash: genHash
    };
};
exports.hashPassword = hashPassword;
//# sourceMappingURL=utils.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToParent = exports.deleteFromParent = exports.generateDate = exports.hashPassword = exports.verifyPassword = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const crypto_js_1 = __importDefault(require("crypto-js"));
const shoppingList_model_1 = require("../models/shoppingList.model");
const user_model_1 = require("../models/user.model");
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
const generateDate = (date) => {
    if (date == 'N/A') {
        return date;
    }
    const seperated = date.split('-');
    const day = parseInt(seperated[2]);
    const month = parseInt(seperated[1]);
    const year = seperated[0].substring(seperated.length - 1);
    return `${month}/${day}/${year}`;
};
exports.generateDate = generateDate;
exports.deleteFromParent = {
    'user': async (_id) => {
        await (0, typegoose_1.getModelForClass)(user_model_1.User).findOneAndUpdate({ $in: { itemIds: _id } }, { $pull: { itemIds: _id } });
    },
    'list': async (_id) => {
        await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findOneAndUpdate({ $in: { itemIds: _id } }, { $pull: { itemIds: _id } });
    },
    'default': async () => {
        throw new Error("Unable to locate parent");
    }
};
exports.addToParent = {
    'user': async (parentId, _id) => {
        try {
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findByIdAndUpdate(parentId, { $addToSet: { itemIds: _id } });
        }
        catch (err) {
            console.error(err);
        }
    },
    'list': async (parentId, _id) => {
        try {
            await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findByIdAndUpdate(parentId, { $addToSet: { itemIds: _id } });
        }
        catch (err) {
            console.error(err);
        }
    },
    'default': () => {
        throw new Error("No parent specified");
    }
};
//# sourceMappingURL=utils.js.map
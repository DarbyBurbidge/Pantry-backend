import { getModelForClass, mongoose } from "@typegoose/typegoose";
import crypto from "crypto-js"
import { ShoppingList } from "../models/shoppingList.model";
import { User } from "../models/user.model";


/* Password Utils */
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


/* Date Utils */
export const generateDate = (date: string) => {
    if (date == 'N/A') {
        return date
    }
    const seperated = date.split('-')
    const day = parseInt(seperated[2])
    const month = parseInt(seperated[1])
    const year = seperated[0].substring(seperated.length - 1);
    return `${month}/${day}/${year}`
}


/* Resolver Utils */
interface ObjectLiteral {
  [key: string]: any;
}


export const deleteFromParent: ObjectLiteral = {
    'user': async (_id: mongoose.Types.ObjectId) => {
        await getModelForClass(User).findOneAndUpdate({$in: {itemIds: _id}}, {$pull: {itemIds: _id}});
    },
    'list': async (_id: mongoose.Types.ObjectId) => {
        await getModelForClass(ShoppingList).findOneAndUpdate({$in: {itemIds: _id}}, {$pull: {itemIds: _id}});
    },
    'default': async () => {
        throw new Error("Unable to locate parent");
    }
};

export const addToParent: ObjectLiteral = {
    'user': async (parentId: string, _id: string) => {
        try {
            await getModelForClass(User).findByIdAndUpdate(parentId, { $addToSet: { itemIds: _id } });
        } catch (err) {
            console.error(err)
            //throw new Error(err)
        }
    },
    'list': async (parentId: string, _id: string) => {
        try {
            await getModelForClass(ShoppingList).findByIdAndUpdate(parentId, { $addToSet: { itemIds: _id } });
        } catch (err) {
            console.error(err);
            //throw new Error(err)
        }
    },
    'default': () => {
        throw new Error("No parent specified");
    }
};
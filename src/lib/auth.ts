import jwt from "jsonwebtoken";
const { sign } = jwt;
import { Response } from "express";
import { User } from "../models/user.model.js";


export const createAccessToken = (user: User) => {
    return sign({ userId: user._id.toString(), listId: user.shoppingListId}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: "1m", algorithm: 'ES512'});
};

export const createRefreshToken = (user: User) => {
    return sign({ userId: user._id.toString(), tokenVersion: user.tokenVersion }, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: "7d", algorithm: 'ES512'});
};

export const sendRefreshToken = (res: Response, token: string) => {
    res.cookie(
        "jid",
        token,
        {
            httpOnly: true,
            path: '/refresh',
            sameSite: 'strict',
            secure: true
        }
    );
};

import { User } from "../models/user.model";
import { sign } from "jsonwebtoken";
import { Response } from "express";


export const createAccessToken = (user: User) => {
    return sign({ userId: user._id.toString()}, process.env.ACCESS_TOKEN_SECRET!, {expiresIn: "15m", algorithm: 'ES512'});
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
            path: '/refresh_token',
            sameSite: 'none'
        }
    );
};

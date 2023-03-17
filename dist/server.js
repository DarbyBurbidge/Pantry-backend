import { getModelForClass } from "@typegoose/typegoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { verify } from "jsonwebtoken";
import { User } from "./models/user.model.js";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "./lib/auth.js";
export const app = express();
app.use(cors({
    origin: ['https://www.easypantry.app', 'https://easypantry.app', 'http://app.localhost:3000'],
    credentials: true,
    maxAge: 7200,
    methods: "GET,POST"
}));
app.use(cookieParser());
app.use(express.json());
app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    console.log("attempting refresh");
    if (!token) {
        return res.send({ ok: false, accessToken: '' });
    }
    let payload = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_PUBLIC, { algorithms: ['ES512'] });
    }
    catch (err) {
        console.error(err);
        return res.send({ ok: false, accessToken: '' });
    }
    const user = await getModelForClass(User).findOne({ _id: payload.userId });
    if (!user) {
        console.log("user not found");
        return res.send({ ok: false, accessToken: '' });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
        console.log("token version outdated");
        return res.send({ ok: false, accessToken: '' });
    }
    console.log("sending refresh");
    sendRefreshToken(res, createRefreshToken(user));
    console.log("sending access");
    return res.send({ ok: true, accessToken: createAccessToken(user) });
});
//# sourceMappingURL=server.js.map
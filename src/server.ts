// NPM MODULES
import { getModelForClass } from "@typegoose/typegoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import { verify } from "jsonwebtoken";
// DEV MODULES
import { User } from "./models/user.model.js";
import { createAccessToken, createRefreshToken, sendRefreshToken } from "./lib/auth.js";


export const app = express();

app.use(cors({
    origin: ['https://www.easypantry.app', 'https://easypantry.app', 'http://localhost:3000', 'easypantry-loadbalancer-1590599396.us-east-2.elb.amazonaws.com'],
    credentials: true,
    maxAge: 7200,
    methods: "GET,POST" 
}));
app.use(cookieParser());
app.use(express.json());

app.get("/health", async (_, res) => {
    res.send()
})

app.post("/refresh", async (req: Request, res: Response) => {
    const token = req.cookies.jid;
    console.log("attempting refresh")

    //check they have a token
    if (!token) {
        return res.send({ ok: false, accessToken: '' })
    }

    //attempt to verify
    let payload: any = null;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_PUBLIC!, { algorithms: ['ES512'] })        
    } catch (err) {
        console.error(err);
        return res.send({ ok: false, accessToken: '' })
    }

    //token is valid
    //get user from database based on id stored in the token
    const user = await getModelForClass(User).findOne({_id: payload.userId})
    
    //if there's no user
    if(!user) {
        console.log("user not found")
        return res.send({ ok: false, accessToken: '' })
    }
    
    //if the token is outdated 
    //this is last because we are checking against the version associated with the user in the database
    if (user.tokenVersion !== payload.tokenVersion) {
        console.log("token version outdated")
        return res.send({ ok: false, accessToken: '' })
    }
    console.log("sending refresh")
    //create and send a new RefreshToken
    sendRefreshToken(res, createRefreshToken(user));
    console.log("sending access")
    //return a valid AccessToken
    return res.send({ ok: true, accessToken: createAccessToken(user)})
})

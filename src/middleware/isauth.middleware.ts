import { verify } from "jsonwebtoken"
import { Error } from "mongoose"
import { AppContext } from "../context/app.context"
import { MiddlewareFn } from "type-graphql"

/* Takes a Context */
/*  checks whether or not a particular user is authorized to visit */
export const isAuth: MiddlewareFn<AppContext> = ({context}, next) => {
    const authorization = context.req.headers['authorization']

    if (!authorization) {
        throw new Error("not authenticated");
    }
    try {
        const token = authorization?.split(' ')[1]
        const payload = verify(token, process.env.ACCESS_TOKEN_PUBLIC!, {algorithms: ['ES512']})
        context.payload = payload as any;
    } catch (err) {
        console.error(err);
        throw new Error("invalid token")
    }

    return next();
}
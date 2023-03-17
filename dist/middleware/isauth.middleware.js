import { verify } from "jsonwebtoken";
import { Error } from "mongoose";
export const isAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw new Error("not authenticated");
    }
    try {
        const token = authorization?.split(' ')[1];
        const payload = verify(token, process.env.ACCESS_TOKEN_PUBLIC, { algorithms: ['ES512'] });
        context.payload = payload;
    }
    catch (err) {
        console.error(err);
        throw new Error("invalid token");
    }
    return next();
};
//# sourceMappingURL=isauth.middleware.js.map
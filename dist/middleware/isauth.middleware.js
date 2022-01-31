"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const mongoose_1 = require("mongoose");
const isAuth = ({ context }, next) => {
    const authorization = context.req.headers['authorization'];
    if (!authorization) {
        throw new mongoose_1.Error("not authenticated");
    }
    try {
        const token = authorization === null || authorization === void 0 ? void 0 : authorization.split(' ')[1];
        const payload = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_PUBLIC, { algorithms: ['ES512'] });
        context.payload = payload;
    }
    catch (err) {
        console.error(err);
        throw new mongoose_1.Error("invalid token");
    }
    return next();
};
exports.isAuth = isAuth;
//# sourceMappingURL=isauth.middleware.js.map
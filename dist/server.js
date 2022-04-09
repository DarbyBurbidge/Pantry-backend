"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typegoose_1 = require("@typegoose/typegoose");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = require("jsonwebtoken");
const user_model_1 = require("./models/user.model");
const auth_1 = require("./lib/auth");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['https://www.thedarby.rocks'],
    credentials: true,
    maxAge: 7200,
    methods: "GET,POST"
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.post("/refresh_token", async (req, res) => {
    const token = req.cookies.jid;
    console.log("attempting refresh");
    if (!token) {
        return res.send({ ok: false, accessToken: '' });
    }
    let payload = null;
    try {
        payload = (0, jsonwebtoken_1.verify)(token, process.env.REFRESH_TOKEN_PUBLIC, { algorithms: ['ES512'] });
    }
    catch (err) {
        console.error(err);
        return res.send({ ok: false, accessToken: '' });
    }
    const user = await (0, typegoose_1.getModelForClass)(user_model_1.User).findOne({ _id: payload.userId });
    if (!user) {
        console.log("user not found");
        return res.send({ ok: false, accessToken: '' });
    }
    if (user.tokenVersion !== payload.tokenVersion) {
        console.log("token version outdated");
        return res.send({ ok: false, accessToken: '' });
    }
    console.log("sending refresh");
    (0, auth_1.sendRefreshToken)(res, (0, auth_1.createRefreshToken)(user));
    console.log("sending access");
    return res.send({ ok: true, accessToken: (0, auth_1.createAccessToken)(user) });
});
exports.default = app;
//# sourceMappingURL=server.js.map
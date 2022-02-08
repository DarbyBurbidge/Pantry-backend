"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const typegoose_1 = require("@typegoose/typegoose");
const jsonwebtoken_1 = require("jsonwebtoken");
const isauth_middleware_1 = require("../middleware/isauth.middleware");
const user_model_1 = require("../models/user.model");
const auth_1 = require("../lib/auth");
const utils_1 = require("../lib/utils");
const category_model_1 = require("../models/category.model");
const returnObject_resolver_1 = require("./returnObject.resolver");
let LoginResponse = class LoginResponse {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => user_model_1.User),
    __metadata("design:type", user_model_1.User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    (0, type_graphql_1.ObjectType)()
], LoginResponse);
let UserResolver = class UserResolver {
    hello() {
        return "working!";
    }
    bye({ payload }) {
        return `your user id is: ${payload.userId}`;
    }
    async currentUser(context) {
        const authorization = context.req.headers["authorization"];
        if (!authorization) {
            return null;
        }
        try {
            const token = authorization.split(' ')[1];
            const payload = (0, jsonwebtoken_1.verify)(token, process.env.ACCESS_TOKEN_PUBLIC, { algorithms: ['ES512'] });
            console.log(payload.userId);
            return await (0, typegoose_1.getModelForClass)(user_model_1.User).findById(payload.userId);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async login(email, password, { res }) {
        const user = await (0, typegoose_1.getModelForClass)(user_model_1.User).findOne({ email: `${email}` });
        if (!user) {
            throw new Error('could not find user');
        }
        if (!(0, utils_1.verifyPassword)(password, user.salt, user.pw_hash)) {
            throw new Error('password invalid');
        }
        (0, auth_1.sendRefreshToken)(res, (0, auth_1.createRefreshToken)(user));
        return {
            accessToken: (0, auth_1.createAccessToken)(user),
            user
        };
    }
    async register(email, password) {
        const saltHash = (0, utils_1.hashPassword)(password);
        try {
            const user = await (0, typegoose_1.getModelForClass)(user_model_1.User).create({ email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
            await (0, typegoose_1.getModelForClass)(category_model_1.Category).create({ categoryName: 'Your Pantry', userId: user._id });
        }
        catch (err) {
            console.log(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async registerAndLogin(email, password, { res }) {
        const saltHash = (0, utils_1.hashPassword)(password);
        try {
            const user = await (0, typegoose_1.getModelForClass)(user_model_1.User).create({ email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
            await (0, typegoose_1.getModelForClass)(category_model_1.Category).create({ categoryName: 'Your Pantry', userId: user._id });
            (0, auth_1.sendRefreshToken)(res, (0, auth_1.createRefreshToken)(user));
            return {
                accessToken: (0, auth_1.createAccessToken)(user),
                user
            };
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async editUser(email, password, { payload }) {
        const saltHash = (0, utils_1.hashPassword)(password);
        try {
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findOneAndUpdate({ _id: payload === null || payload === void 0 ? void 0 : payload.userId }, { email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
        }
        catch (err) {
            console.log(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async logout({ res }) {
        (0, auth_1.sendRefreshToken)(res, "");
        return { message: "OK", return: true };
    }
    async categories(user) {
        try {
            return await (0, typegoose_1.getModelForClass)(category_model_1.Category).find({ userId: user === null || user === void 0 ? void 0 : user._id });
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "hello", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "bye", null);
__decorate([
    (0, type_graphql_1.Query)(() => user_model_1.User, { nullable: true }),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "currentUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LoginResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => LoginResponse),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerAndLogin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __param(1, (0, type_graphql_1.Arg)('password')),
    __param(2, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [category_model_1.Category]),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "categories", null);
UserResolver = __decorate([
    (0, type_graphql_1.Resolver)(user_model_1.User)
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=user.resolver.js.map
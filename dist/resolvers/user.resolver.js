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
import { Arg, Field, Ctx, FieldResolver, Mutation, ObjectType, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { getModelForClass } from "@typegoose/typegoose";
import { verify } from "jsonwebtoken";
import { isAuth } from "../middleware/isauth.middleware.js";
import { User } from "../models/user.model.js";
import { Item } from "../models/item.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";
import { sendRefreshToken, createRefreshToken, createAccessToken } from "../lib/auth.js";
import { hashPassword, verifyPassword } from "../lib/utils.js";
let LoginResponse = class LoginResponse {
    accessToken;
    user;
};
__decorate([
    Field(),
    __metadata("design:type", String)
], LoginResponse.prototype, "accessToken", void 0);
__decorate([
    Field(() => User),
    __metadata("design:type", User)
], LoginResponse.prototype, "user", void 0);
LoginResponse = __decorate([
    ObjectType()
], LoginResponse);
let UserResolver = class UserResolver {
    async currentUser(context) {
        const authorization = context.req.headers["authorization"];
        if (!authorization) {
            return null;
        }
        try {
            const token = authorization.split(' ')[1];
            const payload = verify(token, process.env.ACCESS_TOKEN_PUBLIC, { algorithms: ['ES512'] });
            console.log(payload.userId);
            return await getModelForClass(User).findById(payload.userId);
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    async login(email, password, { res }) {
        const user = await getModelForClass(User).findOne({ email: `${email}` });
        if (!user) {
            throw new Error('could not find user');
        }
        if (!verifyPassword(password, user.salt, user.pw_hash)) {
            throw new Error('password invalid');
        }
        sendRefreshToken(res, createRefreshToken(user));
        return {
            accessToken: createAccessToken(user),
            user
        };
    }
    async register(email, password) {
        const saltHash = hashPassword(password);
        try {
            const user = await getModelForClass(User).create({ email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
            if (user._id) {
                return true;
            }
            throw new Error("user could not be created");
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async registerAndLogin(email, password, { res }) {
        const saltHash = hashPassword(password);
        try {
            const user = await getModelForClass(User).create({ email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
            sendRefreshToken(res, createRefreshToken(user));
            return {
                accessToken: createAccessToken(user),
                user
            };
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async editUser(email, password, { payload }) {
        const saltHash = hashPassword(password);
        try {
            return await getModelForClass(User).findOneAndUpdate({ _id: payload?.userId }, { email: `${email}`, salt: `${saltHash.salt}`, pw_hash: `${saltHash.hash}` });
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async logout({ res }) {
        sendRefreshToken(res, "");
        return true;
    }
    async items(user) {
        try {
            return await getModelForClass(Item).find({ _id: { $in: user.itemIds } });
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async shoppingList(user) {
        try {
            return await getModelForClass(ShoppingList).findById(user.shoppingListId);
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
};
__decorate([
    Query(() => User, { nullable: true }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "currentUser", null);
__decorate([
    Mutation(() => LoginResponse),
    __param(0, Arg('email')),
    __param(1, Arg('password')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Arg('email')),
    __param(1, Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    Mutation(() => LoginResponse),
    __param(0, Arg('email')),
    __param(1, Arg('password')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "registerAndLogin", null);
__decorate([
    Mutation(() => User),
    UseMiddleware(isAuth),
    __param(0, Arg('email')),
    __param(1, Arg('password')),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "editUser", null);
__decorate([
    Mutation(() => Boolean),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "logout", null);
__decorate([
    FieldResolver(() => [Item]),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "items", null);
__decorate([
    FieldResolver(() => ShoppingList),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "shoppingList", null);
UserResolver = __decorate([
    Resolver(User)
], UserResolver);
export { UserResolver };
//# sourceMappingURL=user.resolver.js.map
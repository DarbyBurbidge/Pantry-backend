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
exports.ItemResolver = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const item_model_1 = require("../models/item.model");
const type_graphql_1 = require("type-graphql");
const isauth_middleware_1 = require("../middleware/isauth.middleware");
const returnObject_resolver_1 = require("./returnObject.resolver");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../lib/utils");
let ItemResolver = class ItemResolver {
    async getItems() {
        return await (0, typegoose_1.getModelForClass)(item_model_1.Item).find();
    }
    async addItem(itemName, expiration, quantity, tags, { payload }) {
        try {
            const date = (0, utils_1.generateDate)(expiration);
            const item = await (0, typegoose_1.getModelForClass)(item_model_1.Item).create({ itemName: itemName, expiration: date, quantity: quantity, tags: tags });
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { $addToSet: { itemIds: item._id } });
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async editItem(_id, itemName, expiration, quantity, { payload }) {
        try {
            const date = (0, utils_1.generateDate)(expiration);
            await (0, typegoose_1.getModelForClass)(item_model_1.Item).findOneAndUpdate({ _id: _id, userId: payload === null || payload === void 0 ? void 0 : payload.userId }, { itemName: itemName, expiration: date, quantity: quantity });
        }
        catch (err) {
            console.log(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async deleteItem(_id) {
        try {
            await (0, typegoose_1.getModelForClass)(item_model_1.Item).findByIdAndDelete(_id);
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [item_model_1.Item], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "getItems", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('itemName')),
    __param(1, (0, type_graphql_1.Arg)('expiration')),
    __param(2, (0, type_graphql_1.Arg)('quantity')),
    __param(3, (0, type_graphql_1.Arg)('tags', () => [String])),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Array, Object]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "addItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id')),
    __param(1, (0, type_graphql_1.Arg)('itemName')),
    __param(2, (0, type_graphql_1.Arg)('expiration')),
    __param(3, (0, type_graphql_1.Arg)('quantity')),
    __param(4, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "editItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "deleteItem", null);
ItemResolver = __decorate([
    (0, type_graphql_1.Resolver)(item_model_1.Item)
], ItemResolver);
exports.ItemResolver = ItemResolver;
//# sourceMappingURL=item.resolver.js.map
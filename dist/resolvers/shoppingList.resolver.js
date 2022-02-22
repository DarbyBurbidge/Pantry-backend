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
exports.ShoppingListResolver = void 0;
const typegoose_1 = require("@typegoose/typegoose");
const type_graphql_1 = require("type-graphql");
const item_model_1 = require("../models/item.model");
const shoppingList_model_1 = require("../models/shoppingList.model");
const returnObject_resolver_1 = require("./returnObject.resolver");
const isauth_middleware_1 = require("../middleware/isauth.middleware");
const user_model_1 = require("../models/user.model");
const utils_1 = require("../lib/utils");
let ShoppingListResolver = class ShoppingListResolver {
    async addShoppingList({ payload }) {
        try {
            const shoppingList = await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).create({ itemIds: [] });
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { shoppingListId: shoppingList._id });
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async deleteShoppingList(shoppingListId, { payload }) {
        try {
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { shoppingListId });
            await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findByIdAndDelete(shoppingListId);
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async addListItem(itemName, expiration, quantity, tags, listId) {
        try {
            const date = (0, utils_1.generateDate)(expiration);
            const item = await (0, typegoose_1.getModelForClass)(item_model_1.Item).create({ itemName: itemName, expiration: date, quantity: quantity, tags: tags });
            await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findByIdAndUpdate(listId, { $addToSet: { itemIds: item._id } });
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    deleteListItem() {
    }
    async items(shoppingList) {
        try {
            return await (0, typegoose_1.getModelForClass)(item_model_1.Item).find({ _id: { $in: shoppingList.itemIds } });
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "addShoppingList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('shoppingListId')),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "deleteShoppingList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('itemName')),
    __param(1, (0, type_graphql_1.Arg)('expiration')),
    __param(2, (0, type_graphql_1.Arg)('quantity')),
    __param(3, (0, type_graphql_1.Arg)('tags', () => [String])),
    __param(4, (0, type_graphql_1.Arg)('listId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Array, String]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "addListItem", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ShoppingListResolver.prototype, "deleteListItem", null);
__decorate([
    (0, type_graphql_1.FieldResolver)(() => [item_model_1.Item], { nullable: true }),
    __param(0, (0, type_graphql_1.Root)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "items", null);
ShoppingListResolver = __decorate([
    (0, type_graphql_1.Resolver)(shoppingList_model_1.ShoppingList)
], ShoppingListResolver);
exports.ShoppingListResolver = ShoppingListResolver;
//# sourceMappingURL=shoppingList.resolver.js.map
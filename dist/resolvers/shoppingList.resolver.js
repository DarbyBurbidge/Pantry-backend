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
let ShoppingListResolver = class ShoppingListResolver {
    async getShoppingList({ payload }) {
        const user = await (0, typegoose_1.getModelForClass)(user_model_1.User).findById({ _id: payload === null || payload === void 0 ? void 0 : payload.userId });
        return await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findById({ _id: user === null || user === void 0 ? void 0 : user.shoppingListId });
    }
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
    async deleteShoppingList({ payload }) {
        try {
            await (0, typegoose_1.getModelForClass)(user_model_1.User).findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, { shoppingListId: null });
            await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findByIdAndDelete(payload === null || payload === void 0 ? void 0 : payload.listId);
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
    }
    async migrateList(itemIds, { payload }) {
        try {
            const ItemDoc = (0, typegoose_1.getModelForClass)(item_model_1.Item);
            const UserDoc = (0, typegoose_1.getModelForClass)(user_model_1.User);
            const listItems = await ItemDoc.find({ _id: { $in: itemIds.map((id) => { return new typegoose_1.mongoose.Types.ObjectId(id); }) } });
            const user = await UserDoc.findById(payload === null || payload === void 0 ? void 0 : payload.userId);
            const userItemIds = user === null || user === void 0 ? void 0 : user.itemIds;
            const userItems = await ItemDoc.find({ _id: { $in: userItemIds === null || userItemIds === void 0 ? void 0 : userItemIds.map((id) => { return new typegoose_1.mongoose.Types.ObjectId(id); }) } });
            let conflictingItems = [];
            let newItemIds = [];
            if (userItems) {
                console.log('user found');
                listItems.forEach((listItem) => {
                    const hasConflict = userItems.some((userItem) => {
                        return (userItem.itemName === listItem.itemName) ? (conflictingItems.push({ userItem: userItem, listItem: listItem })) : (false);
                    });
                    !hasConflict ? newItemIds.push(listItem.id) : null;
                });
            }
            newItemIds.forEach((newItemId) => {
                console.log(`New Item: ${newItemId}`);
            });
            conflictingItems.forEach((conflictingItem) => {
                console.log(`Conflicts: ${conflictingItem.userItem.itemName} and ${conflictingItem.listItem.itemName}`);
            });
            conflictingItems.forEach(async (conflictingItem) => {
                await ItemDoc.findOneAndUpdate({
                    _id: conflictingItem.userItem._id
                }, {
                    quantity: conflictingItem.userItem.quantity + conflictingItem.listItem.quantity,
                    tags: [...new Set(conflictingItem.userItem.tags.concat(conflictingItem.listItem.tags))],
                    favorite: conflictingItem.userItem.favorite || conflictingItem.listItem.favorite
                });
                await ItemDoc.findByIdAndDelete(conflictingItem.listItem._id);
            });
            await UserDoc.findByIdAndUpdate(payload === null || payload === void 0 ? void 0 : payload.userId, {
                shoppingListId: null,
                itemIds: [
                    ...new Set(user === null || user === void 0 ? void 0 : user.itemIds.concat(newItemIds))
                ]
            });
            await (0, typegoose_1.getModelForClass)(shoppingList_model_1.ShoppingList).findByIdAndDelete(payload === null || payload === void 0 ? void 0 : payload.listId);
        }
        catch (err) {
            console.error(err);
            return { message: `${err}`, return: false };
        }
        return { message: "OK", return: true };
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
    (0, type_graphql_1.Query)(() => shoppingList_model_1.ShoppingList, { nullable: true }),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "getShoppingList", null);
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
    __param(0, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "deleteShoppingList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => returnObject_resolver_1.ReturnObject),
    (0, type_graphql_1.UseMiddleware)(isauth_middleware_1.isAuth),
    __param(0, (0, type_graphql_1.Arg)('itemIds', () => [String])),
    __param(1, (0, type_graphql_1.Ctx)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "migrateList", null);
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
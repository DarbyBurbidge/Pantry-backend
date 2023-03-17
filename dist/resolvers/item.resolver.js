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
import { getModelForClass } from "@typegoose/typegoose";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { Item } from "../models/item.model.js";
import { isAuth } from "../middleware/isauth.middleware.js";
import { generateDate } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";
let ItemResolver = class ItemResolver {
    async getItems() {
        return await getModelForClass(Item).find();
    }
    async addItem(itemName, expiration, quantity, tags, parentType, { payload }) {
        try {
            const date = generateDate(expiration);
            const item = await getModelForClass(Item).create({ itemName: itemName, expiration: date, quantity: quantity, tags: tags });
            parentType === "user" ? await getModelForClass(User).findByIdAndUpdate(payload?.userId, { $addToSet: { itemIds: item.id } }) : null;
            parentType === "list" ? await getModelForClass(ShoppingList).findByIdAndUpdate(payload?.listId, { $addToSet: { itemIds: item.id } }) : null;
            return item;
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async deleteItem(id, parentType) {
        try {
            parentType === "user" ? await getModelForClass(User).findOneAndUpdate({ $in: { itemIds: id } }, { $pull: { itemIds: id } }) : null;
            parentType === "list" ? await getModelForClass(ShoppingList).findOneAndUpdate({ $in: { itemIds: id } }, { $pull: { itemIds: id } }) : null;
            return await getModelForClass(Item).findByIdAndDelete(id);
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async editItem(id, itemName, expiration, quantity, { payload }) {
        try {
            const date = generateDate(expiration);
            return await getModelForClass(Item).findOneAndUpdate({ _id: id, userId: payload?.userId }, { itemName: itemName, expiration: date, quantity: quantity }, { new: true });
        }
        catch (err) {
            console.log(err);
            throw new Error(err);
        }
    }
    async toggleFavorite(id) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({ _id: id }, [{ $set: { favorite: { $eq: [false, "$favorite"] } } }], { new: true });
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async setQuant(id, newQuant) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({ _id: id }, { quantity: (newQuant < 0) ? 0 : newQuant }, { new: true });
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async setExp(id, newExp) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({ _id: id }, { expiration: newExp }, { new: true });
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async setName(id, newName) {
        try {
            return await getModelForClass(Item).findOneAndUpdate({ _id: id }, { itemName: newName }, { new: true });
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
};
__decorate([
    Query(() => [Item], { nullable: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "getItems", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('itemName')),
    __param(1, Arg('expiration')),
    __param(2, Arg('quantity')),
    __param(3, Arg('tags', () => [String])),
    __param(4, Arg('parentType')),
    __param(5, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Array, String, Object]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "addItem", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __param(1, Arg('parentType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "deleteItem", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __param(1, Arg('itemName')),
    __param(2, Arg('expiration')),
    __param(3, Arg('quantity')),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Number, Object]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "editItem", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "toggleFavorite", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __param(1, Arg('newQuant')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "setQuant", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __param(1, Arg('newExp')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "setExp", null);
__decorate([
    Mutation(() => Item),
    UseMiddleware(isAuth),
    __param(0, Arg('id')),
    __param(1, Arg('newName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ItemResolver.prototype, "setName", null);
ItemResolver = __decorate([
    Resolver(Item)
], ItemResolver);
export { ItemResolver };
//# sourceMappingURL=item.resolver.js.map
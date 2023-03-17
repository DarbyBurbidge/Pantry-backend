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
import { getModelForClass, mongoose } from "@typegoose/typegoose";
import { Arg, Ctx, FieldResolver, Mutation, Query, Resolver, Root, UseMiddleware } from "type-graphql";
import { Item } from "../models/item.model.js";
import { ShoppingList } from "../models/shoppingList.model.js";
import { isAuth } from "../middleware/isauth.middleware.js";
import { User } from "../models/user.model.js";
let ShoppingListResolver = class ShoppingListResolver {
    async getShoppingList({ payload }) {
        const user = await getModelForClass(User).findById({ _id: payload?.userId });
        return await getModelForClass(ShoppingList).findById({ _id: user?.shoppingListId });
    }
    async addShoppingList(itemIds, { payload }) {
        try {
            const items = await getModelForClass(Item).find({ _id: { $in: itemIds.map((id) => { return new mongoose.Types.ObjectId(id); }) } });
            const newItems = await Promise.all(items.map(async (userItem) => {
                return await getModelForClass(Item).create({
                    itemName: userItem.itemName,
                    expiration: userItem.expiration != 'N/A' ? () => {
                        const nextWeek = new Date();
                        nextWeek.setDate(nextWeek.getDate() + 7);
                        return nextWeek;
                    } : 'N/A',
                    quantity: 1,
                    tags: userItem.tags,
                    favorite: true
                });
            }));
            const shoppingList = await getModelForClass(ShoppingList).create({
                itemIds: newItems.map((newItem) => {
                    return newItem._id;
                })
            });
            return await getModelForClass(User).findByIdAndUpdate(payload?.userId, { shoppingListId: shoppingList._id });
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async deleteShoppingList({ payload }) {
        try {
            await getModelForClass(User).findByIdAndUpdate(payload?.userId, { shoppingListId: null });
            return await getModelForClass(ShoppingList).findByIdAndDelete(payload?.listId);
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async migrateList(itemIds, { payload }) {
        try {
            const ItemDoc = getModelForClass(Item);
            const UserDoc = getModelForClass(User);
            const listItems = await ItemDoc.find({ _id: { $in: itemIds.map((id) => { return new mongoose.Types.ObjectId(id); }) } });
            const user = await UserDoc.findById(payload?.userId);
            const userItemIds = user?.itemIds;
            const userItems = await ItemDoc.find({ _id: { $in: userItemIds?.map((id) => { return new mongoose.Types.ObjectId(id); }) } });
            let conflictingItems = [];
            let newItemIds = [];
            if (userItems) {
                listItems.forEach((listItem) => {
                    const hasConflict = userItems.some((userItem) => {
                        return (userItem.itemName === listItem.itemName) ? (conflictingItems.push({ userItem: userItem, listItem: listItem })) : (false);
                    });
                    !hasConflict ? newItemIds.push(listItem.id) : null;
                });
            }
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
            await UserDoc.findByIdAndUpdate(payload?.userId, {
                shoppingListId: null,
                itemIds: [
                    ...new Set(user?.itemIds.concat(newItemIds))
                ]
            });
            return await getModelForClass(ShoppingList).findByIdAndDelete(payload?.listId);
        }
        catch (err) {
            console.error(err);
            throw new Error(err);
        }
    }
    async items(shoppingList) {
        try {
            return await getModelForClass(Item).find({ _id: { $in: shoppingList.itemIds } });
        }
        catch (err) {
            console.error(err);
            return null;
        }
    }
};
__decorate([
    Query(() => ShoppingList, { nullable: true }),
    UseMiddleware(isAuth),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "getShoppingList", null);
__decorate([
    Mutation(() => ShoppingList),
    UseMiddleware(isAuth),
    __param(0, Arg('itemIds', () => [String])),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "addShoppingList", null);
__decorate([
    Mutation(() => ShoppingList),
    UseMiddleware(isAuth),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "deleteShoppingList", null);
__decorate([
    Mutation(() => ShoppingList),
    UseMiddleware(isAuth),
    __param(0, Arg('itemIds', () => [String])),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "migrateList", null);
__decorate([
    FieldResolver(() => [Item], { nullable: true }),
    __param(0, Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ShoppingListResolver.prototype, "items", null);
ShoppingListResolver = __decorate([
    Resolver(ShoppingList)
], ShoppingListResolver);
export { ShoppingListResolver };
//# sourceMappingURL=shoppingList.resolver.js.map
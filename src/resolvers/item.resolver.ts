import { getModelForClass } from "@typegoose/typegoose";
import { Item } from "../models/item.model";
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from "type-graphql";
import { AppContext } from "../context/app.context";
import { isAuth } from "../middleware/isauth.middleware";
import { ReturnObject } from "./returnObject.resolver";
import { generateDate } from "../lib/utils";
import { User } from "../models/user.model";
import { ShoppingList } from "../models/shoppingList.model";



@Resolver(Item)
export class ItemResolver {
    @Query(() => [Item], { nullable: true })
    async getItems() {
        return await getModelForClass(Item).find()
    }

    /* ADD ITEM */

    // Add to User
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async addItem(
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Arg('tags', () => [String]) tags: string[],
        @Arg('parentType') parentType: string,
        @Ctx() { payload }: AppContext
    ) {
        try { 
            const date = generateDate(expiration);
            const item = await getModelForClass(Item).create({itemName: itemName, expiration: date, quantity: quantity, tags: tags});
            parentType === "user" ? await getModelForClass(User).findByIdAndUpdate(payload?.userId, { $addToSet: {itemIds: item.id}}) : null;
            parentType === "list" ? await getModelForClass(ShoppingList).findByIdAndUpdate(payload?.listId, { $addToSet: {itemIds: item.id}}) : null;
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }


    /* Delete Item */
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async deleteItem(
        @Arg('id') id: string,
        @Arg('parentType') parentType: string,
    ) {
        try {
            parentType === "user" ? await getModelForClass(User).findOneAndUpdate({$in: {itemIds: id}}, {$pull: {itemIds: id}}) : null;
            parentType === "list" ?  await getModelForClass(ShoppingList).findOneAndUpdate({$in: {itemIds: id}}, {$pull: {itemIds: id}}): null;
            await getModelForClass(Item).findByIdAndDelete(id);
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }


    /* EDIT ITEM */
    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async editItem(
        @Arg('id') id: string,
        @Arg('itemName') itemName: string,
        @Arg('expiration') expiration: string,
        @Arg('quantity') quantity: number,
        @Ctx() { payload }: AppContext
    ) {
        try {
            const date = generateDate(expiration);
            await getModelForClass(Item).findOneAndUpdate({_id: id, userId: payload?.userId}, {itemName: itemName, expiration: date, quantity: quantity})
        } catch (err) {
            console.log(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }

    @Mutation(() => ReturnObject)
    @UseMiddleware(isAuth)
    async toggleFavorite(
        @Arg('id') id: string
    ) {
        try {
            await getModelForClass(Item).findOneAndUpdate({_id: id}, [{$set:{favorite:{$eq:[false,"$favorite"]}}}]);
        } catch (err) {
            console.error(err)
            return {message: `${err}`, return: false}
        }
        return {message: "OK", return: true}
    }
}